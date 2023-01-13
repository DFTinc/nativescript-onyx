import { HomeViewModel } from "./home-view-model";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { EventData } from "data/observable"

import { OnyxClass } from "nativescript-onyx3";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { isAndroid } from "tns-core-modules/ui/page/page";
import { Image } from "tns-core-modules/ui/image";
import { Label } from "tns-core-modules/ui/label";
import { Switch } from "tns-core-modules/ui/switch";
import { Button } from "tns-core-modules/ui/button";
import { ImageSource } from "tns-core-modules/image-source";

const onyx_license: string = ""; // INSERT YOUR LICENSE KEY HERE
let page: Page = null;

export function onPageLoaded(args: EventData) {
  
    console.log("OnyxDemoApp: onPageLoaded..");
    //page.actionBarHidden = false;

}
export function onNavigatingTo(args: NavigatedData) {
    console.log("OnyxDemoApp: onNavigatingTo..");

    page = <Page>args.object;
    // onyxResult: OnyxResult;

    page.bindingContext = new HomeViewModel();
    page.actionBarHidden = true;

}

export function processResult(
    rawImage: string,  
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

    let confidenceLabel: Label = <Label>page.getViewById("confidenceLabel");
    confidenceLabel.text = "Focus Quality: " + quality;

    let nfiLabel: Label = <Label>page.getViewById("nfiLabel");
    nfiLabel.text = "NFI Score: " + nfiScore;

    let mlpLabel: Label = <Label>page.getViewById("mlpLabel");
    mlpLabel.text = "MLP Score: " + mlpScore;

    // Show result images
    showImage(rawImage, <Image>page.getViewById("rawImageView"));
    showImage(enhancedImage,<Image>page.getViewById("enhancedImageView"));
    showImage(processedImage,<Image>page.getViewById("processedImageView"));

}
export function showImage(base64Data: string, imageView: Image) {

    if (base64Data) {
        let imageSource = new ImageSource();
        imageSource.loadFromBase64(base64Data);
        imageView.imageSource = imageSource;
    }
}
export function startOnyx(args) {

    console.log("OnyxDemoApp: Starting Onyx..");

    let pictureBtn: Button = <Button>page.getViewById("pictureBtn");
    pictureBtn.isEnabled = false;

    // Start platform specific Onyx
    let onyx = new OnyxClass();
    if (isAndroid) {
        startAndroidOnyx(onyx);
    } else {
        startiOSOnyx(onyx);
    }
    pictureBtn.isEnabled = true;

}
export function startAndroidOnyx(onyx: OnyxClass) {

let manualCapture: Switch = <Switch>page.getViewById("manualSwitch");
let isManual: boolean = manualCapture.checked === true ? true : false;
let flashlightSwitch: Switch = <Switch>page.getViewById("flashlightSwitch");
let isFlashlight: boolean = flashlightSwitch.checked === true ? true : false;
let deadSwitch: Switch = <Switch>page.getViewById("deadSwitch");
let isDead: boolean = deadSwitch.checked === true ? true : false;

onyx.initAndPresentAndroidOnyx(
    onyx_license,         // Onyx license key
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
        let mainLabel: Label = <Label>page.getViewById("mainLabel");
        mainLabel.text = errorString;
    },
    (rawImage: string, // callback after fingerprint process is finished
        enhancedImage: string,
        processedImage: string,
        wsqData: string,
        templateData: string,
        quality: number,
        nfiScore: number,
        mlpScore: number): void => 
    {
        processResult(rawImage, enhancedImage, processedImage, wsqData, templateData, quality, nfiScore, mlpScore);
    });
}
export function startiOSOnyx(onyx: OnyxClass) {

    let manualCapture: Switch = <Switch>page.getViewById("manualSwitch");
    let isManual: boolean = manualCapture.checked === true ? true : false;
    let flashlightSwitch: Switch = <Switch>page.getViewById("flashlightSwitch");
    let isFlashlight: boolean = flashlightSwitch.checked === true ? true : false;
    let deadSwitch: Switch = <Switch>page.getViewById("deadSwitch");
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
            console.log("OnyxDemoApp: onyx configured CALLBACK: " + configuredOnyx);
        },
        (onyxError: string): void => {
            console.log("OnyxDemoApp: onyx ERROR CALLBACK: " + onyxError);
            dialogs.alert(onyxError);
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
            processResult(rawImage, enhancedImage, processedImage, wsqData, templateData, quality, nfiScore, mlpScore);
        }
    );
}
