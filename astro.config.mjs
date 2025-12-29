import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

const isProduction = process.env.NODE_ENV === 'production'

// https://astro.build/config
export default defineConfig({
  ...(isProduction && {
    site: 'https://2eha0.github.io',
  }),
  integrations: [react()],
  vite: {
    css: {
      transformer: 'postcss',
    },
    ssr: {
      noExternal: ['framer-motion'],
    },
  },
})
