package com.dft.onyxjava;

/**
 * Defines methods for NativeScript Plugin callbacks
 */
public interface NativeScriptCallback {

    /**
     * Defines a success callback method, which is used to pass success function reference
     * from the nativescript to the Java plugin
     *
     */
    void success(String rawImage,
                 String processedImage,
                 String enhancedImage,
                 String wsqData,
                 String template,
                 double quality,
                 double nfiqScore,
                 double mlpScore);


    /**
     * Defines a error callback method, which is used to pass success function reference
     * from the nativescript to the Java plugin
     *
     */
    void error(String errorMsg);
}
