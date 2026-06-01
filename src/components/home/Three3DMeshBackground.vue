<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/*
 * Vertex shader: displaces a tessellated plane with FBm noise + perspective projection.
 * Produces a 3D-feeling wave terrain that drifts. The same noise drives a height field
 * used to color the surface (taller crests = secondary color, valleys = primary).
 */
const VERTEX_SRC = `#version 300 es
in vec2 a_pos;
out vec3 v_world;
out float v_height;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289v3(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 pos = a_pos;
  float h = fbm(pos * 1.4 + u_time * 0.18) * 0.42;
  v_height = h;

  // Iso projection: tilt the plane forward to fake 3D depth.
  float depth = pos.y * 0.65 + 0.5;
  vec2 projected = vec2(pos.x * (1.1 - pos.y * 0.18), pos.y * 0.9 + h * 0.35);
  v_world = vec3(pos, h);
  gl_Position = vec4(projected, 0.0, 1.0);
}`

const FRAGMENT_SRC = `#version 300 es
precision highp float;
in vec3 v_world;
in float v_height;
out vec4 outColor;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

void main() {
  float h = clamp(v_height * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(u_color3, u_color2, smoothstep(0.0, 0.6, h));
  col = mix(col, u_color1, smoothstep(0.55, 0.95, h));

  // Pseudo edge highlight on tall crests.
  col += vec3(0.04) * smoothstep(0.7, 1.0, h);
  outColor = vec4(col, 1.0);
}`

// MARK: - Variables
const canvasEl = ref<HTMLCanvasElement | null>(null)

let gl: WebGL2RenderingContext | null = null
let program: WebGLProgram | null = null
let rafId = 0
let startTime = 0
let timeLoc: WebGLUniformLocation | null = null
let resolutionLoc: WebGLUniformLocation | null = null
let color1Loc: WebGLUniformLocation | null = null
let color2Loc: WebGLUniformLocation | null = null
let color3Loc: WebGLUniformLocation | null = null
let vertexCount = 0

// MARK: - Methods
const compileShader = (
  g: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null => {
  const shader = g.createShader(type)
  if (!shader) {
    return null
  }
  g.shaderSource(shader, src)
  g.compileShader(shader)
  if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
    g.deleteShader(shader)
    return null
  }
  return shader
}

const cssVarRgb = (name: string): [number, number, number] => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const hex = raw.startsWith('#') ? raw.slice(1) : raw
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ]
  }
  return [0.5, 0.5, 0.5]
}

const buildGrid = (segments: number): Float32Array => {
  // Tessellated quad: two triangles per cell, segments × segments cells.
  const verts: number[] = []
  for (let y = 0; y < segments; y++) {
    for (let x = 0; x < segments; x++) {
      const x0 = (x / segments) * 2 - 1
      const x1 = ((x + 1) / segments) * 2 - 1
      const y0 = (y / segments) * 2 - 1
      const y1 = ((y + 1) / segments) * 2 - 1
      verts.push(x0, y0, x1, y0, x0, y1)
      verts.push(x0, y1, x1, y0, x1, y1)
    }
  }
  return new Float32Array(verts)
}

const resize = () => {
  const canvas = canvasEl.value
  if (!canvas || !gl) {
    return
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth * dpr
  const h = canvas.clientHeight * dpr
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, w, h)
  }
}

const render = (now: number) => {
  if (!gl || !program) {
    return
  }
  resize()
  const t = (now - startTime) / 1000
  gl.useProgram(program)
  gl.uniform1f(timeLoc, t)
  gl.uniform2f(resolutionLoc, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
  rafId = requestAnimationFrame(render)
}

// MARK: - Lifecycle
onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) {
    return
  }
  gl = canvas.getContext('webgl2')
  if (!gl) {
    return
  }

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
  if (!vs || !fs) {
    return
  }

  program = gl.createProgram()
  if (!program) {
    return
  }
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)

  const grid = buildGrid(120)
  vertexCount = grid.length / 2

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW)
  const posLoc = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  timeLoc = gl.getUniformLocation(program, 'u_time')
  resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
  color1Loc = gl.getUniformLocation(program, 'u_color1')
  color2Loc = gl.getUniformLocation(program, 'u_color2')
  color3Loc = gl.getUniformLocation(program, 'u_color3')

  const c1 = cssVarRgb('--site-secondary')
  const c2 = cssVarRgb('--site-primary')
  const c3 = cssVarRgb('--site-background')
  gl.uniform3f(color1Loc, c1[0], c1[1], c1[2])
  gl.uniform3f(color2Loc, c2[0], c2[1], c2[2])
  gl.uniform3f(color3Loc, c3[0], c3[1], c3[2])

  startTime = performance.now()
  rafId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<template lang="pug">
canvas.absolute.inset-0.z-0.block.h-full.w-full(ref="canvasEl" aria-hidden="true")
</template>
