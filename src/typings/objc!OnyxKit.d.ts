// NetworkUtil.h
declare class NetworkUtil extends NSObject {
	static isInternetAvailable(): boolean;
}

// NetwrokReachability.h

// extern NSString *kNetworkReachabilityChangedNotification;
declare const enum NetworkStatus {
	NotReachable = 0,
    ReachableViaWiFi,
    ReachableViaWWAN
}

declare class NetworkReachability extends NSObject {
	static reachabilityWithHostName(hostName: string): NetworkReachability; // (instancetype)
	//static reachabilityWithAddress(static hostAddress:struct sockaddr_in): NetworkReachability;
	static reachabilityForInternetConnection(): NetworkReachability;
	static reachabilityForLocalWiFi(): NetworkReachability;
	startNotifier(): boolean;
	stopNotifier(): void;
	currentReachabilityStatus(): NetworkStatus;
	connectionRequired(): boolean;
}

// OnyxMatch.h
declare class OnyxMatch extends NSObject {
	static "match:with:"(d1: NSData, d2: NSData): number;
	static "pyramidMatch:withImage:scales:"(referenceData: NSData, probeImage: UIImage, scaleArray: NSArray<typeof NSObject>): number;
	static onyxcoreversion(): string;
}

// OnyxEnums.h
declare const enum OnyxFinger {
	left_1 = 0,
    left_2 = 1,
    left_3 = 2,
    left_4 = 3,
    left_5 = 4,
    right_1 = 5,
    right_2 = 6,
    right_3 = 7,
    right_4 = 8,
    right_5 = 9
}
declare const enum OnyxErrorType {
	/**
     * This error occurs when the camera fails to auto-focus.
     */
    AUTOFOCUS_FAILURE,
    
    /**
     * This error occurs whenever the camera sub-system fails.
     */
    CAMERA_FAILURE,
    
    /**
     * This error occurs when the license validation fails.
     */
    LICENSING_FAILURE,
    
    /**
     * This error occurs when permissions have not been granted.
     */
    PERMISSIONS_FAILURE,
    
    /**
     * This error occurs when there is an error encountered during capture.
     */
    FINGERPRINT_CAPTURE_FAILURE,
    
    /**
     * This error occurs when there is a successful capture, but the resulting image is
     * of too low quality (NFIQ Score = 5)
     */
    FINGERPRINT_TOO_LOW_QUALITY,
    /**
     * This error occurs if there is an error communicating with the liveness detection
     * server.  Check if there is an internet connection, and if not, advise client to
     * connect to the internet, or to try a different internet connection.
     */
    LIVENESS_FAILURE
}

declare const enum LayoutPreference {
	UPPER_THIRD,
	FULL
}
declare const enum ReticleOrientation {
	LEFT,
	RIGHT
}
declare const enum ImageRotation {
    ROTATE_NONE = 0,
    ROTATE_90_COUNTER_CLOCKWISE = 90,
    ROTATE_180 = 180,
    ROTATE_90_CLOCKWISE = 270 // 270
}
declare const enum FingerDetectMode {
    DEAD_FINGER,
    LIVE_FINGER
}

// OnyxError.h
declare class OnyxError extends NSObject {
	/*!
	* @brief The enumeration specifying the type of error that occurred.
	*/
	error: OnyxErrorType;
	/*!
	* @brief A string containing details about the error.
	*/
	errorMessage: string;
	/**
	 * The NSError that was caught (it can be null).
	 */
	exception: NSError;

}

// NfiqMetrics.h
declare class NfiqMetrics extends NSObject {
	nfiqScore: number;
	mlpScore: number;
	
	getNfiqScore(): number;
	getMlpScore(): number;
}

// CaptureMetrics.h
declare class CaptureMetrics extends NSObject {
	livenessConfidence: number;
	nfiqMetrics: NfiqMetrics;
	focusQuality: number;
	distanceToCenter: number;
	
	getLivenessConfidence(): number;
	getFocusQuality(): number;
	getDistanceToCenter(): number;
	getNfiqMetrics(): NfiqMetrics;

}

// OnyxResult.h
declare class OnyxResult extends NSObject {

	grayRawFingerprintImage: UIImage;
	rawFingerprintImage: UIImage;
	processedFingerprintImage: UIImage;
	enhancedFingerprintImage: UIImage;
	blackWhiteProcessedFingerprintImage: UIImage;

