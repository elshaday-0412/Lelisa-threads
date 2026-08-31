import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const erpUrl = process.env.LELISA_ERP_URL || process.env.VITE_LELISA_ERP_URL || process.env.VITE_EXTERNAL_INVENTORY_API_URL || process.env.EXTERNAL_INVENTORY_API_URL || '';
  const erpKey = process.env.LELISA_ERP_API_KEY || process.env.VITE_LELISA_ERP_API_KEY || process.env.STOREFRONT_API_KEY || process.env.VITE_STOREFRONT_API_KEY || process.env.VITE_EXTERNAL_INVENTORY_API_KEY || process.env.EXTERNAL_INVENTORY_API_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'import.meta.env.VITE_LELISA_ERP_URL': JSON.stringify(erpUrl),
      'import.meta.env.VITE_LELISA_ERP_API_KEY': JSON.stringify(erpKey),
      'import.meta.env.VITE_EXTERNAL_INVENTORY_API_URL': JSON.stringify(erpUrl),
      'import.meta.env.VITE_EXTERNAL_INVENTORY_API_KEY': JSON.stringify(erpKey),
    },
    envPrefix: ['VITE_', 'LELISA_', 'STOREFRONT_', 'EXTERNAL_'],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
