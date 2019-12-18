package com.dft.onyxjava;

import android.app.Activity;
import android.app.Application;

import com.dft.onyx.core;
import com.dft.onyxcamera.config.Onyx;
import com.dft.onyxcamera.config.OnyxConfiguration;
import com.dft.onyxcamera.config.OnyxError;
import com.dft.onyxcamera.config.OnyxResult;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import org.opencv.android.OpenCVLoader;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Main application to hold Onyx objects
 */

public class MainApplication extends Application {

    private static final String TAG = "OnyxJava";

    private static NativeScriptCallback pluginCallback;

    private static Onyx configuredOnyx;
    private static OnyxResult onyxResult;
    private static OnyxError onyxError;

    private static OnyxConfiguration.SuccessCallback successCallback;
    private static OnyxConfiguration.ErrorCallback errorCallback;
    private static OnyxConfiguration.OnyxCallback onyxCallback;

    private static Activity activityForRunningOnyx;

    static {
        if (!OpenCVLoader.initDebug()) {
            Log.d(TAG, "Unable to load OpenCV!");
        } else {
            Log.i(TAG, "OpenCV loaded successfully");
            core.initOnyx();
        }
    }


    /**
     Running Onyx
     */
    public static void setActivityForRunningOnyx(OnyxActivity activityForRunningOnyx) {
        MainApplication.activityForRunningOnyx = activityForRunningOnyx;
    }
    public static Activity getActivityForRunningOnyx() {
        return activityForRunningOnyx;
    }

    /**
     Configured Onyx
     */
    public void setConfiguredOnyx(Onyx configuredOnyx) {
        MainApplication.configuredOnyx = configuredOnyx;
    }
    public static Onyx getConfiguredOnyx() {
        return configuredOnyx;
    }

    /**
     Onyx Result
     */
    public static void setOnyxResult(OnyxResult onyxResult) { MainApplication.onyxResult = onyxResult; }
    public static OnyxResult getOnyxResult() { return onyxResult; }

    /**
     Onyx Error
     */
    public void setOnyxError(OnyxError onyxError) { MainApplication.onyxError = onyxError; }
    public static OnyxError getOnyxError() { return onyxError; }



    /**
     * Onyx callbacks
     */
    public void setSuccessCallback(OnyxConfiguration.SuccessCallback successCallback) { this.successCallback = successCallback;}
    public static OnyxConfiguration.SuccessCallback getSuccessCallback() {
        return successCallback;
    }

    public void setErrorCallback(OnyxConfiguration.ErrorCallback errorCallback) { this.errorCallback = errorCallback; }
    public static OnyxConfiguration.ErrorCallback getErrorCallback() { return errorCallback; }

    public void setOnyxCallback(OnyxConfiguration.OnyxCallback onyxCallback) { this.onyxCallback = onyxCallback; }
    public OnyxConfiguration.OnyxCallback getOnyxCallback() { return onyxCallback; }

    /**
     Onyx NS plugin callback
     */
    public void setPluginCallback(NativeScriptCallback pluginCallback) { MainApplication.pluginCallback = pluginCallback; }
    public static NativeScriptCallback getPluginCallback() {
        return pluginCallback;
    }
    public void callbackNativeScriptWithResult(OnyxResult onyxResult) {

        if (onyxResult != null) {

            ByteArrayOutputStream rawStream = new ByteArrayOutputStream();
            onyxResult.getRawFingerprintImage().compress(Bitmap.CompressFormat.PNG, 100, rawStream);
            byte[] rawByteArray = rawStream.toByteArray();
            String rawEncoded = Base64.encodeToString(rawByteArray, Base64.DEFAULT);

            ByteArrayOutputStream processedStream = new ByteArrayOutputStream();
            onyxResult.getProcessedFingerprintImage().compress(Bitmap.CompressFormat.PNG, 100, processedStream);
            byte[] processedByteArray = processedStream.toByteArray();
            String processedEncoded = Base64.encodeToString(processedByteArray, Base64.DEFAULT);

            ByteArrayOutputStream enhacedStream = new ByteArrayOutputStream();
            onyxResult.getEnhancedFingerprintImage().compress(Bitmap.CompressFormat.PNG, 100, enhacedStream);
            byte[] enhancedByteArray = enhacedStream.toByteArray();
            String enhancedEncoded = Base64.encodeToString(enhancedByteArray, Base64.DEFAULT);

            if (pluginCallback != null) {
                pluginCallback.success(
                        rawEncoded,
                        processedEncoded,
                        enhancedEncoded,
                        onyxResult.getWsqData() != null ? Base64.encodeToString(onyxResult.getWsqData(),Base64.DEFAULT) : null,
                        onyxResult.getFingerprintTemplate() != null ? Base64.encodeToString(onyxResult.getFingerprintTemplate().getData(),Base64.DEFAULT) : null,
                        onyxResult.getMetrics().getLivenessConfidence(),
                        onyxResult.getMetrics().getNfiqMetrics().getNfiqScore(),
                        onyxResult.getMetrics().getNfiqMetrics().getMlpScore()
                );
            }

            if (this.getActivityForRunningOnyx() != null) {
                this.getActivityForRunningOnyx().finish();
            }

            // Save results as file
            // this.saveResults(onyxResult); TODO: context not working, getApplicationConext() ?

        }
    }
    public void callbackNativeScriptWithError(String error) {
        if (pluginCallback != null) {
            pluginCallback.error(error);
        }
    }

    /**
     * Helpers
     */
    public void saveResults(OnyxResult onyxResult) {

        if (onyxResult.getRawFingerprintImage() != null) {
            this.saveBitmapFile(onyxResult.getRawFingerprintImage(), "finger-raw.png");
        }
        if (onyxResult.getProcessedFingerprintImage() != null) {
            this.saveBitmapFile(onyxResult.getProcessedFingerprintImage(), "finger-processed.png");
        }
        if (onyxResult.getEnhancedFingerprintImage() != null) {
            this.saveBitmapFile(onyxResult.getEnhancedFingerprintImage(), "finger-enhanced.png");
        }

    }
    public void saveBitmapFile(Bitmap bmp, String filename) {

        OutputStream out = null;

        try {
            out = getApplicationContext().openFileOutput(filename, Context.MODE_PRIVATE);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, out); // bmp is your Bitmap instance
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.flush();
                    out.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }




}

