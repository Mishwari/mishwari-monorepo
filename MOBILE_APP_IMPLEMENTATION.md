# Mishwari Mobile App Implementation Plan

**Version:** 1.0  
**Target:** Passenger Mobile App (React Native + Expo)  
**Timeline:** 4-5 weeks  
**Code Reuse:** 70-75% from existing web apps

---

## 🎯 Overview

Add native mobile app to existing monorepo with minimal effort by reusing shared packages.

**Current Structure:**
```
✅ passenger-web (Next.js)
✅ driver-web (Next.js)
🆕 passenger-mobile (React Native + Expo)
```

**Shared Packages (Already Built):**
- ✅ @mishwari/api - 100% reusable
- ✅ @mishwari/types - 100% reusable
- ✅ @mishwari/utils - 95% reusable
- ✅ @mishwari/features-* - 100% reusable
- ✅ @mishwari/ui-primitives - 100% reusable
- 🆕 @mishwari/ui-native - Need to create

---

## 📦 Phase 1: Setup (Week 1)

### 1.1 Create Mobile UI Package

```bash
cd packages
mkdir -p ui-native/src/components
cd ui-native
pnpm init
```

**packages/ui-native/package.json:**
```json
{
  "name": "@mishwari/ui-native",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@mishwari/ui-primitives": "workspace:*",
    "@mishwari/types": "workspace:*",
    "nativewind": "^4.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-native": "^0.73.0"
  }
}
```

### 1.2 Create Mobile App

```bash
cd apps
npx create-expo-app passenger-mobile --template expo-template-blank-typescript
cd passenger-mobile
```

**apps/passenger-mobile/package.json:**
```json
{
  "name": "@mishwari/passenger-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios"
  },
  "dependencies": {
    "@mishwari/api": "workspace:*",
    "@mishwari/types": "workspace:*",
    "@mishwari/utils": "workspace:*",
    "@mishwari/ui-primitives": "workspace:*",
    "@mishwari/ui-native": "workspace:*",
    "@mishwari/features-auth": "workspace:*",
    "@mishwari/features-trips": "workspace:*",
    "@mishwari/features-bookings": "workspace:*",
    "@mishwari/features-passengers": "workspace:*",
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "react-native": "0.73.0",
    "nativewind": "^4.0.0",
    "firebase": "^12.6.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "expo-location": "~16.5.0"
  }
}
```

**apps/passenger-mobile/app.json:**
```json
{
  "expo": {
    "name": "Mishwari Passenger",
    "slug": "mishwari-passenger",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#005687"
    },
    "ios": {
      "bundleIdentifier": "com.mishwari.passenger",
      "supportsTablet": true
    },
    "android": {
      "package": "com.mishwari.passenger",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#005687"
      }
    },
    "plugins": [
      "expo-router",
      ["expo-location", {
        "locationAlwaysAndWhenInUsePermission": "Allow Mishwari to use your location."
      }]
    ]
  }
}
```

### 1.3 Update Root Configuration

**pnpm-workspace.yaml** (already includes apps/*)

**turbo.json** - Add mobile scripts:
```json
{
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 1.4 Install Dependencies

```bash
cd d:\Projects\FS\Mishwari\mishwari-monorepo
pnpm install
```

---

## 🎨 Phase 2: UI Components (Week 2)

### 2.1 Create Native Components

**packages/ui-native/src/components/Button.tsx:**
```typescript
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { ButtonProps } from '@mishwari/ui-primitives'

export const Button = ({ variant, onPress, children, loading, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`px-4 py-3 rounded-lg ${
        variant === 'primary' ? 'bg-[#005687]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-semibold">{children}</Text>
      )}
    </TouchableOpacity>
  )
}
```

**packages/ui-native/src/components/Input.tsx:**
```typescript
import { TextInput, View, Text } from 'react-native'

export const Input = ({ label, value, onChangeText, placeholder, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="mb-2 text-gray-700">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-4 py-3"
        {...props}
      />
    </View>
  )
}
```

**packages/ui-native/src/components/PhoneInput.tsx:**
```typescript
import { View, TextInput } from 'react-native'
import { usePhoneInput } from '@mishwari/ui-primitives'

export const PhoneInput = ({ value, onChange }) => {
  const { formattedValue, handleChange } = usePhoneInput(value, onChange)
  
  return (
    <View className="flex-row border border-gray-300 rounded-lg">
      <View className="bg-gray-100 px-4 py-3 justify-center">
        <Text>+967</Text>
      </View>
      <TextInput
        value={formattedValue}
        onChangeText={handleChange}
        placeholder="777 123 456"
        keyboardType="phone-pad"
        className="flex-1 px-4"
      />
    </View>
  )
}
```

**packages/ui-native/src/index.ts:**
```typescript
export { Button } from './components/Button'
export { Input } from './components/Input'
export { PhoneInput } from './components/PhoneInput'
```

### 2.2 Build UI Package

```bash
cd packages/ui-native
pnpm build
```

---

## 📱 Phase 3: Core Screens (Week 3)

### 3.1 Authentication Screen

**apps/passenger-mobile/app/(auth)/login.tsx:**
```typescript
import { View, Text } from 'react-native'
import { Button, PhoneInput } from '@mishwari/ui-native'
import { useAuth } from '@mishwari/features-auth'
import { useState } from 'react'

export default function LoginScreen() {
  const [phone, setPhone] = useState('')
  const { sendOTP, loading } = useAuth()

  const handleLogin = async () => {
    await sendOTP(phone)
    // Navigate to OTP screen
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">مشواري</Text>
      
      <PhoneInput value={phone} onChange={setPhone} />
      
      <Button 
        variant="primary" 
        onPress={handleLogin}
        loading={loading}
      >
        إرسال رمز التحقق
      </Button>
    </View>
  )
}
```

### 3.2 Trip Search Screen

**apps/passenger-mobile/app/(tabs)/search.tsx:**
```typescript
import { View, ScrollView } from 'react-native'
import { Button, Input } from '@mishwari/ui-native'
import { useTrips } from '@mishwari/features-trips/passenger'
import { useState } from 'react'

export default function SearchScreen() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const { searchTrips, trips, loading } = useTrips()

  const handleSearch = async () => {
    await searchTrips({ from_city: from, to_city: to })
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Input label="من" value={from} onChangeText={setFrom} />
        <Input label="إلى" value={to} onChangeText={setTo} />
        
        <Button variant="primary" onPress={handleSearch} loading={loading}>
          بحث
        </Button>

        {/* Trip list */}
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </View>
    </ScrollView>
  )
}
```

### 3.3 Navigation Setup

**apps/passenger-mobile/app/_layout.tsx:**
```typescript
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
```

---

## 🚀 Phase 4: Build & Deploy (Week 4)

### 4.1 Local Development

```bash
# Start development server
pnpm --filter @mishwari/passenger-mobile start

