---
title: Inksquad
eyebrow: Tattoo ecosystem
role: CTO, product and platform architecture
summary: Two products on one platform. Inksquad People helps someone shape a tattoo idea. Inksquad Artist is an iPad tool for studio work. Shared Supabase and AI underneath.
seoDescription: Inksquad People for tattoo ideas. Inksquad Artist on iPad for stencil, ink matching, and gloved sessions. Shared Supabase and AI platform.
highlights:
  - "People is for enthusiasts: private projects, styles, placement, references, AI visuals, then share with an artist. It is not a booking app."
  - "Artist on iPad: automatic stencil, ink matching with CIE94 and CIEDE2000, Matrix and Color Wheel, voice control so you can keep gloves on."
  - 400+ real ink catalogs, including EU-compliant sets. Offline-capable studio work.
  - Shared Turborepo on Supabase (Postgres, RLS, Edge Functions) plus multi-provider AI through the Vercel AI SDK.
---

**Inksquad: from a vague tattoo idea to something an artist can use**

Inksquad is two products, not one app with a costume change.

**People** (web.inksquad.com) is for enthusiasts. You build a private project: description, style, placement, size, references, AI visuals. When the idea is ready, you share it with an artist. It is preparation, not booking. Public WIP.

**Artist** (App Store, iPad) is for the studio. Import a sketch from Procreate, Photoshop, or Illustrator. Generate concepts. Make inkboards. Match inks. Run a live session. The stencil module turns artwork into editable PencilKit layers (preprocess, edge detection, VTracer). Color matching lets you drop markers on an image and hit catalog inks with CIE94 / CIEDE2000. Matrix and Color Wheel are for palettes and blending. Live mode takes voice commands for zoom, markers, stencil layers, timer, views, so you are not poking the glass with gloves on.

Under both: Turborepo, Supabase (Postgres, RLS, Auth, Storage, Edge Functions), Vercel AI SDK talking to OpenAI, Grok, Replicate, Vertex. A Next.js admin and a Payload CMS site sit next to the apps.

AI assists. It does not replace the artist.
