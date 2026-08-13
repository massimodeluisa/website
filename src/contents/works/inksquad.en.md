---
title: Inksquad
eyebrow: Tattoo studio and ideas
role: CTO, product and platform architecture
summary: Two products on one platform. Inksquad People helps someone shape a tattoo idea. Inksquad Artist is the iPad app for studio work, $9.99 on the App Store, more than four hundred catalog inks.
seoDescription: Inksquad People for tattoo ideas. Inksquad Artist on iPad for stencil, ink matching, and gloved sessions. App Store $9.99. Shared Supabase and AI platform.
highlights:
  - "People is a private project: description, style, placement, references, Ink AI visuals, then share with an artist. Booking lives elsewhere."
  - 'Artist on iPad (App Store id 1579690331): stencil into PencilKit via VTracer, CIE94 and CIEDE2000 matching, Matrix, Color Wheel, voice with gloves on.'
  - More than four hundred catalog inks, including Intenze, Fusion, World Famous, Eternal Ink, and EU-legal sets. Offline-capable in the studio.
  - Shared Turborepo on Supabase (Postgres, RLS, Edge Functions) plus multi-provider AI through the Vercel AI SDK.
---

**Inksquad: from a vague tattoo idea to something an artist can use**

Inksquad is two products. People and Artist do different jobs, and they share a floor so a project can move from one to the other.

### People

[web.inksquad.com](https://web.inksquad.com) is for the person with the idea. You build a private project: description, style, placement, size, references, Ink AI visuals. When the idea is ready, you share it with an artist. Preparation, not booking. Public WIP.

### Artist

[artist.inksquad.com](https://artist.inksquad.com) is the iPad app on the App Store, $9.99 plus credits. This is the studio one. Import a sketch from Procreate, Photoshop, or Illustrator. Generate concepts. Make an Inkboard. Match inks. Run a live session. The stencil module turns artwork into editable PencilKit layers (preprocess, edge detection, VTracer). Color matching lets you drop markers on an image and hit catalog bottles with CIE94 / CIEDE2000. Matrix and Color Wheel are for palettes and blending. Live mode takes voice commands for zoom, markers, stencil layers, timer, views, so you are not poking the glass with gloves on.

Under both: Turborepo, Supabase (Postgres, RLS, Auth, Storage, Edge Functions), Vercel AI SDK talking to OpenAI, Grok, Replicate, Vertex. A Next.js admin and a Payload CMS site sit next to the apps.

AI can help generate a concept or clean a reference. The session still belongs to the artist.
