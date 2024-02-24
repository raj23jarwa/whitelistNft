import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		jsxInject: `import React from 'react'`,
		target: "ES2022" // or 'es2021' or 'esnext'
	}
})