	wsqData: NSData;
	grayRawWsqData: NSData;
	fingerprintTemplate: NSData;
	ISOFingerprintTemplate: NSData;
	captureMetrics: CaptureMetrics;
	
	getGrayRawFingerprintImage(): UIImage;
	getRawFingerprintImage(): UIImage;
	getProcessedFingerprintImage(): UIImage;
	getEnhancedFingerprintImage(): UIImage;
	getBlackWhiteProcessedFingerprintImage(): UIImage;
	getWsqData(): NSData;
	getGrayRawWsqData(): NSData;
	getFingerprintTemplate(): NSData;
	getISOFingerprintTemplate(): NSData;
	getMetrics(): CaptureMetrics;
	getFingerprintImageUri(image:UIImage): string;
	getBase64EncodedString(data: NSData): string;

}

// ProcessedFingerprint.h
declare class ProcessedFingerprint extends NSObject {

	/*!
	* @brief The source image.
	*/
	sourceImage: UIImage;
	/*!
	* @brief The cropped raw image.
	*/
	rawImage: UIImage;
	/*!
	 * @brief The grayscale source image.
	 */
	grayRawImage: UIImage;
	/*!
	 * @brief The processed image.
	 */
	processedImage: UIImage;
	/*!
	 * @brief The enhanced image.
	 */
	enhancedImage: UIImage;
	/*!
	 * @brief The fingerprint template, to be used with Onyx matchers.
	 */
	fingerprintTemplate: NSData;
	/*!
 	* @brief The ISO fingerprint template.
	 */
	ISOFingerprintTemplate: NSData;
	/*!
	 * @brief The WSQ data for preprocessed fingerprint.
	 */ 
	WSQ: NSData;
	/*!
	 * @brief The WSQ data for grayscale source image.
	 */
	rawGrayWSQ: NSData;
	/*!
	 * @brief Black and white image of the processed image.
	 */
	blackWhiteProcessed: UIImage;
	/*!
	 * @brief The quality score. Any score over 15 is acceptable.
	 */
	quality: number;
	/*!
	 * @brief The focus measure score. [0, 1] 0.1 is acceptable.
	 */
	focusMeasure: number;
	/*!
	 * @brief The nfiqscore of the WSQ file.
	 */
	nfiqscore: number;
	/*!
	 * @brief The mlscore of the WSQ file.
	 */
	mlpscore: number;
	/*!
	 * @brief The direction of the finger.
	 * Images will be flipped upright beforehand.
	 */
	fingerDirection: number;
	/*!
	 * @brief The finger number.
	 */
	finger: number;
	/*!
	 * @brief image size for all returned images.
	 */
	size: CGSize;
}

// OnyxViewController.h
interface OnyxDelegate extends NSObjectProtocol {

	"Onyx:successCallback:"(controller: OnyxViewController, data: NSData): void;
	"Onyx:errorCallback:"(controller: OnyxViewController, error: NSError): void;
	
}
declare var OnyxDelegate: {
	prototype: OnyxDelegate;
};

// OnyxViewController.h
interface OnyxViewControllerDelegate extends NSObjectProtocol {

	// OnyxViewController Delegate methods
	"Onyx:didOutputProcessedFingerprint:fromSet:"(controller: OnyxViewController, fingerprint: ProcessedFingerprint, fingerprints: NSArray<typeof ProcessedFingerprint>): void;

	/*!
	* @return NSError
	*/
	"Onyx:errorCallback:"(controller: OnyxViewController, error: NSError): void;
	"Onyx:onCancel:"(controller: OnyxViewController, error: NSError): void;

}
declare var OnyxViewControllerDelegate: {
	prototype: OnyxViewControllerDelegate;
};

// Onyx.h

// TODO
// #define OnyxBlue [UIColor colorWithRed:(float)(54.0/255.0) green:(float)(152.0/255.0) blue:(float)(211.0/255.0) alpha:1.0]
// let onyxBlue: UIColor.colorWithRedGreenBlueAlpha(54.0/255.0, 152.0/255.0, 211.0/255.0, 1.0);

declare class Onyx extends NSObject implements OnyxViewControllerDelegate {

	private selectedFinger: number;
    private fingerDirection: number;
    private spinnerView: UIView;
	private activityIndicatorView: UIActivityIndicatorView;
	
	/*!
	* @brief ONYX's delegate
	*/
	delegate: OnyxDelegate;

	/*!
	* @brief ONYX Config data
	*/
	onyxConfig: OnyxConfiguration;
	viewController: UIViewController;
	onyxResult: OnyxResult;

