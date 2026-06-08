/*
 * Postbuild dynamic Open Graph images: renders a branded 1200×630 card per page
 * (home, journal index, each post, each case study) via satori → resvg → JPEG,
 * written to dist/og/. Cards are emitted as JPEG (quality 82) so every card
 * stays well under ~100KB — under WhatsApp's ~300KB preview cutoff, where the
 * gradient-heavy PNGs (340–425KB) would silently fail to render. usePageSeo
 * points og:image at the matching .jpg path. Runs after `vite-ssg build`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Resvg } from '@resvg/resvg-js'
import satori, { type SatoriOptions } from 'satori'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const OG_DIR = join(DIST, 'og')

const SITE_NAME = 'Massimo De Luisa'
const ROLE = 'CTO & Product Engineer'

/* Dark-mode palette (theme.scss [data-theme='dark']) — every card uses it. */
const DARK_BG = '#121111'
const DARK_HEADING = '#f7f5e2'
const DARK_MUTED = '#a8a39a'
const DARK_RIM = 'rgba(247,245,226,0.14)'
const BRONZE = '#b68370'
const LAVENDER = '#8894a9'

/* Portrait as JPEG (satori can't parse the site's .webp) for the home card. */
const PORTRAIT = `data:image/jpeg;base64,${readFileSync(join(ROOT, 'scripts/og-portrait.jpg')).toString('base64')}`

type TFrontmatter = Record<string, string>
type TContentEntry = TFrontmatter & { slug: string }

interface ICardSpec {
  eyebrow: string
  title: string
  subtitle: string
}

type TSatoriStyle = Record<string, string | number | undefined>

interface ISatoriNode {
  type: string
  props: {
    style?: TSatoriStyle
    children?: string | ISatoriNode | Array<string | ISatoriNode>
    src?: string
    width?: number
    height?: number
  }
}

function parseFrontmatter(raw: string): TFrontmatter {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const data: TFrontmatter = {}
  if (match) {
    for (const line of match[1].split('\n')) {
      const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
      if (kv && kv[2] !== '') {
        data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
      }
    }
  }
  return data
}

/*
 * Content is a base `slug.md` (metadata) + per-locale copies `slug.<locale>.md`
 * (title/role). Only the base file is a real page; overlay the English copy as
 * the canonical locale so the card has a title/role. Locale-suffixed files must
 * NOT each render their own card.
 */
const LOCALE_SUFFIX = /\.(en|it|ja|ru|uk)\.md$/

function readContent(dir: string): TContentEntry[] {
  const folder = join(ROOT, 'src/contents', dir)
  if (!existsSync(folder)) {
    return []
  }
  return readdirSync(folder)
    .filter((file) => file.endsWith('.md') && !LOCALE_SUFFIX.test(file))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const base = parseFrontmatter(readFileSync(join(folder, file), 'utf8'))
      const enPath = join(folder, `${slug}.en.md`)
      const en = existsSync(enPath) ? parseFrontmatter(readFileSync(enPath, 'utf8')) : {}
      return { slug, ...base, ...en }
    })
}

const blog = readContent('blog')

/*
 * satori can't parse Geist's variable font (fvar table), so the cards use static
 * Inter .woff weights from @fontsource (the site itself still ships Geist).
 */
const FONT_DIR = join(ROOT, 'node_modules/@fontsource/inter/files')
const WEIGHTS = [400, 600, 700] as const
const FONTS: SatoriOptions['fonts'] = WEIGHTS.map((weight) => ({
  name: 'Inter',
  data: readFileSync(join(FONT_DIR, `inter-latin-${weight}-normal.woff`)),
  weight,
  style: 'normal' as const,
}))

function text(content: string, style: TSatoriStyle): ISatoriNode {
  return { type: 'div', props: { style: { display: 'flex', ...style }, children: content } }
}

/* A soft radial blob — evokes the home hero's animated mesh-gradient background. */
function blob(style: TSatoriStyle): ISatoriNode {
  return {
    type: 'div',
    props: { style: { position: 'absolute', display: 'flex', borderRadius: '9999px', ...style } },
  }
}

