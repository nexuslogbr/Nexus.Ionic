import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patioautomotivo.app',
  appName: 'Gestão Pátio Automotivo Nexus',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      ShowSplashScreenSpinner: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      orientation: 'portrait',
      AutoHideSplashScreen: 'false',
      FadeSplashScreen: 'true',
      ShowSplashScreen: 'true'
    }
  }
};

export default config;
