// Vite configuration for React PWA
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useHttps = env.VITE_DEV_HTTPS === 'true';

  return {
    plugins: [
      react(),
      // Enables HTTPS for local development so mobile browsers (iOS/Android)
      // can access camera APIs over LAN during testing when explicitly enabled
      ...(useHttps ? [basicSsl()] : []),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.svg'],
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/[^/]+\/(.*)\.(?:png|jpg|jpeg|svg|webp)$/,
              handler: 'StaleWhileRevalidate',
            },
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
            },
          ],
        },
      })
    ],
  };
});
