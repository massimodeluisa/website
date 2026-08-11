---
title: Inksquad
eyebrow: Tattoo ecosystem
role: CTO, product and platform architecture
summary: Cross-platform tattoo ecosystem — a React Native consumer app, an iPad-native SwiftUI pro tool and a shared Supabase and AI platform that moves ideas from inspiration to usable creative material.
seoDescription: Cross-platform tattoo ecosystem — a React Native consumer app, an iPad SwiftUI pro tool and a shared Supabase and AI platform.
highlights:
  - Two products on one platform — Inksquad People for shaping tattoo ideas and Inksquad Artist, an iPad tool for studio-grade workflows.
  - Artist tooling includes automatic stencil generation, ink color matching with CIE94 and CIEDE2000, palette tools and voice-controlled live mode.
  - Shared Turborepo platform on Supabase with Postgres, RLS and Edge Functions, plus multi-provider AI generation through the Vercel AI SDK.
  - A Next.js admin dashboard and a Payload CMS website complete the ecosystem.
---

**Inksquad: A Cross-Platform Product System for Tattoo Creation**

Inksquad is not a single app. It is a full product ecosystem built around one idea: helping tattoo concepts move from vague inspiration to precise, usable creative material. The platform connects two audiences, tattoo enthusiasts and professional artists, through a shared technical foundation made of mobile apps, an iPad-native professional tool, a web CMS, an admin dashboard, Supabase infrastructure, and AI image operations.

The consumer-facing app, Inksquad People, is positioned publicly as a way to “Define your next Tattoo like never before.” Its purpose is not booking. It is preparation. Users can create private tattoo projects, write detailed descriptions, select preferred styles and body placements, define size, collect reference images, generate visuals with AI, and share a complete project with a tattoo artist when the idea is ready.

Technically, People is an Expo 55 and React Native 0.84 app running React 19, Expo Router, HeroUI Native, FlashList, TanStack Query, RevenueCat purchases, Supabase Auth, Supabase Storage, and Supabase Edge Functions. The app includes Apple and Google sign-in, multilingual onboarding, push notification handling, offline-aware data fetching, project sharing through signed tokens, private image access, and a thread-based AI Studio. AI workflows are persisted as `ai_threads` and `ai_thread_messages`, with source images, generated images, operation metadata, credit accounting, and actions such as tattoo generation, image editing, background removal, alternatives, upscaling, try-on, and project creation.

The professional counterpart is Inksquad Artist, described publicly as “Pro tools for pro Tattoo Artists.” This is an iPad-first SwiftUI application built with Swift, SwiftData, CloudKit, PencilKit, Speech, AVFoundation, CoreImage, Vision, Supabase Swift, Google Sign-In, Firebase Messaging, Nuke, DotLottie, PINCache, ColorKit, and a shared Swift package named `InksquadShared`. It gives artists a working environment for importing sketches from tools like Procreate, Photoshop, or Illustrator, generating concepts with AI, creating inkboards, matching colors, building palettes, and managing live sessions.

The Artist app’s most distinctive systems are technical and practical at once. The automatic stencil module uses image preprocessing, edge detection, VTracer vectorization, and PencilKit layer generation to turn artwork into editable stencil layers. Color matching lets artists drag markers onto an image and identify ink matches from global catalogs, using perceptual color comparisons such as CIE94 and CIEDE2000. The Matrix and Color Wheel tools support palette exploration, ink blending, and fine adjustments using primary colors plus black and white. Live mode adds voice commands for zooming, showing markers, opening stencil layers, controlling a timer, and switching image views without touching the iPad during a session.

Behind both apps is a shared platform architecture. The monorepo uses Turborepo and pnpm, with `packages/ui` for cross-platform UI components, design tokens, glass effects, chat controls, galleries, cards, modals, admin components, and native/web variants. Business logic lives in `packages/di`, where Supabase composables, generated database types, i18n, query providers, project logic, AI thread logic, payments, app configuration, and device registration are centralized.

The backend is Supabase: Postgres with RLS, Storage, Auth, migrations, generated TypeScript types, and Deno Edge Functions. AI operations are powered by the Vercel AI SDK with a model registry spanning OpenAI, xAI/Grok, Replicate, and Google Vertex. Server-side tools handle generation, editing, background removal, upscaling, alternatives, try-on, content analysis, prompt enhancement, cost computation, and operation audit trails.

A Next.js 16 admin dashboard completes the system. Built with HeroUI, Tailwind CSS v4, Recharts, and shared DI hooks, it manages users, artists, studios, events, tattoo styles, body parts, articles, feedback, purchases, AI pricing, app links, app versions, and ink catalogs. The public website is also Next.js with Payload CMS, localized globals, Vercel Blob media, SEO metadata, JSON-LD, and marketing pages for People and Artist.

The result is a platform where product, AI, design tooling, editorial content, commerce, and operational control are integrated rather than bolted together. Inksquad turns tattoo planning into structured creative data, then gives artists professional tools to transform that data into work they can use.
