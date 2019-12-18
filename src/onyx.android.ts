import * as app from "tns-core-modules/application";
import { View } from "tns-core-modules/ui/core/view";
import { OnyxCommon, OnyxPluginCallback, OnyxPluginSuccessCallback, OnyxPluginErrorCallback } from "./onyx.common";

declare var com: any;
export class OnyxPlugin extends OnyxCommon {

  constructor() {
    super();
  }
  public initAndPresentAndroidOnyx(
    license: string,
    showOnyxConfig: boolean,
    returnRawImage: boolean,
    returnProcessedImage: boolean,
    returnEnhancedImage: boolean,
    returnWSQ: boolean,
    returnFingerprintTemplate: boolean,
    showLoadingSpinner: boolean,
    useOnyxLive: boolean,
    useFlash: boolean,
    useManualCapture: boolean,
    useDeadFinger: boolean,
    shouldSegment: boolean,
    imageRotation: number,
    reticleOrientation: string,
    cropWidth: number,
    cropHeight: number,
    cropFactor: number,
    reticleScale: number,
    layoutPreference: string,
    onyxCallback: OnyxPluginCallback,
    onyxErrorCallback: OnyxPluginErrorCallback,
    onyxSuccessCallback: OnyxPluginSuccessCallback) {

    console.log("OnyxPluginAndroid: initializing " + this.getVersion());

    // Plugin callback
    this.onyxPluginCallback = onyxCallback;
    this.onyxPluginSuccessCallback = onyxSuccessCallback;
    this.onyxPluginErrorCallback = onyxErrorCallback;

    // Java callback
    com.dft.onyxjava.OnyxPlugin.registerJavaCallbacks(
      app.android.context,
      new com.dft.onyxjava.NativeScriptCallback(
      {
        success: (rawImage: string,
                  enhancedImage: string,
                  processedImage: string,
                  wsqData: string,
                  templateData: string,
                  livenessConfidence: number,
                  nfiScore: number,
                  mlpScore: number) => {

            console.log("OnyxPluginAndroid: did complete");
            if (this.onyxPluginSuccessCallback) {
              this.onyxPluginSuccessCallback(rawImage, enhancedImage, processedImage, wsqData, templateData, livenessConfidence, nfiScore, mlpScore);
            }
      },
        error: (errorMessage: string) => {
          console.log("OnyxPluginAndroid: ERROR: " + errorMessage);
          if (this.onyxPluginErrorCallback) {
            this.onyxPluginErrorCallback(errorMessage);
          }
        }
      })
    );


    let context = app.android.context;
    const activity = app.android.foregroundActivity || app.android.startActivity;

    let onyx = new com.dft.onyxjava.OnyxPlugin();
    onyx.InitOnyx(context,
                  activity,
                  license,
                  showOnyxConfig ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  returnRawImage ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  returnProcessedImage ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  returnEnhancedImage ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  returnWSQ ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  returnFingerprintTemplate ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  showLoadingSpinner ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  useOnyxLive ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  useFlash ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  useManualCapture ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  useDeadFinger ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  shouldSegment ? java.lang.Boolean.TRUE : java.lang.Boolean.FALSE,
                  imageRotation,
                  reticleOrientation,
                  cropWidth,
                  cropHeight,
                  cropFactor,
                  reticleScale,
                  layoutPreference);

    console.log("OnyxPluginAndroid: everything is OK!");
  }
  public getVersion(): string {
    return "onyx-camera 5.1.8 onyx-core 4.5.0";
  }
}
