import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react({ include: "**/*.jsx" })],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
