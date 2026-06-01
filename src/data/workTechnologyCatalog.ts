export type TWorkTechnologyInfo = {
  label: string
  icon: string
  iconColor?: string
  generic?: boolean
  description: string
  websiteUrl?: string
  githubUrl?: string
}

const iconColor = '#8b8b8b'
const accentIconColor = '#b68370'
const mutedIconColor = '#8894a9'

export const normalizeTechnologyLabel = (label: string) =>
  label.toLowerCase().replace(/\s+/g, ' ').trim()

export const iconifySvgUrl = (icon: string, color?: string) =>
  `https://api.iconify.design/${icon}.svg${color ? `?color=${encodeURIComponent(color)}` : ''}`

export const technologyInitials = (label: string) =>
  label
    .split(/[\s./+-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const catalog: Record<string, TWorkTechnologyInfo> = {
  'admin workflows': {
    label: 'Admin workflows',
    icon: 'mdi:account-cog-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Internal tools and permissioned operational screens.',
  },
  algolia: {
    label: 'Algolia',
    icon: 'logos:algolia',
    description: 'Hosted search and discovery APIs for product data.',
    websiteUrl: 'https://www.algolia.com/',
    githubUrl: 'https://github.com/algolia/algoliasearch-client-javascript',
  },
  'ai parsing': {
    label: 'AI parsing',
    icon: 'mdi:robot',
    iconColor: accentIconColor,
    generic: true,
    description: 'AI-assisted extraction from unstructured content.',
  },
  android: {
    label: 'Android',
    icon: 'logos:android-icon',
    description: "Google's mobile operating system and app platform.",
    websiteUrl: 'https://developer.android.com/',
    githubUrl: 'https://github.com/aosp-mirror/platform_frameworks_base',
  },
  automation: {
    label: 'Automation',
    icon: 'mdi:robot-industrial-outline',
    iconColor: accentIconColor,
    generic: true,
    description: 'Automated tasks, triggers and workflow execution.',
  },
  'b2b ux': {
    label: 'B2B UX',
    icon: 'mdi:account-group-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Workflow-first interfaces for business users.',
  },
  'back-office integration': {
    label: 'Back-office integration',
    icon: 'mdi:briefcase-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Operational systems connected to internal business data.',
  },
  'c++': {
    label: 'C++',
    icon: 'logos:c-plusplus',
    description: 'Systems programming language for native performance.',
    websiteUrl: 'https://isocpp.org/',
    githubUrl: 'https://github.com/cplusplus/draft',
  },
  'compliance workflows': {
    label: 'Compliance workflows',
    icon: 'mdi:clipboard-check-outline',
    iconColor: accentIconColor,
    generic: true,
    description: 'Process flows shaped by regulatory requirements.',
  },
  'cron workflows': {
    label: 'Cron workflows',
    icon: 'mdi:calendar-clock',
    iconColor: accentIconColor,
    generic: true,
    description: 'Scheduled jobs and recurring background operations.',
  },
  'digital signature': {
    label: 'Digital signature',
    icon: 'mdi:file-sign',
    iconColor: accentIconColor,
    generic: true,
    description: 'Document approval and signing flows.',
  },
  'document flows': {
    label: 'Document flows',
    icon: 'mdi:file-document-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Document-heavy processes from input to delivery.',
  },
  expo: {
    label: 'Expo',
    icon: 'logos:expo-icon',
    description: 'React Native platform for building universal apps.',
    websiteUrl: 'https://expo.dev/',
    githubUrl: 'https://github.com/expo/expo',
  },
  firebase: {
    label: 'Firebase',
    icon: 'logos:firebase',
    description: 'Google backend platform for web and mobile apps.',
    websiteUrl: 'https://firebase.google.com/',
    githubUrl: 'https://github.com/firebase/firebase-js-sdk',
  },
  // TODO: consolidate with 'ms fluent' key — both entries share the same label, icon, and urls
  'fluent ui': {
    label: 'MS Fluent',
    icon: 'logos:microsoft-icon',
    description: 'Microsoft design system and UI component libraries.',
    websiteUrl: 'https://react.fluentui.dev/',
    githubUrl: 'https://github.com/microsoft/fluentui',
  },
  'github ci/cd': {
    label: 'GitHub CI/CD',
    icon: 'simple-icons:githubactions',
    iconColor,
    description: 'Automation pipelines built with GitHub Actions.',
    websiteUrl: 'https://github.com/features/actions',
    githubUrl: 'https://github.com/actions/runner',
  },
  'gitlab ci/cd': {
    label: 'GitLab CI/CD',
    icon: 'simple-icons:gitlab',
    iconColor: '#fc6d26',
    description: 'GitLab pipelines for build, test and release automation.',
    websiteUrl: 'https://docs.gitlab.com/ci/',
    githubUrl: 'https://gitlab.com/gitlab-org/gitlab-runner',
  },
  go: {
    label: 'Go',
    icon: 'logos:go',
    description: 'Compiled language for services and infrastructure.',
    websiteUrl: 'https://go.dev/',
    githubUrl: 'https://github.com/golang/go',
  },
  kafka: {
    label: 'Kafka',
    icon: 'logos:kafka-icon',
    description: 'Distributed event streaming platform.',
    websiteUrl: 'https://kafka.apache.org/',
    githubUrl: 'https://github.com/apache/kafka',
  },
  kotlin: {
    label: 'Kotlin',
    icon: 'logos:kotlin-icon',
    description: 'Modern JVM language used heavily for Android apps.',
    websiteUrl: 'https://kotlinlang.org/',
    githubUrl: 'https://github.com/JetBrains/kotlin',
  },
  kubernetes: {
    label: 'Kubernetes',
    icon: 'logos:kubernetes',
    description: 'Container orchestration for production infrastructure.',
    websiteUrl: 'https://kubernetes.io/',
    githubUrl: 'https://github.com/kubernetes/kubernetes',
  },
  'marketplace ux': {
    label: 'Marketplace UX',
    icon: 'mdi:storefront-outline',
    iconColor: accentIconColor,
    generic: true,
    description: 'Discovery and conversion patterns for marketplace apps.',
  },
  'mobile app': {
    label: 'Mobile app',
    icon: 'mdi:cellphone',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Native and cross-platform mobile product surfaces.',
  },
  n8n: {
    label: 'n8n',
    icon: 'simple-icons:n8n',
    iconColor: '#ea4b71',
    description: 'Workflow automation platform for integrations and jobs.',
    websiteUrl: 'https://n8n.io/',
    githubUrl: 'https://github.com/n8n-io/n8n',
  },
  // TODO: consolidate with 'android' key — near-identical entry (same icon and urls, only label differs)
  'native android': {
    label: 'Native Android',
    icon: 'logos:android-icon',
    description: 'Android apps built with native platform APIs.',
    websiteUrl: 'https://developer.android.com/',
    githubUrl: 'https://github.com/aosp-mirror/platform_frameworks_base',
  },
  'native ios': {
    label: 'Native iOS',
    icon: 'simple-icons:apple',
    iconColor,
    description: 'Apple mobile apps built for iPhone and iPad.',
    websiteUrl: 'https://developer.apple.com/ios/',
    githubUrl: 'https://github.com/swiftlang/swift',
  },
  nestjs: {
    label: 'NestJS',
    icon: 'logos:nestjs',
    description: 'Node.js framework for structured server applications.',
    websiteUrl: 'https://nestjs.com/',
    githubUrl: 'https://github.com/nestjs/nest',
  },
  'node.js': {
    label: 'Node.js',
    icon: 'logos:nodejs-icon',
    description: 'JavaScript runtime for backend and tooling work.',
    websiteUrl: 'https://nodejs.org/',
    githubUrl: 'https://github.com/nodejs/node',
  },
  'offline sync': {
    label: 'Offline sync',
    icon: 'mdi:cloud-sync-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Data flows that survive intermittent connectivity.',
  },
  'pdf workflows': {
    label: 'PDF workflows',
    icon: 'mdi:file-pdf-box',
    iconColor: accentIconColor,
    generic: true,
    description: 'PDF generation, reading and document operations.',
  },
  php: {
    label: 'PHP',
    icon: 'logos:php',
    description: 'Server-side language powering web applications.',
    websiteUrl: 'https://www.php.net/',
    githubUrl: 'https://github.com/php/php-src',
  },
  postgresql: {
    label: 'PostgreSQL',
    icon: 'logos:postgresql',
    description: 'Open-source relational database.',
    websiteUrl: 'https://www.postgresql.org/',
    githubUrl: 'https://github.com/postgres/postgres',
  },
  'public-sector delivery': {
    label: 'Public-sector delivery',
    icon: 'mdi:bank-outline',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Systems delivered around institutional constraints.',
  },
  redis: {
    label: 'Redis',
    icon: 'logos:redis',
    description: 'In-memory data store for cache and realtime workloads.',
    websiteUrl: 'https://redis.io/',
    githubUrl: 'https://github.com/redis/redis',
  },
  replicate: {
    label: 'Replicate',
    icon: 'simple-icons:replicate',
    iconColor,
    description: 'Platform for running machine-learning models via API.',
    websiteUrl: 'https://replicate.com/',
    githubUrl: 'https://github.com/replicate/replicate-javascript',
  },
  'restricted workflows': {
    label: 'Restricted workflows',
    icon: 'mdi:lock-check-outline',
    iconColor: accentIconColor,
    generic: true,
    description: 'Permissioned flows for sensitive operational contexts.',
  },
  search: {
    label: 'Search',
    icon: 'mdi:magnify',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Indexed retrieval and filtering over product data.',
  },
  sequin: {
    label: 'Sequin',
    icon: 'mdi:database-sync-outline',
    iconColor: mutedIconColor,
    description: 'Postgres change streams and data synchronization.',
    websiteUrl: 'https://sequinstream.com/',
    githubUrl: 'https://github.com/sequinstream/sequin',
  },
  'secure application design': {
    label: 'Secure application design',
    icon: 'mdi:shield-lock-outline',
    iconColor: accentIconColor,
    generic: true,
    description: 'Security-led architecture and constrained workflows.',
  },
  'self-hosted infrastructure': {
    label: 'Self-hosted infrastructure',
    icon: 'mdi:server-network',
    iconColor: mutedIconColor,
    generic: true,
    description: 'Infrastructure operated outside managed-only stacks.',
  },
  supabase: {
    label: 'Supabase',
    icon: 'logos:supabase-icon',
    description: 'Open-source backend platform built on Postgres.',
    websiteUrl: 'https://supabase.com/',
    githubUrl: 'https://github.com/supabase/supabase',
  },
  swift: {
    label: 'Swift',
    icon: 'logos:swift',
    description: 'Apple-backed language for native apps and systems.',
    websiteUrl: 'https://www.swift.org/',
    githubUrl: 'https://github.com/swiftlang/swift',
  },
  swiftui: {
    label: 'SwiftUI',
    icon: 'logos:swift',
    description: 'Apple framework for declarative native interfaces.',
    websiteUrl: 'https://developer.apple.com/xcode/swiftui/',
    githubUrl: 'https://github.com/swiftlang/swift',
  },
  'tailwind css': {
    label: 'Tailwind CSS',
    icon: 'logos:tailwindcss-icon',
    description: 'Utility-first CSS framework for fast UI development.',
    websiteUrl: 'https://tailwindcss.com/',
    githubUrl: 'https://github.com/tailwindlabs/tailwindcss',
  },
  turborepo: {
    label: 'Turborepo',
    icon: 'logos:turborepo-icon',
    description: 'High-performance build system for JavaScript monorepos.',
    websiteUrl: 'https://turbo.build/',
    githubUrl: 'https://github.com/vercel/turborepo',
  },
  typescript: {
    label: 'TypeScript',
    icon: 'logos:typescript-icon',
    description: 'Typed JavaScript for large-scale applications.',
    websiteUrl: 'https://www.typescriptlang.org/',
    githubUrl: 'https://github.com/microsoft/TypeScript',
  },
  typesense: {
    label: 'Typesense',
    icon: 'logos:typesense-icon',
    description: 'Open-source search engine optimized for instant search.',
    websiteUrl: 'https://typesense.org/',
    githubUrl: 'https://github.com/typesense/typesense',
  },
  // TODO: consolidate with 'fluent ui' key — both entries share the same label, icon, and urls
  'ms fluent': {
    label: 'MS Fluent',
    icon: 'logos:microsoft-icon',
    description: 'Microsoft design system and UI component libraries.',
    websiteUrl: 'https://react.fluentui.dev/',
    githubUrl: 'https://github.com/microsoft/fluentui',
  },
  'vercel ai sdk': {
    label: 'Vercel AI SDK',
    icon: 'simple-icons:vercel',
    iconColor,
    description: 'Toolkit for building AI-powered TypeScript apps.',
    websiteUrl: 'https://ai-sdk.dev/',
    githubUrl: 'https://github.com/vercel/ai',
  },
  vue: {
    label: 'Vue',
    icon: 'logos:vue',
    description: 'Progressive JavaScript framework for user interfaces.',
    websiteUrl: 'https://vuejs.org/',
    githubUrl: 'https://github.com/vuejs/core',
  },
  // TODO: consolidate with 'vue' key — near-identical entry, only label differs ('Vue' vs 'Vue 3')
  'vue 3': {
    label: 'Vue 3',
    icon: 'logos:vue',
    description: 'Current major version of the Vue framework.',
    websiteUrl: 'https://vuejs.org/',
    githubUrl: 'https://github.com/vuejs/core',
  },
}

export const getTechnologyInfo = (label: string): TWorkTechnologyInfo => {
  const normalized = normalizeTechnologyLabel(label)
  return (
    catalog[normalized] ?? {
      label,
      icon: 'mdi:cube-outline',
      iconColor: mutedIconColor,
      generic: true,
      description: 'Project-specific technical signal used in selected work.',
    }
  )
}
