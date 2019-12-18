package com.dft.onyxjava;

import android.content.Context;
import android.graphics.Bitmap;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.dft.onyxcamera.config.Onyx;
import com.dft.onyxcamera.config.OnyxConfiguration;
import com.dft.onyxcamera.config.OnyxConfigurationBuilder;
import com.dft.onyxcamera.config.OnyxError;
import com.dft.onyxcamera.config.OnyxResult;
import com.dft.onyxcamera.ui.reticles.Reticle;

import java.io.OutputStream;
import java.io.IOException;


/**
 * Created by Yaroslav Zheleznov (yzheleznov@diamondfortress.com) on 2018.04.18..
 */

public class OnyxPlugin {

    MainApplication application = new MainApplication();

    OnyxConfiguration.SuccessCallback successCallback;
    OnyxConfiguration.ErrorCallback errorCallback;
    OnyxConfiguration.OnyxCallback onyxCallback;

    private Activity mActivity;
    private Context mContext;
    private String mLincese;

    // Optional Onyx parameters (used without OnyxSetup)
    Boolean mReturnRawImage;
    Boolean mReturnProcessedImage;
    Boolean mReturnEnhancedImage;
    Boolean mReturnWSQ;
    Boolean mReturnFingerprintTemplate;
    Boolean mShowLoadingSpinner;
    Boolean mUseOnyxLive;
    Boolean mUseFlash;
    Boolean mUseManualCapture;
    OnyxConfiguration.FingerDetectMode mFingerDetectMode;
    Boolean mShouldSegment;
    int mImageRotation;
    float mCropWidth;
    float mCropHeight;
    float mCropFactor;
    float mReticleScale;
    Reticle.Orientation mReticleOrientation;
    OnyxConfiguration.LayoutPreference mLayoutPreference;

    public OnyxPlugin() { }

    public void InitOnyx(Context context,
                         final Activity activity,
                         String license,
                         Boolean showOnyxConfig,
                         Boolean returnRawImage,
                         Boolean returnProcessedImage,
                         Boolean returnEnhancedImage,
                         Boolean returnWSQ,
                         Boolean returnFingerprintTemplate,
                         Boolean showLoadingSpinner,
                         Boolean useOnyxLive,
                         Boolean useFlash,
                         Boolean useManualCapture,
                         Boolean useDeadFinger,
                         Boolean shouldSegment,
                         int imageRotation,
                         String reticleOrientation,
                         float cropWidth,
                         float cropHeight,
                         float cropFactor,
                         float reticleScale,
                         String layoutPreference) {

        mActivity = activity;
        mContext = context;
        mLincese = license;

        // Optional Onyx parameters (used without OnyxSetup)
        mReturnRawImage = returnRawImage;
        mReturnProcessedImage = returnProcessedImage;
        mReturnEnhancedImage = returnEnhancedImage;
        mReturnWSQ = returnWSQ;
        mReturnFingerprintTemplate = returnFingerprintTemplate;
        mShowLoadingSpinner = showLoadingSpinner;
        mUseOnyxLive = useOnyxLive;
        mUseFlash = useFlash;
        mUseManualCapture = useManualCapture;
        if (useDeadFinger) {
            mFingerDetectMode = OnyxConfiguration.FingerDetectMode.DEAD_FINGER;
        } else {
            mFingerDetectMode = OnyxConfiguration.FingerDetectMode.LIVE_FINGER;
        }
        mShouldSegment = shouldSegment;
        mImageRotation = imageRotation;
        mCropWidth = cropWidth;
        mCropHeight = cropHeight;
        mCropFactor = cropFactor;
        mReticleScale = reticleScale;
        if (reticleOrientation.toLowerCase().equals("right")) mReticleOrientation = Reticle.Orientation.RIGHT;
        else mReticleOrientation = Reticle.Orientation.LEFT;
        if (layoutPreference.toLowerCase().equals("upper_third")) mLayoutPreference = OnyxConfiguration.LayoutPreference.UPPER_THIRD;
        else mLayoutPreference = OnyxConfiguration.LayoutPreference.FULL;


        if (showOnyxConfig) { // Show OnyxSetup
            launchOnyxSetup();
        }
        else { // launch onyx directly without setup screen
            setupCallbacks();
            configureOnyx();  // after the configuration finishes it calls launchOnyx()
        }
    }

