// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import dotenv from 'dotenv'

// dotenv.config();

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: process.env.NODE_ENV === 'production' ? '/blakes-portfolio/' : '/',
//   define: {
//     __PUBLIC_KEY__: `"${process.env.VITE_PUBLIC_KEY}"`,
//     __SERVICE_ID__: `"${process.env.VITE_SERVICE_ID}"`,
//     __TEMPLATE_ID__: `"${process.env.VITE_TEMPLATE_ID}"`
//   },
//   plugins: [react()],
  
// })

import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import envCompatible from 'vite-plugin-env-compatible'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VALUE__: `"${process.env.VALUE}"` // wrapping in "" since it's a string
  },
  plugins: [
    ,react()
    ,envCompatible()],
})