	// extern NSString * const IMAGE_URI_PREFIX;
	// extern NSString * const ONYX_ICON_IMAGE_DATA;
	// IMAGE_URI_PREFIX: string;
	// ONYX_ICON_IMAGE_DATA: string;

	doSetup(onyxConfig: OnyxConfiguration): void;
	capture(viewController: UIViewController): void;

	// protocol
	"Onyx:didOutputProcessedFingerprint:fromSet:"(controller: OnyxViewController, fingerprint: ProcessedFingerprint, fingerprints: NSArray<typeof ProcessedFingerprint>): void;
	"Onyx:errorCallback:"(controller: OnyxViewController, error: NSError): void;
	"Onyx:onCancel:"(controller: OnyxViewController, error: NSError): void;

}

// OnyxConfiguration.h
declare class OnyxConfiguration extends NSObject {

	static alloc(): OnyxConfiguration; // inherited from NSObject
	static init(): OnyxConfiguration; // inherited from NSObject
	static new(): OnyxConfiguration; // inherited from NSObject

	/**
	 * This method sets the ViewController
	 */
	viewController: UIViewController;

	/**
	 * This method sets the Onyx license key.
	 */
	licenseKey: string;

	/**
	 * This property sets the background color.
	 */
	backgroundColorHexString: string;

	/**
	 * This property sets whether or not to return the raw fingerprint image in the OnyxResult.
	 */
	returnRawFingerprintImage: boolean;

	/**
	 * This property sets whether or not to return the gray-scale raw fingerprint image in the OnyxResult.
	 */
	returnGrayRawFingerprintImage: boolean;

	/**
	 * This property sets whether or not to return the processed fingerprint image in the OnyxResult.
	 */
	returnProcessedFingerprintImage: boolean;

	/**
	 * This property sets whether or not to return the enhanced fingerprint image in the OnyxResult.
	 */
	returnEnhancedFingerprintImage: boolean;

	/**
	 * This property sets whether or not to return the black and white processed fingerprint image in the OnyxResult.
	 */
	returnBlackWhiteProcessedFingerprintImage: boolean;

	/**
	 * This property sets whether or not to return the fingerprint template in the OnyxResult.
	 */
	returnFingerprintTemplate: boolean;

	/**
	 * This property sets whether or not to return the WSQ image in the OnyxResult.
	 */
	returnWsq: boolean;

	/**
	 * This property sets whether or not to return the gray-scale WSQ fingerprint image in the OnyxResult.
	 */
	returnGrayRawWsq: boolean;

	/**
	 * This method sets whether or not the capture task should segment the fingerprint image.
	 */
	shouldSegment: boolean;

	/**
	 * This property sets whether or not to return the ISO fingerprint template in the OnyxResult
	 */
	returnISOFingerprintTemplate: boolean;

	/**
	 * This method sets the rotation amount for the image.
	 * rotation an integer specifying the rotation amount (0, 90, 180, or 270 degrees).
	 * only 90 degree rotations are supported for speed reasons.
	 */
	rotation: number;

	/**
	 * This method sets the crop to the whole finger.
	 * wholeFingerCrop a Bool specifying to crop the whole finger.
	 */
	wholeFingerCrop: boolean;

	/**
	 * This method sets the crop size for the capture image.
	 */
	cropSize: CGSize;

	/**
	 * This method sets the crop factor for the capture image.
	 */
	cropFactor: number;

	/**
	 * This methods sets that the Onyx spinner should be shown.
	 */
	showSpinner: boolean;

	/**
	 * This method sets the layout preference for the OnyxFragment
	 */
	layoutPreference: LayoutPreference;

	/**
	 * This method sets the method of capture to be a manual capture of the fingerprint
	 */
	useManualCapture: boolean;

	/**
	 * This method indicates which finger detect mode to use.
	 */
	fingerDetectMode: FingerDetectMode;

	/**
	 * This property determines if the manual capture text will be displayed or not
	 */
	showManualCaptureText: boolean;

	/**
	 * Instructions to display for manual capture (localization)
	 */
	manualCaptureText: string;

	/**
	 * This method sets whether to use remote storage as part of the configuration
	 */
	useRemoteStorage: boolean;

	/**
	 * This method sets whether to use remote storage as part of the configuration
	 */
	useLiveness: boolean;

	/**
	 * This method sets whether to use the flash
	 */
	useFlash: boolean;