/* The shared dark backdrop: bronze + azzurro mesh blobs over the dark background. */
function meshBlobs(): ISatoriNode[] {
  return [
    blob({
      width: '880px',
      height: '880px',
      right: '-160px',
      bottom: '-300px',
      opacity: 0.72,
      backgroundImage: `radial-gradient(circle, ${BRONZE}, transparent 70%)`,
    }),
    blob({
      width: '760px',
      height: '760px',
      left: '-200px',
      top: '-260px',
      opacity: 0.55,
      backgroundImage: `radial-gradient(circle, ${LAVENDER}, transparent 70%)`,
    }),
    blob({
      width: '520px',
      height: '520px',
      right: '300px',
      top: '-220px',
      opacity: 0.45,
      backgroundImage: `radial-gradient(circle, ${BRONZE}, transparent 68%)`,
    }),
  ]
}

function darkFrame(content: ISatoriNode): ISatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: DARK_BG,
        fontFamily: 'Inter',
      },
      children: [...meshBlobs(), content],
    },
  }
}

/* Content card (journal index, post, case study): the dark hero treatment, text only. */
function card({ eyebrow, title, subtitle }: ICardSpec): ISatoriNode {
  return darkFrame({
    type: 'div',
    props: {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '90px',
      },
      children: [
        text(eyebrow, { fontSize: 27, fontWeight: 600, color: BRONZE, letterSpacing: '5px', textTransform: 'uppercase' }),
        text(title, {
          fontSize: 66,
          fontWeight: 700,
          color: DARK_HEADING,
          lineHeight: 1.06,
          letterSpacing: '-2px',
          marginTop: '26px',
        }),
        ...(subtitle
          ? [text(subtitle, { fontSize: 30, fontWeight: 400, color: DARK_MUTED, lineHeight: 1.34, marginTop: '26px' })]
          : []),
      ],
    },
  })
}

/* Home card: the hero in dark mode — mesh blobs, the name, and the portrait. */
function homeCard(): ISatoriNode {
  const nameStyle: TSatoriStyle = {
    fontSize: 86,
    fontWeight: 700,
    color: DARK_HEADING,
    lineHeight: 1.02,
    letterSpacing: '-3px',
  }
  return darkFrame({
    type: 'div',
    props: {
      style: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '84px',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', width: '640px' },
            children: [
              text(ROLE, {
                fontSize: 27,
                fontWeight: 600,
                color: BRONZE,
                letterSpacing: '5px',
                textTransform: 'uppercase',
              }),
              {
                type: 'div',
                props: {
                  /* Two lines so the surname never splits: "Massimo" / "De Luisa". */
                  style: { display: 'flex', flexDirection: 'column', marginTop: '22px' },
                  children: [text('Massimo', nameStyle), text('De Luisa', nameStyle)],
                },
              },
              text('Platforms, mobile apps & AI-assisted workflows that stay simple under pressure.', {
                fontSize: 30,
                fontWeight: 400,
                color: DARK_MUTED,
                lineHeight: 1.34,
                marginTop: '30px',
              }),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '372px',
              height: '372px',
              flexShrink: 0,
              borderRadius: '36px',
              overflow: 'hidden',
              border: `1px solid ${DARK_RIM}`,
            },
            children: [{ type: 'img', props: { src: PORTRAIT, width: 372, height: 372, style: { objectFit: 'cover' } } }],
          },
        },
      ],
    },
  })
}

async function writeCard(node: ISatoriNode, outPath: string): Promise<void> {
  /* satori types the element as ReactNode; the object-tree form is the documented runtime input. */
  const element = node as unknown as Parameters<typeof satori>[0]
  const svg = await satori(element, { width: 1200, height: 630, fonts: FONTS })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  /* Re-encode to JPEG so cards stay small enough for WhatsApp link previews. */
  const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer()
  const file = join(OG_DIR, outPath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, jpeg)
}

async function renderCard(spec: ICardSpec, outPath: string): Promise<void> {
  await writeCard(card(spec), outPath)
}

if (!existsSync(DIST)) {
  console.error('[og] dist/ not found — run this after `vite-ssg build`.')
  process.exit(1)
}
mkdirSync(OG_DIR, { recursive: true })

await writeCard(homeCard(), 'home.jpg')
await renderCard({ eyebrow: 'Journal', title: 'Writing', subtitle: 'Systems, product & craft' }, 'blog.jpg')
for (const post of blog) {
  await renderCard({ eyebrow: `Journal · ${SITE_NAME}`, title: post.title, subtitle: '' }, `blog/${post.slug}.jpg`)
}

console.log(`[og] generated ${2 + blog.length} OG cards in dist/og/`)
