# MediTravel Mobile — Capacitor Integration Guide

This directory contains the Capacitor mobile packaging setup for **MediTravel** (Android & iOS).

---

## 📱 Mobile Architecture & Structure

MediTravel wraps the existing Vite/React 19 single page app directly inside native WebViews using [Capacitor](https://capacitorjs.com/).

```
frontend/
├── android/                   # Capacitor Android Studio project
├── ios/                       # Capacitor Xcode project
├── capacitor.config.json      # Capacitor configuration file
├── CAPACITOR.md               # Mobile documentation & instructions
├── src/
│   ├── utils/
│   │   ├── geolocation.js    # Seamless Web / Native Capacitor Geolocation wrapper
│   │   └── capacitorInit.js  # App startup configuration (StatusBar, etc.)
```

---

## 🛠️ Requirements & Setup

### For Android:
- **Android Studio** (Electric Eel or newer recommended)
- **Android SDK** API 30+ (Android 11+)
- JDK 17+

### For iOS (macOS required):
- **Xcode** 15+
- CocoaPods / Swift Package Manager (built-in via Capacitor v8 Swift PM)

---

## 🚀 Common Commands

### 1. Build Web Assets & Sync Native Projects
Whenever you make changes to `src/` or web code, run:
```bash
npm run build
npx cap sync
```

### 2. Open in Android Studio
To launch Android Studio and build the Android APK / App Bundle:
```bash
npx cap open android
```

Alternatively, build directly from CLI (if Gradle/Android SDK environment variables are set):
```bash
cd android
./gradlew assembleDebug
```

### 3. Open in Xcode (macOS only)
To launch Xcode for iOS simulator or device deployment:
```bash
npx cap open ios
```

---

## 🔑 Permissions & Configured Plugins

### 1. `@capacitor/geolocation`
- **Android Permission**: `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />` & `<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />` configured in `android/app/src/main/AndroidManifest.xml`.
- **iOS Permission**: `NSLocationWhenInUseUsageDescription` configured in `ios/App/App/Info.plist`.
- **Fallback**: Automatically falls back to standard HTML5 browser geolocation when running in standard web mode.

### 2. `@capacitor/status-bar`
- Configured to overlay web content seamlessly with safe-area spacing handled in CSS (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`).

---

## 🎨 Asset Generation (App Icons & Splash Screens)
To customize app icons and splash screens automatically across all native densities:
```bash
npx @capacitor/assets generate --iconBackgroundColor '#0d9488' --splashBackgroundColor '#f8fafc'
```
*(Requires placing a 1024x1024 `icon.png` and 2732x2732 `splash.png` inside an `assets/` directory).*