	/**
 	* This method sets the flash brightness level
 	*/
	LEDBrightness: number;

	/**
	 * This method sets the orientation of the reticle {@link Reticle.Orientation}
	 */
	reticleOrientation: ReticleOrientation;

	/**
	 * This method sets the angle of the reticle
	 * angle the degree angle to rotate the reticle
	 * positive values rotate clockwise
	 */
	reticleAngle: number;

	/**
	 * This method sets the scale of the reticle
	 */
	reticleScale: number;

	/**
	 * Overrides the reticle orientation to use the angle passed in to reticleAngle
	 */
	overrideReticleOrientation: boolean;

	/**
	 * Text to display for the back button (localization)
	 */
	backButtonText: string;

	/**
	 * Custom text to display on capture screen
	 */
	infoText: string;

	/**
	 * Text color for custom information as a hex string value
	 */
	infoTextColorHexString: string;

	/**
	 * Image URI to display
	 */
	base64ImageData: string;

	// /**
	//  * This sets the OnyxCallback event handler.
	//  * The callback returns the Onyx object used to start Onyx.
	//  */
	// @property void(^onyxCallback)(Onyx* onyx);
	// (callback:()=> Onyx): void;
	//onyxCallback: void;
	onyxCallback(callback:()=> Onyx): void;

	// /**
	//  * This sets the ErrorCallback event handler.
	//  * errorCallback (required) the event handler for the ErrorCallback.
	//  */
	errorCallback(callback:()=> OnyxError): void;
	//errorCallback: void;

	// /**
	//  * This sets the OnyxSuccess event handler.
	//  * successCallback (required) the event handler for the SuccessCallback.
	//  */
	// void(^successCallback)(OnyxResult* onyxResult);
	successCallback(callback:()=> OnyxResult): void;
	//successCallback: void;

	/**
	 * Returns instance of OnyxConfiguration. If no instance is found it creates one.
	 */
	//+(OnyxConfiguration*)sharedInstance;

}

// OnyxConfigurationBuilder.h
declare class OnyxConfigurationBuilder extends NSObject {
	onyxConfig: OnyxConfiguration;

	static alloc(): OnyxConfigurationBuilder; // inherited from NSObject
	static init(): OnyxConfigurationBuilder; // inherited from NSObject
	static new(): OnyxConfigurationBuilder; // inherited from NSObject

	/**
	 * This sets the view controller from which to launch Onyx (required)
	 */
	// -(OnyxConfigurationBuilder*(^)(UIViewController*))setViewController;
	//-(    OnyxConfigurationBuilder*      (^)(UIViewController*)   )setViewController;
	setViewController(): (UIViewController)=> OnyxConfigurationBuilder;