    public void configureOnyx() {

        Bundle args = mActivity.getIntent().getExtras();

        // Create an OnyxConfigurationBuilder and configure it with desired options
        OnyxConfigurationBuilder onyxConfigurationBuilder = new OnyxConfigurationBuilder()
                .setActivity(mActivity)
                .setLicenseKey(mLincese)
                .setReturnRawImage(mReturnRawImage) // true
                .setReturnProcessedImage(mReturnProcessedImage) // true
                .setReturnEnhancedImage(mReturnEnhancedImage) // true
                .setReturnWSQ(mReturnWSQ) // false
                .setReturnFingerprintTemplate(mReturnFingerprintTemplate) // false
                .setShowLoadingSpinner(mShowLoadingSpinner) // true
                .setUseOnyxLive(mUseOnyxLive) // false
                .setUseFlash(mUseFlash) // true
                .setUseManualCapture(mUseManualCapture) // false
                .setFingerDetectMode(mFingerDetectMode.ordinal()) // false
                .setShouldSegment(mShouldSegment) // false
                .setImageRotation(mImageRotation) // 0
                .setReticleOrientation(mReticleOrientation) // Reticle.Orientation.LEFT
                .setCropSize(mCropWidth, mCropHeight) // 512,300 // NOPE
                .setCropFactor(mCropFactor) // 1.0
                .setReticleScale(mReticleScale) // 1.0
                .setLayoutPreference(mLayoutPreference) // OnyxConfiguration.LayoutPreference.FULL
                .setSuccessCallback(successCallback)
                .setErrorCallback(errorCallback)
                .setOnyxCallback(onyxCallback);

        // Finally, build the OnyxConfiguration
        onyxConfigurationBuilder.buildOnyxConfiguration();

    }

    private void setupCallbacks() {
        successCallback = new OnyxConfiguration.SuccessCallback() {
            @Override
            public void onSuccess(OnyxResult onyxResult) {
                if (onyxResult != null) {
                    application.setOnyxResult(onyxResult);
                    application.callbackNativeScriptWithResult(onyxResult); // calls NS
                }
            }
        };
        errorCallback = new OnyxConfiguration.ErrorCallback() {
            @Override
            public void onError(OnyxError onyxError) {
                if (onyxError != null) {
                    Log.e("OnyxError", onyxError.getErrorMessage());
                    application.setOnyxError(onyxError);
                    application.callbackNativeScriptWithError(onyxError.getErrorMessage()); // calls NS
                }

            }
        };
        onyxCallback = new OnyxConfiguration.OnyxCallback() {
            @Override
            public void onConfigured(Onyx configuredOnyx) {
                if (configuredOnyx != null) {
                    application.setConfiguredOnyx(configuredOnyx);
                    launchOnyx();
                }
            }
        };
    }

    public void launchOnyx() {

        mActivity.runOnUiThread(new Runnable() {
            public void run() {
                Bundle bundle = new Bundle();
                // bundle.putString("options", mArgsString);
                Intent onyxIntent = new Intent(mActivity, OnyxActivity.class)
                        .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                //! onyxIntent.putExtra("options", mArgsString);
                onyxIntent.putExtra("license", mLincese);
                onyxIntent.putExtra("useManualCapture", mUseManualCapture);
                mActivity.startActivity(onyxIntent);
            }
        });
    }

    public void launchOnyxSetup() {

        mActivity.runOnUiThread(new Runnable() {
            public void run() {
                Bundle bundle = new Bundle();
                Intent onyxIntent = new Intent(mActivity, OnyxSetupActivity.class)
                        .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                onyxIntent.putExtra("license", mLincese);
                onyxIntent.putExtra("useManualCapture", mUseManualCapture);
                mActivity.startActivity(onyxIntent);
            }
        });
    }

    /**
     * Register NativeScript Callbacks
     *
     * @param appContext
     * @param callbacks
     */
    public static void registerJavaCallbacks(Context appContext, NativeScriptCallback callbacks) {
        if (callbacks == null) {
            Log.e("JAVA LIB", "Callback is null!");
        } else {

        }
        try {
            MainApplication application = new MainApplication();
            application.setPluginCallback(callbacks);
        } catch (Exception ex) {
            callbacks.error("Register callback failed! EXCEPTION: " + ex.getMessage());
        }

    }

    /**
     * Unregister the application from GCM
     *
     * @param appContext
     * @param callbacks
     */
    public static void unregisterJavaCallbacks(Context appContext, NativeScriptCallback callbacks) {
        if (callbacks == null) {
            Log.e("JAVA LIB", "Callback is null!");
        } else {
            try {
                MainApplication application = new MainApplication();
                application.setPluginCallback(null);
            } catch (Exception ex) {
                callbacks.error("UnRegister callback failed! EXCEPTION: " + ex.getMessage());
            }
        }

    }

}
