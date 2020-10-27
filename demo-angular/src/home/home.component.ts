import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Page,
  Image,
  Label,
  Switch,
  Button,
  ImageSource,
  Dialogs,
  isIOS,
} from '@nativescript/core';
import { OnyxPlugin } from "nativescript-onyx";

const onyx_license: string = ""; // INSERT YOUR LICENSE KEY HERE

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  
    // onyxResult: OnyxResult;
  
    @ViewChild("mainLabel", {static: true}) mainLabel: ElementRef;
    @ViewChild("pictureBtn", {static: true}) pictureBtn: ElementRef;
    @ViewChild("rawImageView", {static: true}) rawImageView: ElementRef;
    @ViewChild("processedImageView", {static: true}) processedImageView: ElementRef;
    @ViewChild("enhancedImageView", {static: true}) enhancedImageView: ElementRef;
    @ViewChild("confidenceLabel", {static: true}) confidenceLabel: ElementRef;
    @ViewChild("nfiLabel", {static: true}) nfiLabel: ElementRef;
    @ViewChild("mlpLabel", {static: true}) mlpLabel: ElementRef;
    @ViewChild("flashlightSwitch", {static: true}) flashlightSwitch: ElementRef;
    @ViewChild("manualSwitch", {static: true}) manualSwitch: ElementRef;
    @ViewChild("deadSwitch", {static: true}) deadSwitch: ElementRef;
  
    constructor(private page: Page) {
  
    }
    ngOnInit() {
  
      console.log("OnyxDemoApp: ngOnInit..");
      
      this.page.actionBarHidden = true;
      let mainLabel = this.mainLabel.nativeElement;
      mainLabel.text = "Capture a photo of a fingerprint!";
      
    }
    processResult(rawImage: string, 
                  enhancedImage: string,
                  processedImage: string,
                  wsqData: string,
                  template: string,
                  quality: number,
                  nfiScore: number,
                  mlpScore: number) 
    {
      console.log("OnyxDemoApp: quality: " + quality);
      console.log("OnyxDemoApp: nfiscore: " + nfiScore);
      console.log("OnyxDemoApp: mlpscore: " + mlpScore);
  
      let confidenceLabel = this.confidenceLabel.nativeElement;
      confidenceLabel.text = "Focus Quality: " + quality;
  
      let nfiLabel = this.nfiLabel.nativeElement;
      nfiLabel.text = "NFI Score: " + nfiScore;
  
      let mlpLabel = this.mlpLabel.nativeElement;
      mlpLabel.text = "MLP Score: " + mlpScore;
  
      // Show result images
      this.showImage(rawImage,this.rawImageView.nativeElement);
      this.showImage(enhancedImage,this.enhancedImageView.nativeElement);
      this.showImage(processedImage,this.processedImageView.nativeElement);
  
    }
    showImage(base64Data: string, imageView: Image) {
  
      if (base64Data) {
        let imageSource = new ImageSource();
        imageSource.loadFromBase64(base64Data);
        imageView.imageSource = imageSource;
      }
    }
    startOnyx(args) {
  
      console.log("OnyxDemoApp: Starting Onyx..");
  
      let pictureBtn = <Button>this.pictureBtn.nativeElement;
      pictureBtn.isEnabled = false;
    
      // Start platform specific Onyx
      let onyx = new OnyxPlugin();
      if (!isIOS) {
        this.startAndroidOnyx(onyx);
      } else {
        this.startiOSOnyx(onyx);
      }
      pictureBtn.isEnabled = true;
  
    }
    startAndroidOnyx(onyx: OnyxPlugin) {
  
      let manualCapture = <Switch>this.manualSwitch.nativeElement;
      let isManual: boolean = manualCapture.checked === true ? true : false;
      let flashlightSwitch = <Switch>this.flashlightSwitch.nativeElement;
      let isFlashlight: boolean = flashlightSwitch.checked === true ? true : false;
      let deadSwitch = <Switch>this.deadSwitch.nativeElement;
      let isDead: boolean = deadSwitch.checked === true ? true : false;
  
      onyx.initAndPresentAndroidOnyx(
        onyx_license,       // Onyx license key
        false,              // showOnyxConfig
        true,               // returnRawImage
        true,               // returnProcessedImage
        true,               // returnEnhancedImage
        false,              // returnWSQ
        false,              // returnFingerprintTemplate
        true,               // showLoadingSpinner
        false,              // useOnyxLive
        isFlashlight,       // useFlash
        isManual,           // useManualCapture
        isDead,             // isDeadFinger: FingerDetectMode DEAD_FINGER | LIVE_FINGER
        false,              // shouldSegment
        90,                 // imageRotation
        "LEFT",             // reticleOrientation LEFT | RIGHT
        1024.0,             // cropWidth (min 1024 [instead of 512 as told] otherwise image gets cropped)
        600.0,              // cropHeight
        1.0,                // cropFactor
        1.0,                // reticleScale
        "UPPER_THIRD",      // layoutPreference
        (configuredOnyx: string): void => {
          console.log("ONYX CONFIGURED: " + configuredOnyx);
        },
        (errorString: string): void => {
          console.log("ONYX ERROR CALLBACK: ERROR: " + errorString);
          let mainLabel = <Label>this.mainLabel.nativeElement;
          mainLabel.text = errorString;
        },
        ( rawImage: string, // callback after fingerprint process is finished
          enhancedImage: string,
          processedImage: string,
          wsqData: string,
          templateData: string,
          quality: number,
          nfiScore: number,
          mlpScore: number): void => {
          this.processResult(rawImage, enhancedImage, processedImage, wsqData, templateData, quality, nfiScore, mlpScore);
        },
      );
    }
    startiOSOnyx(onyx: OnyxPlugin) {
  
      let manualCapture = <Switch>this.manualSwitch.nativeElement;
      let isManual: boolean = manualCapture.checked === true ? true : false;
      let flashlightSwitch = <Switch>this.flashlightSwitch.nativeElement;
      let isFlashlight: boolean = flashlightSwitch.checked === true ? true : false;
      let deadSwitch = <Switch>this.deadSwitch.nativeElement;
      let isDead: number = deadSwitch.checked === true ? 0 : 1;
      let isRightHand = false;
  
        onyx.initAndPresentiOSOnyx(
          onyx_license,           // onyx license key
          true,                   // showMatchScore
          0.75,                   // LEDBrightness
          true,                   // useAutoFocus
          null,                   // scaleFactors: NSArray<typeof NSObject>,
          false,                  // showDebug: boolean,
          0.1,                    // focus meausurment requirement [0..1 default: 0.1]
          1,                      // frameCount: number // ONYX CONFIG
          null,                   // backgroundColorHexString: string
          true,                   // returnRawFingerprintImage: boolean
          false,                  // returnGrayRawFingerprintImage: boolean
          true,                   // returnProcessedFingerprintImage: boolean
          true,                   // returnEnhancedFingerprintImage: boolean
          false,                  // returnBlackWhiteProcessedFingerprintImage: boolean
          false,                  // returnFingerprintTemplate: boolean
          false,                  // returnISOFingerprintTemplate
          false,                  // returnWsq: boolean
          false,                  // returnGrayRawWsq: boolean
          false,                  // shouldSegment: boolean
          90,                     // rotation: number
          false,                  // wholeFingerCrop: boolean
          CGSizeMake(1024, 600),  // DISABLED - FINGERPRINT_CAPTURE_FAILURE - cropSize: CGSize
          1,                      // cropFactor: number
          true,                   // showSpinner: boolean
          0,                      // DONT CARE - layoutPreference: LayoutPreference 	UPPER_THIRD | FULL
          isManual,               // useManualCapture: boolean
          isDead,                 // fingerDetectMode: FingerDetectMode DEAD_FINGER | LIVE_FINGER
          false,                  // showManualCaptureText: boolean
          null,                   // manualCaptureText: string
          false,                  // DONT CARE - useRemoteStorage: boolean
          false,                  // useLiveness: boolean
          isFlashlight,           // useFlash: boolean
          isRightHand ? 1:0,      // reticleOrientation: ReticleOrientation, LEFT | RIGHT
          0.0,                    // reticleAngle: number
          1.0,                    // reticleScale: number
          true,                   // DONT CARE - overrideReticleOrientation: boolean
          null,                   // backButtonText: string
          null,                   // infoText: string
          null,                   // infoTextColorHexString: string
          null,                   // base64ImageData: string
          (configuredOnyx: string): void => {
            console.log("OnyxDemoApp: onyx configured CALLBACK");
          },
          (onyxError: string): void => {
            console.log("OnyxDemoApp: onyx ERROR CALLBACK: " + onyxError);
            Dialogs.alert(onyxError);
          },
          (
            rawImage: string,
            enhancedImage: string,
            processedImage: string,
            wsqData: string,
            templateData: string,
            quality: number,
            nfiScore: number,
            mlpScore: number
          ): void => {
              this.processResult(rawImage, enhancedImage, processedImage, wsqData, templateData, quality, nfiScore, mlpScore);
            }
        );

      
    }
  }
  