# StoresGo Mobile App

Enterprise-grade React Native mobile application for StoresGo - South Florida's premier ethnic grocery marketplace.

## Tech Stack

- **Framework:** React Native 0.73 (CLI, not Expo)
- **Navigation:** React Navigation v6
- **State Management:** Zustand
- **API Client:** Axios with caching, retry logic, offline support
- **Forms:** React Hook Form
- **Styling:** StyleSheet + Custom Theme System

## Features

- 🔐 **Secure Authentication** - JWT with refresh token rotation
- 📦 **Offline Support** - Data caching and request queuing
- 🔄 **Pull to Refresh** - Throughout the app
- 💀 **Skeleton Loading** - Instacart-style shimmer effects
- 🌐 **Network Status** - Real-time connectivity indicator
- 📊 **Analytics Ready** - Abstracted analytics layer
- 🔔 **Toast Notifications** - Beautiful feedback system
- ♿ **Accessibility** - Screen reader support

## Project Structure

```
src/
├── api/                 # API client with caching & offline support
├── components/          # Reusable UI components
│   ├── common/          # Button, Input, Skeleton, Toast, etc.
│   ├── product/         # Product-related components
│   ├── cart/            # Cart-related components
│   └── layout/          # Headers, footers, containers
├── config/              # App configuration & constants
├── navigation/          # React Navigation setup
├── screens/             # Screen components
│   ├── auth/            # Login, register, forgot password
│   ├── home/            # Home screen
│   ├── search/          # Search and browse
│   ├── product/         # Product details
│   ├── cart/            # Cart and checkout
│   ├── orders/          # Order history and tracking
│   └── account/         # Profile, addresses, settings
├── store/               # Zustand state management
├── theme/               # Colors, typography, spacing
├── utils/               # Analytics, helpers
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

## Prerequisites (Android Development on Windows)

- Node.js 18+
- Java Development Kit (JDK) 17
- Android Studio with:
  - Android SDK
  - Android SDK Platform 34
  - Android Virtual Device (AVD)

## Setup Instructions

### 1. Install Android Studio

Download from https://developer.android.com/studio

During installation, make sure to install:
- Android SDK
- Android SDK Platform
- Android Virtual Device

### 2. Configure Environment Variables (Windows)

Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Android Emulator

1. Open Android Studio
2. Go to Tools > Device Manager
3. Create a new virtual device (Pixel 6 recommended)
4. Select a system image (API 34)
5. Finish setup

### 5. Run the App

Start Metro bundler:
```bash
npm start
```

In a new terminal, run Android:
```bash
npm run android
```

## Build for Production (Android)

### Debug APK
```bash
npm run build:android:debug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
```bash
npm run build:android:release
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Release Bundle (for Play Store)
```bash
npm run bundle:android
```
AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

## Environment Configuration

Create a `.env` file in the root:

```
API_BASE_URL=https://storesgo.com/api
```

## API Integration

The app connects to the same Fastify backend as the web application. All endpoints are shared:
- Authentication: `/auth/*`
- Products: `/products/*`
- Cart: `/cart/*`
- Orders: `/orders/*`
- Addresses: `/addresses/*`

## iOS Development (Requires Mac)

iOS development requires a Mac with Xcode installed. If you need iOS:

**Option 1:** Get a Mac Mini (~$500-600 refurbished)
**Option 2:** Use MacinCloud (~$30/month) for cloud Mac rental
**Option 3:** Ship Android first, add iOS later

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
npm run clean:all
```

### Can't connect to device
Make sure USB debugging is enabled on physical device or emulator is running.
