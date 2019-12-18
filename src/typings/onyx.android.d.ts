

declare module com {
	export module dft {
		export module onyxjava {
			export class OnyxPlugin {
				public constructor();
				public InitOnyx(
					param0: any, 		// Context 
					param1: any, 			// Owner's Activity
					param2: string,							// License key
					param3: java.lang.Boolean,				// showOnyxConfig
					param4: java.lang.Boolean,				// returnRawImage
					param5: java.lang.Boolean,				// returnProcessedImage
					param6: java.lang.Boolean,				// returnEnhancedImage
					param7: java.lang.Boolean, 				// returnWSQ
					param8: java.lang.Boolean, 				// returnFingerprintTemplate
					param9: java.lang.Boolean, 				// showLoadingSpinner
					param10: java.lang.Boolean,				// useOnyxLive
					param11: java.lang.Boolean, 			// useFlash
					param12: java.lang.Boolean, 			// useManualCapture
					param13: java.lang.Boolean,				// useDeadFinger (FingerDetectMode DEAD_FINGER | LIVE_FINGER)
					param14: java.lang.Boolean, 			// shouldSegment
					param15: number, 						// imageRotation
					param16: string, 						// reticleOrientation (LEFT | RIGHT)
					param17: number, 						// cropWidth
					param18: number, 						// cropHeight
					param19: number, 						// cropFactor
					param20: number, 						// reticleScale
					param21: string 						// layoutPreference (FULL | UPPER_THIRD)
				);
			}
		}		
	}
}
