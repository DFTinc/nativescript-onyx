package com.dft.onyxjava;
import com.dft.onyxjava.matching.*;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.dft.onyxcamera.config.Onyx;
import com.dft.onyxcamera.config.OnyxConfiguration;
import com.dft.onyxcamera.config.OnyxConfigurationBuilder;
import com.dft.onyxcamera.config.OnyxError;
import com.dft.onyxcamera.config.OnyxResult;

import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.security.ProviderInstaller;

import static com.dft.onyxjava.ValuesUtil.getCropFactor;
import static com.dft.onyxjava.ValuesUtil.getCropSizeHeight;
import static com.dft.onyxjava.ValuesUtil.getCropSizeWidth;
import static com.dft.onyxjava.ValuesUtil.getImageRotation;
import static com.dft.onyxjava.ValuesUtil.getLayoutPreference;
import static com.dft.onyxjava.ValuesUtil.getReticleAngle;
import static com.dft.onyxjava.ValuesUtil.getReticleOrientation;
import static com.dft.onyxjava.ValuesUtil.getReticleScale;
import static com.dft.onyxjava.ValuesUtil.getReturnEnhancedImage;
import static com.dft.onyxjava.ValuesUtil.getReturnFingerprintTemplate;
import static com.dft.onyxjava.ValuesUtil.getReturnProcessedImage;
import static com.dft.onyxjava.ValuesUtil.getReturnRawImage;
import static com.dft.onyxjava.ValuesUtil.getReturnWSQ;
import static com.dft.onyxjava.ValuesUtil.getShouldSegment;
import static com.dft.onyxjava.ValuesUtil.getShowLoadingSpinner;
import static com.dft.onyxjava.ValuesUtil.getUseFlash;
import static com.dft.onyxjava.ValuesUtil.getUseManualCapture;
import static com.dft.onyxjava.ValuesUtil.getUseOnyxLive;

// import static com.dft.onyxjava.ValuesUtil.*;

public class OnyxSetupActivity extends AppCompatActivity implements ProviderInstaller.ProviderInstallListener {
    private static final String TAG = "OnyxSetupActivity";
    private static final int ONYX_REQUEST_CODE = 1337;
    MainApplication application = new MainApplication();
    private Activity activity;
    private ImageView fingerprintView;
    private Animation fadeIn;
    private Animation fadeOut;
    private Button startOnyxButton;
    private AlertDialog alertDialog;
    private ImageView rawImageView;
    private ImageView processedImageView;
    private ImageView enhancedImageView;
    private TextView livenessResultTextView;
    private TextView nfiqScoreTextView;

    private OnyxConfiguration.SuccessCallback successCallback;
    private OnyxConfiguration.ErrorCallback errorCallback;
    private OnyxConfiguration.OnyxCallback onyxCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ProviderInstaller.installIfNeededAsync(this, this); // This is needed in order for SSL to work on Android 5.1 devices and lower
        getWriteExternalStoragePermission(); // This is for file writing permission on SDK >= 23
        setupUI();
        setupCallbacks();
        setupOnyx(this.activity);

    }
    // 2019
