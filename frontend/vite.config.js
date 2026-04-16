import crypto from 'node:crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

if (typeof crypto.getRandomValues !== 'function' && crypto.webcrypto?.getRandomValues) {
  crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
