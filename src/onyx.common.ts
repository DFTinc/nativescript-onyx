export interface OnyxPluginCallback {
  ( configuredOnyx: string): void;
}
export interface OnyxPluginErrorCallback {
  ( onyxError: string): void;
}
export interface OnyxPluginSuccessCallback {
  ( rawImage: string,
    enhancedImage: string,
    processedImage: string,
    wsqData: string,
    template: string,
    livenessConfidence: number,
    nfiScore: number,
    mlpScore: number): void;
}
export class OnyxCommon {

    // Plugin callbacks
    public onyxPluginCallback: OnyxPluginCallback;
    public onyxPluginErrorCallback: OnyxPluginErrorCallback;
    public onyxPluginSuccessCallback: OnyxPluginSuccessCallback;

}
