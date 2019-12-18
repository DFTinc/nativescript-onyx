import { OnyxCommon, OnyxPluginCallback, OnyxPluginSuccessCallback, OnyxPluginErrorCallback } from "./onyx.common";

export declare class OnyxPlugin extends OnyxCommon {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here
  constructor();
  public initAndPresentiOSOnyx(
    licenseKey: string,
    showMatchScore: boolean,
    LEDBrightness: number,
    useAutoFocus: boolean,
    scaleFactors: NSArray<typeof NSObject>,
    showDebug: boolean,
    focusMeasurementRequirement: number,
    frameCount: number,

    // OnyxConfig params
    /**
     * This property sets the background color.
     */
    backgroundColorHexString: string,

    /**
     * This property sets whether or not to return the raw fingerprint image in the OnyxResult.
     */
    returnRawFingerprintImage: boolean,

    /**
     * This property sets whether or not to return the gray-scale raw fingerprint image in the OnyxResult.
     */
    returnGrayRawFingerprintImage: boolean,

    /**
     * This property sets whether or not to return the processed fingerprint image in the OnyxResult.
     */
    returnProcessedFingerprintImage: boolean,

    /**
     * This property sets whether or not to return the enhanced fingerprint image in the OnyxResult.
     */
    returnEnhancedFingerprintImage: boolean,

    /**
     * This property sets whether or not to return the black and white processed fingerprint image in the OnyxResult.
     */
    returnBlackWhiteProcessedFingerprintImage: boolean,

    /**
     * This property sets whether or not to return the fingerprint template in the OnyxResult.
     */
    returnFingerprintTemplate: boolean,

    /**
     * This property sets whether or not to return the ISO fingerprint template in the OnyxResult
     */
    returnISOFingerprintTemplate: boolean,

    /**
     * This property sets whether or not to return the WSQ image in the OnyxResult.
     */
    returnWsq: boolean,

    /**
     * This property sets whether or not to return the gray-scale WSQ fingerprint image in the OnyxResult.
     */
    returnGrayRawWsq: boolean,

    /**
     * This method sets whether or not the capture task should segment the fingerprint image.
     */
    shouldSegment: boolean,

    /**
     * This method sets the rotation amount for the image.
     * rotation an integer specifying the rotation amount (0, 90, 180, or 270 degrees).
     * only 90 degree rotations are supported for speed reasons.
     */
    rotation: number,

    /**
     * This method sets the crop to the whole finger.
     * wholeFingerCrop a Bool specifying to crop the whole finger.
     */
    wholeFingerCrop: boolean,

    /**
     * This method sets the crop size for the capture image.
     */
    cropSize: CGSize,

    /**
     * This method sets the crop factor for the capture image.
     */
    cropFactor: number,

    /**
     * This methods sets that the Onyx spinner should be shown.
     */
    showSpinner: boolean,

    /**
     * This method sets the layout preference for the OnyxFragment
     */
    layoutPreference: number,

    /**
     * This method sets the method of capture to be a manual capture of the fingerprint
     */
    useManualCapture: boolean,

    /**
     * This method indicates which finger detect mode to use.
     */
    fingerDetectMode: number,

    /**
     * This property determines if the manual capture text will be displayed or not
     */
    showManualCaptureText: boolean,

    /**
     * Instructions to display for manual capture (localization)
     */
    manualCaptureText: string,

    /**
     * This method sets whether to use remote storage as part of the configuration
     */
    useRemoteStorage: boolean,

    /**
     * This method sets whether to use remote storage as part of the configuration
     */
    useLiveness: boolean,

    /**
     * This method sets whether to use the flash
     */
    useFlash: boolean,

    /**
     * This method sets the orientation of the reticle {@link Reticle.Orientation}
     */
    reticleOrientation: number,

    /**
     * This method sets the angle of the reticle
     * angle the degree angle to rotate the reticle
     * positive values rotate clockwise
     */
    reticleAngle: number,

    /**
     * This method sets the scale of the reticle
     */
    reticleScale: number,

    /**
     * Overrides the reticle orientation to use the angle passed in to reticleAngle
     */
    overrideReticleOrientation: boolean,

    /**
     * Text to display for the back button (localization)
     */
    backButtonText: string,

    /**
     * Custom text to display on capture screen
     */
    infoText: string,

    /**
     * Text color for custom information as a hex string value
     */
    infoTextColorHexString: string,

    /**
     * Image URI to display
     */
    base64ImageData: string,

    /**
     * This sets the OnyxCallback event handler.
     * The callback returns the Onyx object used to start Onyx.
     */
    onyxPluginCallback: OnyxPluginCallback,

    /**
     * This sets the ErrorCallback event handler.
     * errorCallback (required) the event handler for the ErrorCallback.
     */
    onyxPluginErrorCallback: OnyxPluginErrorCallback,

    /**
     * This sets the OnyxSuccess event handler.
     * successCallback (required) the event handler for the SuccessCallback.
     */
    onyxPluginSuccessCallback: OnyxPluginSuccessCallback,
    ): OnyxViewController;
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
      onyxSuccessCallback: OnyxPluginSuccessCallback)
  public getVersion(): string;
}
