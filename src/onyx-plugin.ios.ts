import * as fs from '@nativescript/core';
import { Application, Frame, knownFolders } from '@nativescript/core';
import * as common from "./onyx-plugin.common";
import { OnyxClassBase, OnyxPluginCallback, OnyxPluginSuccessCallback, OnyxPluginErrorCallback } from "./onyx-plugin.common";

@NativeClass()
export class OnyxClass extends NSObject implements OnyxViewControllerDelegate {

  public static ObjCProtocols = [OnyxViewControllerDelegate];

  // Plugin callbacks
  private onyxPluginCallback: OnyxPluginCallback;
  private onyxPluginErrorCallback: OnyxPluginErrorCallback;
  private onyxPluginSuccessCallback: OnyxPluginSuccessCallback;

  public fingerPrint: ProcessedFingerprint;
  public rawImage: UIImage;
  public processedImage: UIImage;
  public enhancedImage: UIImage;
  public WSQData: NSData;
  public invertedMirroredWSQData: NSData;
  private isSimulator: boolean;

  constructor() {
    super();

    // const processInfo = iosUtils.getter(NSProcessInfo, NSProcessInfo.processInfo);
    // const isMinIOS9 = processInfo.isOperatingSystemAtLeastVersion({majorVersion: 9, minorVersion: 0, patchVersion: 0});
    // if (isMinIOS9) {
    //   const simDeviceName = processInfo.environment.objectForKey("SIMULATOR_DEVICE_NAME");
    //   this.isSimulator = simDeviceName !== null;
    // } else {
    //   const currentDevice = iosUtils.getter(UIDevice, UIDevice.currentDevice);
    //   this.isSimulator = currentDevice.name.toLowerCase().indexOf("simulator") > -1;
    // }
  }
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

    ): OnyxViewController {

      if (!this.isSimulator) {

        console.log("OnyxPluginiOS: initializing.. " + this.getVersion());

        const app = UIApplication.sharedApplication;
        let currentViewController = app.keyWindow.rootViewController;
        
        // Our own callback
        this.onyxPluginCallback = onyxPluginCallback;
        this.onyxPluginErrorCallback = onyxPluginErrorCallback;
        this.onyxPluginSuccessCallback = onyxPluginSuccessCallback;

        let onyxVC = OnyxViewController.alloc().init(); // Or MyController
        onyxVC.delegate = this;
        onyxVC.showMatchScore = showMatchScore;
        onyxVC.useAutoFocus = useAutoFocus;
        onyxVC.scaleFactors = scaleFactors;
        onyxVC.showDebug = showDebug;
        onyxVC.focusMeasurementRequirement = focusMeasurementRequirement;
        onyxVC.frameCount = frameCount;

        let onyxConfigBuilder = OnyxConfigurationBuilder.alloc().init();
        onyxConfigBuilder = onyxConfigBuilder.setViewController()(onyxVC);
        onyxConfigBuilder = onyxConfigBuilder.setLicenseKey()(licenseKey);
        onyxConfigBuilder = onyxConfigBuilder.setBackgroundColorHexString()(backgroundColorHexString);
        onyxConfigBuilder = onyxConfigBuilder.setReturnRawImage()(returnRawFingerprintImage);
        onyxConfigBuilder = onyxConfigBuilder.setReturnGrayRawImage()(returnGrayRawFingerprintImage);
        onyxConfigBuilder = onyxConfigBuilder.setReturnProcessedImage()(returnProcessedFingerprintImage);
        onyxConfigBuilder = onyxConfigBuilder.setReturnEnhancedImage()(returnEnhancedFingerprintImage);
        onyxConfigBuilder = onyxConfigBuilder.setReturnBlackWhiteProcessedImage()(returnBlackWhiteProcessedFingerprintImage);
        onyxConfigBuilder = onyxConfigBuilder.setReturnFingerprintTemplate()(returnFingerprintTemplate);
        onyxConfigBuilder = onyxConfigBuilder.setReturnISOFingerprintTemplate()(returnISOFingerprintTemplate);
        onyxConfigBuilder = onyxConfigBuilder.setReturnWSQ()(returnWsq);
        onyxConfigBuilder = onyxConfigBuilder.setReturnGrayRawWSQ()(returnGrayRawWsq);
        onyxConfigBuilder = onyxConfigBuilder.setShouldSegment()(shouldSegment);
        onyxConfigBuilder = onyxConfigBuilder.setImageRotation()(rotation);
        onyxConfigBuilder = onyxConfigBuilder.setWholeFingerCrop()(wholeFingerCrop);
        onyxConfigBuilder = onyxConfigBuilder.setCropSize()(cropSize); // tried CGSizeZero, null, CGSize(0,0) -> fails with FINGERPRINT_CAPTURE_FAILURE
        onyxConfigBuilder = onyxConfigBuilder.setCropFactor()(cropFactor);
        onyxConfigBuilder = onyxConfigBuilder.setShowLoadingSpinner()(showSpinner);
        onyxConfigBuilder = onyxConfigBuilder.setUseOnyxLive()(useLiveness);
        onyxConfigBuilder = onyxConfigBuilder.setUseFlash()(useFlash);
        onyxConfigBuilder = onyxConfigBuilder.setLEDBrightness()(LEDBrightness);
        onyxConfigBuilder = onyxConfigBuilder.setUseManualCapture()(useManualCapture);
        onyxConfigBuilder = onyxConfigBuilder.setShowManualCaptureText()(showManualCaptureText);
        onyxConfigBuilder = onyxConfigBuilder.setManualCaptureText()(manualCaptureText);
        onyxConfigBuilder = onyxConfigBuilder.setFingerDetectMode()(fingerDetectMode);
        onyxConfigBuilder = onyxConfigBuilder.setReticleOrientation()(reticleOrientation);
        onyxConfigBuilder = onyxConfigBuilder.setReticleAngle()(reticleAngle);
        onyxConfigBuilder = onyxConfigBuilder.setReticleScale()(reticleScale);
        onyxConfigBuilder = onyxConfigBuilder.setBackButtonText()(backButtonText);
        onyxConfigBuilder = onyxConfigBuilder.setInfoText()(infoText);
        onyxConfigBuilder = onyxConfigBuilder.setInfoTextColorHexString()(infoTextColorHexString);
        onyxConfigBuilder = onyxConfigBuilder.setBase64ImageData()(base64ImageData);

        // missing
        // onyxConfigBuilder = onyxConfigBuilder.setLayoutPreference()(layoutPreference);
        // onyxConfigBuilder = onyxConfigBuilder.setUseRemoteStorage()(useRemoteStorage);
        // onyxConfigBuilder = onyxConfigBuilder.setOverrideReticleOrientation()(overrideReticleOrientation);


        onyxConfigBuilder = onyxConfigBuilder.setOnyxCallback()((configuredOnyx: Onyx): void => {
          console.log('OnyxPluginiOS: CALLBACK: ' + configuredOnyx);
          configuredOnyx.capture(currentViewController);
          if (this.onyxPluginCallback) {
            this.onyxPluginCallback('configured OK!');
          } else {
            console.log('OnyxPluginiOS: WARNING: cinfigure callback is not set..');
          }
        });

        onyxConfigBuilder = onyxConfigBuilder.setErrorCallback()((onyxError: OnyxError): void => {

          if (onyxError.error === OnyxErrorType.AUTOFOCUS_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> AUTOFOCUS_FAILURE');
          } else if (onyxError.error === OnyxErrorType.CAMERA_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> CAMERA_FAILURE');
          } else if (onyxError.error === OnyxErrorType.LICENSING_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> LICENSING_FAILURE');
          } else if (onyxError.error === OnyxErrorType.PERMISSIONS_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> PERMISSIONS_FAILURE');
          } else if (onyxError.error === OnyxErrorType.FINGERPRINT_CAPTURE_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> FINGERPRINT_CAPTURE_FAILURE');
          } else if (onyxError.error === OnyxErrorType.FINGERPRINT_TOO_LOW_QUALITY) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> FINGERPRINT_TOO_LOW_QUALITY');
          } else if (onyxError.error === OnyxErrorType.LIVENESS_FAILURE) {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> LIVENESS_FAILURE');
          } else {
            console.log('OnyxPluginiOS: ERROR OnyxErrorType: -> UNKNOWN');
          }

          console.log('OnyxPluginiOS: ERROR onyxError.error: ' + onyxError.error);
          console.log('OnyxPluginiOS: ERROR onyxError.errorMessage: ' + onyxError.errorMessage);

          if (this.onyxPluginErrorCallback) {
            console.log('OnyxPluginiOS: calling onyxPluginErrorCallback..');
            this.onyxPluginErrorCallback(onyxError.errorMessage);
          } else {
            console.log('OnyxPluginiOS: WARNING: error callback is not set..');
          }
        });
        onyxConfigBuilder = onyxConfigBuilder.setSuccessCallback()((onyxResult: OnyxResult): void => {
          console.log('OnyxPluginiOS: SUCCESS CALLBACK: ');

          // this.fingerPrint = fingerprint;

          // let fingersArray = [];
          // for (let i = 0; i < fingerprints.count; i++) {
          //   fingersArray.push(fingerprints.objectAtIndex(i));
          // }

          // for (let i = 0; i < fingersArray.length; i++) {
          //   let p = fingersArray[i];
          //   console.log("OnyxPlugin: Finger " + i + " quality:\t" + p.quality);
          // }

          // console.log("OnyxPlugin: Finger size:\t\t" + fingerprint.size.width + "x" + fingerprint.size.height);
          // console.log("OnyxPlugin: Finger quality:\t" + fingerprint.quality);
          // console.log("OnyxPlugin: Finger nfiqscore:\t" + fingerprint.nfiqscore);
          // console.log("OnyxPlugin: Finger mlpscore:\t" + fingerprint.mlpscore);
          // // "%zdb\n", malloc_size((__bridge const void *) fingerprint)

          let rawBase64 = null;
          if (onyxResult.rawFingerprintImage) {
            this.rawImage = onyxResult.rawFingerprintImage;
            let rawImageData: NSData = UIImagePNGRepresentation(this.rawImage);
            rawBase64 = rawImageData.base64EncodedStringWithOptions(1);
          }

          let processedBase64 = null;
          if (onyxResult.processedFingerprintImage) {
            this.processedImage = onyxResult.processedFingerprintImage;
            let processedImageData: NSData = UIImagePNGRepresentation(this.processedImage);
            processedBase64 = processedImageData.base64EncodedStringWithOptions(1);
          }

          let enhancedBase64 = null;
          if (onyxResult.enhancedFingerprintImage) {
            this.enhancedImage = onyxResult.enhancedFingerprintImage;
            let enhancedImageData: NSData = UIImagePNGRepresentation(this.enhancedImage);
            enhancedBase64 = enhancedImageData.base64EncodedStringWithOptions(1);
          }

          let wsqData = null;
          if (onyxResult.wsqData) {
            wsqData = onyxResult.wsqData.base64EncodedStringWithOptions(1);
          }

          let templateData = null;
          if (onyxResult.fingerprintTemplate) {
            templateData = onyxResult.fingerprintTemplate.base64EncodedStringWithOptions(1);
          }

          // Metrics
          let metrics = onyxResult.getMetrics();
          let nfiMetrics = metrics.getNfiqMetrics();

          if (this.onyxPluginSuccessCallback) {
            this.onyxPluginSuccessCallback(rawBase64, processedBase64, enhancedBase64, wsqData, templateData, metrics.getFocusQuality(), nfiMetrics.getNfiqScore(), nfiMetrics.getMlpScore());
          } else {
            console.log('OnyxPluginiOS: WARNING: seccuss callback is not set..');
          }

        });

        onyxConfigBuilder.buildOnyxConfiguration();

        console.log("OnyxPluginiOS: presenting Onyx..");
        // appWindow.rootViewController.presentViewControllerAnimatedCompletion(onyxVC, true, null);

        console.log("OnyxPluginiOS: everything is OK!");

        return onyxVC;
      }
      return null;
  }
  public getVersion(): string {
    return "OnyxCamera 5.3.1 - opencv2 3.4.2";
  }

  // OnyxViewControllerDelegate methods
  "Onyx:didOutputProcessedFingerprint:fromSet:"(controller: OnyxViewController, fingerprint: ProcessedFingerprint, fingerprints: NSArray<typeof ProcessedFingerprint>) {

    console.log("OnyxPluginiOS: did output processed fingerprint :)");

    // this.fingerPrint = fingerprint;

    // let fingersArray = [];
    // for (let i = 0; i < fingerprints.count; i++) {
    //   fingersArray.push(fingerprints.objectAtIndex(i));
    // }

    // for (let i = 0; i < fingersArray.length; i++) {
    //   let p = fingersArray[i];
    //   console.log("OnyxPlugin: Finger " + i + " quality:\t" + p.quality);
    // }

    // console.log("OnyxPlugin: Finger size:\t\t" + fingerprint.size.width + "x" + fingerprint.size.height);
    // console.log("OnyxPlugin: Finger quality:\t" + fingerprint.quality);
    // console.log("OnyxPlugin: Finger nfiqscore:\t" + fingerprint.nfiqscore);
    // console.log("OnyxPlugin: Finger mlpscore:\t" + fingerprint.mlpscore);
    // // "%zdb\n", malloc_size((__bridge const void *) fingerprint)

    // let rawBase64 = null;
    // if (fingerprint.sourceImage) {
    //   this.rawImage = fingerprint.sourceImage;
    //   let rawImageData: NSData = UIImagePNGRepresentation(this.rawImage);
    //   rawBase64 = rawImageData.base64EncodedStringWithOptions(1);
    // }

    // let processedBase64 = null;
    // if (fingerprint.processedImage) {
    //   this.processedImage = fingerprint.processedImage;
    //   let processedImageData: NSData = UIImagePNGRepresentation(this.processedImage);
    //   processedBase64 = processedImageData.base64EncodedStringWithOptions(1);
    // }

    // let enhancedBase64 = null;
    // if (fingerprint.enhancedImage) {
    //   this.enhancedImage = fingerprint.enhancedImage;
    //   let enhancedImageData: NSData = UIImagePNGRepresentation(this.enhancedImage);
    //   enhancedBase64 = enhancedImageData.base64EncodedStringWithOptions(1);
    // }

    // let wsqData = null;
    // if (fingerprint.WSQ) {
    //   wsqData = fingerprint.WSQ.base64EncodedStringWithOptions(1);
    // }

    // let templateData = null;
    // if (fingerprint.fingerprintTemplate) {
    //   templateData = fingerprint.fingerprintTemplate.base64EncodedStringWithOptions(1);
    // }

    // if (this.onyxSuccessCallback) {
    //   this.onyxSuccessCallback(rawBase64, processedBase64, enhancedBase64, wsqData, templateData, fingerprint.quality, fingerprint.nfiqscore, fingerprint.mlpscore);
    //   // this.onyxSuccessCallback(controller.result);
    // }
  }

  "Onyx:errorCallback:"(controller: OnyxViewController, error: NSError) {
    console.log("OnyxPluginiOS: errorCallback: ERROR: " + error);
    if (this.onyxPluginErrorCallback) {
      this.onyxPluginErrorCallback(error.description);
    }
  }

  "Onyx:onCancel:"(controller: OnyxViewController, error: NSError) {
    console.log("OnyxPlugin: onCancel: ERROR: " + error);
    // if (this.onyxErrorCallback) {
    //   this.onyxErrorCallback(error.description);
    // }
  }

  public saveImage(image: UIImage): string { // not used

    let fileName;
    if (image === this.rawImage) {
      fileName = "finger-raw.png";
    } else if (image === this.processedImage) {
      fileName = "finger-processed.png";
    } else if (image === this.enhancedImage) {
      fileName = "finger-enhanced.png";
    }
    console.log("OnyxPluginiOS: saving: " + fileName);

    // UIImage -> NSData -> Base64 -> file
    let imageData: NSData = UIImagePNGRepresentation(image);
    let base64 = imageData.base64EncodedStringWithOptions(1);
    let documents = knownFolders.documents();
    let filePath = fs.path.join(documents.path, fileName);
    let file = fs.File.fromPath(filePath);
    file.writeText(base64);

    console.log("OnyxPluginiOS: finger print saved at: " + filePath);

    return filePath;
  }

  public static ObjCExposedMethods = {
    "Onyx:didOutputProcessedFingerprint:fromSet:": {
      returns: interop.types.void,
      params: [ OnyxViewController, ProcessedFingerprint, NSArray ]
    },
    "Onyx:errorCallback:": {
      returns: interop.types.void,
      params: [ OnyxViewController, NSError ]
    },
    "Onyx:onCancel:": {
      returns: interop.types.void,
      params: [ OnyxViewController, NSError ]
    },
  };
}


// class MyController extends OnyxViewController {
//   viewDidLoad() {
//     super.viewDidLoad();
//     console.log("OnyxViewController: viewDidLoad..");
//   }
//   viewWillAppear(animated: boolean) {
//     super.viewWillAppear(animated);
//     console.log("OnyxViewController: viewWillAppear..");
//   }
//   viewDidAppear(animated: boolean) {
//     super.viewDidAppear(animated);
//     console.log("OnyxViewController: viewDidAppear..");
//   }
//   viewWillDisappear(animated: boolean) {
//     super.viewWillDisappear(animated);
//     console.log("OnyxViewController: viewWillDisappear..");
//   }
//   viewDidDisappear(animated: boolean) {
//     super.viewDidDisappear(animated);
//     console.log("OnyxViewController: viewDidDisappear..");
//   }
//   didReceiveMemoryWarning() {
//     super.didReceiveMemoryWarning();
//     console.log("OnyxViewController: didReceiveMemoryWarning..");
//   }
// }

// declare type OnyxHandler = (myArgument: string) => void;
