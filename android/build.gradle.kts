plugins {
    // Keep plugins declared but not applied here; module-level will apply them.
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}

// Centralized configuration placeholder — Android Studio will populate Gradle wrapper and sync dependencies on import
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

