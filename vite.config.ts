import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // All node_modules are bundled into a single vendor chunk for better caching.
          if (id.includes('node_modules')) {
            return 'vendor';
          }

          // This logic focuses on splitting the application source code.

          // Group the heavy player components together
          if (id.includes('/components/PlayerPage') || id.includes('/hooks/useBinauralBeat') || id.includes('/components/Visualizer')) {
            return 'player-chunk';
          }
          // Group dashboard, analytics, and related components
          if (
            id.includes('/components/DashboardPage') ||
            id.includes('/components/AnalyticsPage') ||
            id.includes('/components/ActivityRings') ||
            id.includes('/components/QuickLog') ||
            id.includes('/components/AIInsightsCard')
          ) {
            return 'dashboard-chunk';
          }
          // Group auth-related pages
          if (id.includes('/components/LoginPage') || id.includes('/components/ResetPasswordPage')) {
            return 'auth-chunk';
          }
          // Group the creator studio
          if (id.includes('/components/CreateStackPage')) {
            return 'creator-chunk';
          }
        }
      }
    }
  }
})