import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.dft.nativescript-onyx3',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;