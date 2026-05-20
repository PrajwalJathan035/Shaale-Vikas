# 🏫 Shaale Vikas (School Development)

**Empowering Rural Schools Together through Alumni Connectivity & Transparent Philanthropy.**

Shaale Vikas is a dual-platform bridging application (Android & Web) designed to connect alumni with their alma maters to address infrastructure deficiencies. It provides a transparent, real-time ecosystem where schools can log requirements and alumni can track project progress from pledge to completion.

---

## 🚀 Project Overview

In many rural areas, schools struggle with infrastructure maintenance due to a lack of direct connection with their successful alumni. **Shaale Vikas** solves this by:
- Providing a **centralized dashboard** for schools to list urgent needs (roof repairs, smart classrooms, sanitation).
- Enabling **secure pledging** for alumni to contribute capital directly to specific projects.
- Ensuring **transparency** through "Before & After" evidence-based reporting and a public Hall of Fame.

---

## ✨ Key Features

### 👤 Alumni Portal
- **Infrastructure Discovery**: Browse a curated list of active school requirements with priority labels (Urgent, Moderate, Low).
- **Secure Pledging**: Commitment-based funding with simulated payment gateway integration (UPI, Bank Transfer, Card).
- **Personal Impact Tracking**: "My Pledges" dashboard to monitor personal contributions and the status of supported projects.
- **Hall of Fame**: A competitive leaderboard recognizing top community contributors.
- **Impact Gallery**: Visual proof of completed restorations through before-and-after photo comparisons.

### 🛠️ School Admin (Headmaster) Hub
- **Requirement Logging**: Detailed form-based system to log new infrastructure gaps with budget estimates and defect snapshots.
- **Project Lifecycle Management**: Ability to update progress, upload "After" photos, and formally close completed projects.
- **Donor Analytics**: Overview of total funds raised, unique donor counts, and detailed transaction histories.
- **Real-time Synchronization**: Optional cloud backup to keep school records safe and accessible.

### 📱 Technical Highlights
- **Offline-First Architecture**: Fully functional without internet using local SQLite (Room) persistence.
- **Cross-Platform Readiness**: Integrated Kotlin Android App and a high-fidelity React Web prototype.
- **Animated Navigation**: Smooth UI transitions using Jetpack Compose (Android) and Motion/AnimatePresence (Web).

---

## 🛠️ Tech Stack

### **Mobile (Android App)**
- **Language**: Kotlin 1.9.20+
- **Framework**: Jetpack Compose (Declarative UI)
- **Database**: Room (SQLite Abstraction)
- **Networking/Sync**: Firebase Firestore (Optional real-time sync)
- **Asynchronous**: Kotlin Coroutines & Flow
- **Image Loading**: Coil (Image caching & fetching)
- **Architecture**: MVVM / Data Layer Pattern

### **Web (Dashboard Prototype)**
- **Language**: TypeScript
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Motion (formerly Framer Motion)
- **Build Tool**: Vite

---

## 📂 Project Structure

```
shaale-vikas/
├── android/                   # Android Native Module
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/shaalevikas/app/
│   │   │   │   ├── data/      # Room DB, Models, Firebase Service
│   │   │   │   ├── ui/        # Compose Screens, Theme
│   │   │   │   └── MainActivity.kt
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle.kts
│   └── settings.gradle.kts
├── src/                       # React Web Module
│   ├── App.tsx                # Main Web Logic
│   ├── types.ts               # Shared Interfaces
│   └── main.tsx
├── package.json               # Web Dependencies
├── build.gradle.kts           # Root Project Config
└── README.md
```

---

## ⚙️ Installation & Setup

### **Prerequisites**
- **Android Studio Jellyfish** (or newer)
- **Node.js** (v18+) for the Web version
- **JDK 17**

### **Android App Setup**
1. Clone the repository.
2. Open the `shaale-vikas` folder in Android Studio.
3. Wait for the **Gradle Sync** to complete.
4. (Optional) Add `google-services.json` to `android/app/` if using Firebase features.
5. Select a device/emulator (API 26+) and click **Run**.

### **Web Dashboard Setup**
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📝 Usage Guide

1. **Onboarding**: Choose between "Alumni Gate" or "Admin Hub" paths.
2. **Registration**: Create a profile with your name, school affiliation, and (for alumni) graduation batch.
3. **Browsing**: 
   - **Alumni**: Scroll through the list of "Active Needs". Click a card to see detailed descriptions and current funding progress.
   - **Admin**: View the school's statistics and total capital raised.
4. **Action**:
   - **Alumni**: Click "Pledge Funds", enter an amount, and complete the secure transaction simulation.
   - **Admin**: Use the "+" button to add a new deficiency or "Edit" to upload a completion photo.
5. **Impact**: Visit the "Hall of Fame" to see community ranking or the "Impact Gallery" for success stories.

---

## 🗺️ Architecture & Workflow

The app follows a **Layered Architecture**:
1. **Data Layer**: Room handles local persistence. `FirebaseService` handles optional cloud sync.
2. **UI Layer**: Stateless Composables/Components driven by StateFlow and state variables.
3. **Business Logic**: Navigation state determines the active screen, while ViewModel-like logic in `MainActivity` handles database operations.

---

## 🔮 Future Improvements
- **Payment Gateway Integration**: Replace simulation with Razorpay/Stripe for actual fund transfers.
- **Push Notifications**: Notify alumni when a project they supported reaches 100% funding.
- **Geographic Mapping**: Show a map of schools in the district and their respective needs.
- **Audit Logs**: Generate PDF reports for schools to provide to government education boards.

---

## 👥 Contributors
- **Project Lead**: Developed as part of the Shaale Vikas school development initiative.

---

## 📄 License
This project is licensed under the **Apache License 2.0**.

---
*Created for the Shaale Vikas community empowerment program.*
