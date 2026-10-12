# Add project specific ProGuard rules here.
# For more details, see: http://developer.android.com/guide/developing/tools/proguard.html

# Preserve Line Numbers & Source File for Crash Reports & Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod

# Allow R8 to perform aggressive optimizations and access modification
-allowaccessmodification
-repackageclasses ''

# Application Main Entry Point
-keep class pro.criptotracker.app.MainActivity { *; }

# Capacitor Plugins and Dynamic Bridge
-keep public class * extends com.getcapacitor.Plugin {
    public <fields>;
    public <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

# Preserve JavaScript Interface calls in WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Firebase Authentication Native Plugin (CapAwesome)
-keep public class io.capawesome.capacitorjs.plugins.firebase.authentication.** {
    public <fields>;
    public <methods>;
}

# Credential Manager & Google ID library (Android 14+ / API 36 Google Sign-In)
-keep class androidx.credentials.playservices.** { *; }
-keep class com.google.android.libraries.identity.googleid.** {
    public <fields>;
    public <methods>;
}

# Suppress harmless warnings from optional/third-party dependencies so R8 can optimize fully
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
-dontwarn androidx.credentials.**
-dontwarn com.google.android.libraries.identity.googleid.**
-dontwarn io.capawesome.capacitorjs.plugins.firebase.authentication.**
-dontwarn com.facebook.**
-dontwarn com.twitter.**
-dontwarn com.google.android.play.core.**
-dontwarn org.apache.cordova.**
-dontwarn androidx.**
