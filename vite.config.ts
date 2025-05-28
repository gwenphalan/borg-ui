import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite'; // Import the plugin
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    dts({ insertTypesEntry: true }),
    tailwindcss(), // Add the tailwindcss plugin
  ],
  build: {
    lib: {
      entry: path.resolve(process.cwd(), 'src/index.ts'),
      name: 'MyAwesomeUILibrary',
      formats: ['es', 'umd'],
      fileName: (format) => `my-awesome-ui-library.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
});