	/**
	 * This sets the Onyx license key (required)
	 */
	//setLicenseKey(callback:()=> string): OnyxConfigurationBuilder;
	setLicenseKey(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This sets the background color of the area below the capture area
	 */
	setBackgroundColorHexString(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return imagery for the raw fingerprint image in the OnyxResult.
	 */
	setReturnRawImage(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return imagery for the gray-scale raw fingerprint image in the OnyxResult.
	 */
	setReturnGrayRawImage(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return imagery for the processed fingerprint image in the OnyxResult.
	 */
	setReturnProcessedImage(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return imagery for the enhanced fingerprint image in the OnyxResult.
	 */
	setReturnEnhancedImage(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return imagery for the black and white processed fingerprint image in the OnyxResult.
	 */
	setReturnBlackWhiteProcessedImage(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return Onyx fingerprint template in the OnyxResult.
	 */
	setReturnFingerprintTemplate(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return the WSQ image in the OnyxResult.
	 */
	setReturnWSQ(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return a gray-scale raw WSQ image in the OnyxResult.
	 */
	setReturnGrayRawWSQ(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not the capture task should segment the fingerprint image.
	 */
	setShouldSegment(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to return ISO figneprint tempalte in the OnyxResult.
	 */
	setReturnISOFingerprintTemplate(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the rotation amount for the image.
	 * only 90 degree rotations are supported for speed reasons.
	 */
	setImageRotation(): (number)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to set the crop to the whole finger.
	 */
	setWholeFingerCrop(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the crop size for the capture image.
	 */
	setCropSize(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the crop factor for the capture image.
	 */
	setCropFactor(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to show the spinner while waiting for Onyx setup
	 */
	setShowLoadingSpinner(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to use Onyx LIVE liveness detection
	 */
	setUseOnyxLive(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the flash mode on (true) or off (false)
	 */
	setUseFlash(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * THis method set the LED Brightness
	 */
	setLEDBrightness(): (number)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the capture mode on (true) or off (false)
	 */
	setUseManualCapture(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets whether or not to show the manual capture text
	 */
	setShowManualCaptureText(): (boolean)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the text to display for manual capture (localization)
	 */
	setManualCaptureText(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the {@link com.dft.onyxcamera.ui.reticles.Reticle.Orientation}
	 */
	setReticleOrientation(): (ReticleOrientation)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the angle of the reticle
	 * positive values rotate clockwise
	 */
	setReticleAngle(): (number)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the scale of the reticle
	 */
	setReticleScale(): (number)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the text to use for the back button (localization)
	 */
	setBackButtonText(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the customer information text to be displayed on the capture screen.
	 */
	setInfoText(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the text color to use for the custom information
	 */
	setInfoTextColorHexString(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the image data to be displayed on the capture screen
	 */
	setBase64ImageData(): (string)=> OnyxConfigurationBuilder;

	/**
	 * This method sets the finger detect mode.
	 */
	setFingerDetectMode(): (FingerDetectMode)=> OnyxConfigurationBuilder;

	/**
	 * This sets the OnyxCallback event handler.
	 * The callback returns the Onyx object used to start Onyx.
	 */
	setOnyxCallback(): (Onyx)=> OnyxConfigurationBuilder;

	/**
	 * This sets the ErrorCallback event handler.
	 */
	setErrorCallback(): (OnyxError)=> OnyxConfigurationBuilder;

	/**
	 * This sets the OnyxSuccess event handler.
	 */
	// 	-(OnyxConfigurationBuilder*(^)(void(^)(OnyxResult*)))setSuccessCallback;
	setSuccessCallback(): (OnyxResult)=> OnyxConfigurationBuilder;


	/**
	 * This method builds the OnyxConfiguration object with the specified parameters, and
	 * checks that all configuration setup is complete before returning the Onyx object
	 */
	buildOnyxConfiguration(): void;

}

// OnyxViewController.h

declare class OnyxViewController extends UIViewController implements AVCaptureVideoDataOutputSampleBufferDelegate, UIGestureRecognizerDelegate {
	
	static alloc(): OnyxViewController; // inherited from NSObject
	static init(): OnyxViewController; // inherited from NSObject
	static new(): OnyxViewController; // inherited from NSObject

	/*!
 	 * @brief The OnyxViewController's delegate
 	 */
	delegate: OnyxViewControllerDelegate;

	/*!
	*@brief The OnyxViewController's configuration
	*/
	onyxConfig: OnyxConfiguration;

	/*!
	* @brief The onyx-core's version number
	*/
	readonly onyxcoreversion: string;

	/*!
	* @brief Option to show match score at end of enrollment [default: false]
	*/
	showMatchScore: boolean;

	/*!
	* @brief Option 
	*/
	useAutoFocus: boolean;

	/*!
	* @brief Option to change LED brightness for camera
	*/
	// LEDBrightness: number; // (0.0, 1.0]


	scaleFactors: NSArray<typeof NSObject>;

	infoLabel1: UILabel;
	infoLabel2: UILabel;

	/*!
	* @brief Text for a custom label in the info view.
	*/
	infoText: string;

	/*!
	* @brief Boolean for showing debug info on screen
	*/
	showDebug: boolean;

	focusMeasurementRequirement: number;

	frameCount: number;

	isProcessingManualCapture: boolean;

	/*!
	* Set capturePreview to true
	* @author Devan Buggay
	*
	* @return void
	*/
	capture(): void;

	/*!
	* Set up AVFoundation if inputDevice exists
	* @author Devan Buggay
	*
	* @return void
	*/
	setupAVFoundation(): void;

	/*!
	* Capture a still image from input device
	* @author Devan Buggay
	*
	* @return void
	*/
	captureStill(): void;
	/*!
	* Reset the focus and exposure of the camera. If iOS 8+, lock focus.
	* @author Devan Buggay
	*
	* @return void
	*/
	resetFocusAndExposure(): void;
	/*!
	* Start the process indicator
	* @author Devan Buggay
	*
	* @return void
	*/
	startProcessIndicator(): void;
	/*!
	* Stop the process indicator
	* @author Devan Buggay
	*
	* @return void
	*/
	stopProcessIndicator(): void;
	
}