//    @Override
//    public void onResume() {
//        super.onResume();
//        if (MainApplication.getOnyxResult() != null) {
//            displayResults(MainApplication.getOnyxResult());
//        }
//    }
//
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        if (requestCode == ERROR_DIALOG_REQUEST_CODE) {
//            // Adding a fragment via GoogleApiAvailability.showErrorDialogFragment
//            // before the instance state is restored throws an error. So instead,
//            // set a flag here, which will cause the fragment to delay until
//            // onPostResume.
//            mRetryProviderInstall = true;
//        }
//    }
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        if (requestCode == ONYX_REQUEST_CODE) {
//            if (resultCode == RESULT_OK) {
//                OnyxResult onyxResult = application.getOnyxResult();
//                displayResults(onyxResult);
//            }
//        }
//    }
    private void setupCallbacks() {
        successCallback = new OnyxConfiguration.SuccessCallback() {
            @Override
            public void onSuccess(OnyxResult onyxResult) {
                application.setOnyxResult(onyxResult);
                // displayResults(onyxResult);
                application.callbackNativeScriptWithResult(onyxResult); // calls NS
            }
        };

        errorCallback = new OnyxConfiguration.ErrorCallback() {
            @Override
            public void onError(OnyxError onyxError) {
                Log.e("OnyxError", onyxError.getErrorMessage());
                application.setOnyxError(onyxError);
                application.callbackNativeScriptWithError(onyxError.getErrorMessage()); // calls NS
                finishActivityForRunningOnyx();
            }
        };

        onyxCallback = new OnyxConfiguration.OnyxCallback() {
            @Override
            public void onConfigured(Onyx configuredOnyx) {
                application.setConfiguredOnyx(configuredOnyx);
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        startOnyxButton.setEnabled(true);
                    }
                });
                // startOnyxButton.setEnabled(true);
            }
        };
    }
    private void finishActivityForRunningOnyx() {
        if (MainApplication.getActivityForRunningOnyx() != null) {
            MainApplication.getActivityForRunningOnyx().finish();
        }
    }
    private void setupOnyx(final Activity activity) {

        Bundle args = getIntent().getExtras();
        String license = args.getString("license");
        // boolean useFlash = args.getBoolean("useFlash", false);

        // Create an OnyxConfigurationBuilder and configure it with desired options
        OnyxConfigurationBuilder onyxConfigurationBuilder = new OnyxConfigurationBuilder()
                .setActivity(activity)
                .setLicenseKey(license)
                .setReturnRawImage(getReturnRawImage(this))
                .setReturnProcessedImage(getReturnProcessedImage(this))
                .setReturnEnhancedImage(getReturnEnhancedImage(this))
                .setReturnWSQ(getReturnWSQ(this))
                .setReturnFingerprintTemplate(getReturnFingerprintTemplate(this))
                .setShowLoadingSpinner(getShowLoadingSpinner(this))
                .setUseOnyxLive(getUseOnyxLive(this))
                .setUseFlash(getUseFlash(this))
                .setUseManualCapture(getUseManualCapture(this))
                .setShouldSegment(getShouldSegment(this))
                .setImageRotation(getImageRotation(this))
                .setReticleOrientation(getReticleOrientation(this))
                .setCropSize(getCropSizeWidth(this), getCropSizeHeight(this))
                .setCropFactor(getCropFactor(this))
                .setReticleScale(getReticleScale(this))
                .setLayoutPreference(getLayoutPreference(this))
                .setFingerDetectMode(OnyxConfiguration.FingerDetectMode.LIVE_FINGER.ordinal()) // OnyxSetup has no switch for this by default
                .setSuccessCallback(successCallback)
                .setErrorCallback(errorCallback)
                .setOnyxCallback(onyxCallback);


        // Reticle Angle overrides Reticle Orientation so have to set this separately
        if (getReticleAngle(this) != null) {
            onyxConfigurationBuilder.setReticleAngle(getReticleAngle(this));
        }
//        if (getUseManualCapture(this)) {
//            onyxConfigurationBuilder.setUseManualCapture(true);
//        }

        // 2019 Removed
//        if (getImageRotation(this) != null) {
//            onyxConfigurationBuilder.setImageRotation(getImageRotation(this));
//        }

        // Finally, build the OnyxConfiguration
        onyxConfigurationBuilder.buildOnyxConfiguration();
    }
    private void displayResults(OnyxResult onyxResult) {


        if (onyxResult.getRawFingerprintImage() != null) {
            //rawImageView.setImageDrawable(null);
            //rawImageView.setImageBitmap(onyxResult.getRawFingerprintBitmap());
        }
        if (onyxResult.getProcessedFingerprintImage() != null) {
            //processedImageView.setImageDrawable(null);
            //processedImageView.setImageBitmap(onyxResult.getProcessedFingerprintBitmap());
        }
        if (onyxResult.getEnhancedFingerprintImage() != null) {
            //enhancedImageView.setImageDrawable(null);
            //enhancedImageView.setImageBitmap(onyxResult.getEnhancedFingerprintBitmap());
        }

        if (onyxResult.getMetrics() != null) {
            livenessResultTextView.setText(Double.toString(onyxResult.getMetrics().getLivenessConfidence()));
            nfiqScoreTextView.setText(Integer.toString(onyxResult.getMetrics().getNfiqMetrics().getNfiqScore()));
            // focusScoreTextView.setText(Double.toString(Math.round(onyxResult.getMetrics().getFocusQuality() * 100.0) / 100.0));
            // mlpScoreTextView.setText(Double.toString(Math.round(onyxResult.getMetrics().getNfiqMetrics().getMlpScore() * 100.0) / 100.0));
        }

    }

    private void setupUI() {

        activity = this;
        setContentView(R.layout.activity_main);
        fingerprintView = new ImageView(this);
        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        addContentView(fingerprintView, layoutParams);
        rawImageView = findViewById(R.id.rawImageView);
        processedImageView = findViewById(R.id.processedImageView);
        enhancedImageView = findViewById(R.id.enhancedImageView);
        livenessResultTextView = findViewById(R.id.livenessResult);
        nfiqScoreTextView = findViewById(R.id.nfiqScore);
        startOnyxButton = findViewById(R.id.start_onyx);
        startOnyxButton.setEnabled(false);
        startOnyxButton.bringToFront();
        startOnyxButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MainApplication.setOnyxResult(null);
                startActivityForResult(new Intent(activity, OnyxActivity.class), ONYX_REQUEST_CODE);
            }
        });
        Button refreshConfigButton = findViewById(R.id.refresh_config);
        refreshConfigButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setupOnyx(activity);
                startOnyxButton.setEnabled(false);
            }
        });
    }
    private void showFingerprintAnimation() {
        createFadeInAnimation();
        createFadeOutAnimation();
        fingerprintView.startAnimation(fadeIn);
    }

    private boolean getWriteExternalStoragePermission() {
        boolean hasPermission;
        if (Build.VERSION.SDK_INT >= 23) {
            if (this.checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.v(TAG,"Permission is granted");
                hasPermission = true;
            } else {
                Log.v(TAG,"Permission is revoked");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                hasPermission = false;
            }
        }
        else { //permission is automatically granted on sdk<23 upon installation
            Log.v(TAG,"Permission is granted");
            hasPermission = true;
        }
        return hasPermission;
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults[0]== PackageManager.PERMISSION_GRANTED){
            Log.v(TAG,"Permission: "+permissions[0]+ " was " + grantResults[0]);
        }
    }
    /**
     * The below is for updating the device's security provider to protect against SSL exploits
     * See https://developer.android.com/training/articles/security-gms-provider#java
     */
    private static final int ERROR_DIALOG_REQUEST_CODE = 11111;
    private boolean mRetryProviderInstall;

    /**
     * This method is only called if the provider is successfully updated
     * (or is already up-to-date).
     */
    @Override
    public void onProviderInstalled() {
        Log.i("OnyxSetupActivity","Provider is up-to-date, app can make secure network calls.");
    }

    /**
     * This method is called if updating fails; the error code indicates
     * whether the error is recoverable.
     */
    @Override
    public void onProviderInstallFailed(int errorCode, Intent recoveryIntent) {
        GoogleApiAvailability availability = GoogleApiAvailability.getInstance();
        if (availability.isUserResolvableError(errorCode)) {
            // Recoverable error. Show a dialog prompting the user to
            // install/update/enable Google Play services.
            availability.showErrorDialogFragment(
                    this,
                    errorCode,
                    ERROR_DIALOG_REQUEST_CODE,
                    new DialogInterface.OnCancelListener() {
                        @Override
                        public void onCancel(DialogInterface dialog) {
                            // The user chose not to take the recovery action
                            onProviderInstallerNotAvailable();
                        }
                    });
        } else {
            // Google Play services is not available.
            onProviderInstallerNotAvailable();
        }
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
        if (mRetryProviderInstall) {
            // We can now safely retry installation.
            ProviderInstaller.installIfNeededAsync(this, this);
        }
        mRetryProviderInstall = false;
    }

    private void onProviderInstallerNotAvailable() {
        // This is reached if the provider cannot be updated for some reason.
        // App should consider all HTTP communication to be vulnerable, and take
        // appropriate action.
        Log.i("OnyxSetupActivity","ProviderInstaller not available, device cannot make secure network calls.");
    }
    public void createFadeInAnimation() {
        fadeIn = (new AlphaAnimation(0.0f, 1.0f));
        fadeIn.setDuration(500);
        fadeIn.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationEnd(Animation animation) {
                new CountDownTimer(1000, 1000) {

                    @Override
                    public void onFinish() {
                        final OnyxResult onyxResult = MainApplication.getOnyxResult();
                        if (onyxResult.getFingerprintTemplate() != null) {
                            fingerprintView.startAnimation(fadeOut);
                        }
                    }

                    @Override
                    public void onTick(long millisUntilFinished) {
                    }

                }.start();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }

            @Override
            public void onAnimationStart(Animation animation) {
                fingerprintView.setVisibility(View.VISIBLE);
            }
        });
    }

    public void createFadeOutAnimation() {
        fadeOut = new AlphaAnimation(1.0f, 0.0f);
        fadeOut.setDuration(500);
        fadeOut.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationEnd(Animation animation) {
                fingerprintView.setVisibility(View.INVISIBLE);
                new EnrollUtil().createEnrollQuestionDialog(activity);
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }

            @Override
            public void onAnimationStart(Animation animation) {
            }
        });
    }
}
