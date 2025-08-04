import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biohack.frequencies',
  appName: 'Biohack Frequencies',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
