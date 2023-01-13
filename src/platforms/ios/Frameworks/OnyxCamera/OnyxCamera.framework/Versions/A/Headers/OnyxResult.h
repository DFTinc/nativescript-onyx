//
//  OnyxResult.h
//  OnyxCamera
//
//  Created by Matthew Wheatley on 2/3/18.
//  Copyright © 2018 Diamond Fortress. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CaptureMetrics.h"

@interface OnyxResult : NSObject
@property UIImage* grayRawFingerprintImage;
@property UIImage* rawFingerprintImage;
@property UIImage* processedFingerprintImage;
@property UIImage* enhancedFingerprintImage;
@property UIImage* blackWhiteProcessedFingerprintImage;
@property NSData* wsqData;
@property NSData* grayRawWsqData;
@property NSData* fingerprintTemplate;
@property NSData* ISOFingerprintTemplate;
@property CaptureMetrics* captureMetrics;

- (UIImage*) getGrayRawFingerprintImage;

- (UIImage*) getRawFingerprintImage;

- (UIImage*) getProcessedFingerprintImage;

- (UIImage*) getEnhancedFingerprintImage;

- (UIImage*) getBlackWhiteProcessedFingerprintImage;

- (NSData*) getWsqData;

- (NSData*) getGrayRawWsqData;

- (NSData*) getFingerprintTemplate;

- (NSData*) getISOFingerprintTemplate;

- (CaptureMetrics*) getMetrics;

- (NSString*) getFingerprintImageUri:(UIImage*)image;
- (NSString*) getBase64EncodedString:(NSData*)data;

@end