# Test on phone with Expo Go app
# Scan QR code
```

### 4.2 Production Build Setup

**Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

**Configure EAS:**
```bash
cd apps/passenger-mobile
eas build:configure
```

**eas.json:**
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

### 4.3 Build Commands

```bash
# Build Android APK
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### 4.4 CI/CD (Optional)

**Create .github/workflows/mobile-build.yml:**
```yaml
name: Build Mobile App

on:
  push:
    branches: [main]
    paths: ['apps/passenger-mobile/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build Android
        run: |
          cd apps/passenger-mobile
          eas build --platform android --non-interactive
```

---

## 🔧 Development Tools

### VS Code Extensions
```bash
code --install-extension msjsdiag.vscode-react-native
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension esbenp.prettier-vscode
```

### Testing
- **Development:** Expo Go app on phone (instant preview)
- **Android:** Android emulator (optional)
- **iOS:** iOS simulator (Mac only, optional)

---

## 📊 Code Reuse Summary

| Package | Reuse % | Notes |
|---------|---------|-------|
| @mishwari/api | 100% | Same API client |
| @mishwari/types | 100% | Same TypeScript types |
| @mishwari/utils | 95% | Only storage differs |
| @mishwari/features-* | 100% | All business logic |
| @mishwari/ui-primitives | 100% | Hooks and types |
| @mishwari/ui-native | 0% | New mobile components |
| **Overall** | **70-75%** | Minimal new code |

---

## ✅ Implementation Checklist

### Week 1: Setup
- [ ] Create `packages/ui-native` package
- [ ] Create `apps/passenger-mobile` app
- [ ] Configure Expo and dependencies
- [ ] Install Expo Go app on phone
- [ ] Test basic app runs

### Week 2: UI Components
- [ ] Build Button component
- [ ] Build Input component
- [ ] Build PhoneInput component
- [ ] Build Card component
- [ ] Test components with Expo Go

### Week 3: Core Features
- [ ] Implement login screen
- [ ] Implement OTP verification
- [ ] Implement trip search
- [ ] Implement trip details
- [ ] Implement booking flow

### Week 4: Polish & Deploy
- [ ] Add navigation
- [ ] Add error handling
- [ ] Test on multiple devices
- [ ] Setup EAS Build
- [ ] Build production APK/IPA
- [ ] Submit to stores

---

## 💰 Cost Estimate

- **Expo EAS Build:** Free tier or $29/month
- **Apple Developer:** $99/year
- **Google Play:** $25 one-time
- **Total:** ~$150/year + optional $29/month

---

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
cd d:\Projects\FS\Mishwari\mishwari-monorepo
pnpm install

# 2. Build shared packages
pnpm build:packages

# 3. Start mobile app
pnpm --filter @mishwari/passenger-mobile start

# 4. Scan QR with Expo Go app on phone
```

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

## 🎉 Key Benefits

✅ **70-75% code reuse** - Focus only on UI  
✅ **Same backend** - No API changes needed  
✅ **VS Code only** - No Android Studio/Xcode required  
✅ **Instant preview** - Test on real phone via Expo Go  
✅ **Type safety** - Shared TypeScript types  
✅ **Fast development** - 4-5 weeks to production  

---

**Status:** Ready to implement  
**Next Step:** Run setup commands and start building! 🚀
