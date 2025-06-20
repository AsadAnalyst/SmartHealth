# 💙 SmartHealth+ – AI-Powered Personal Health Tracker App

SmartHealth+ is a powerful and intelligent cross-platform health tracking mobile application built with **React Native (Expo)**, integrated with **Firebase**, **OpenAI API**, and **Firebase ML Kit**. The app lets users track their health metrics, scan medicines, analyze meals, and get AI-based health suggestions — all in one clean, modern interface.

---

## 🚀 Features

### 🧑‍⚕️ Health Tracking Dashboard
- Track daily:
  - 🥤 Water intake
  - 😴 Sleep duration
  - 🚶 Steps (manual)
- Visual summary cards

### 🤖 AI Health Assistant (OpenAI GPT)
- Ask health-related questions
- Get personalized suggestions (e.g., diet, workout, sleep)

### 📸 Camera Medicine Scanner (ML Kit OCR)
- Scan medicine names using camera
- Extract text with ML Kit OCR
- Show info or precautions (hardcoded/public API)

### 🍽️ Meal Analyzer (Mock or ML)
- Take a picture of your food
- Estimate calories and nutrients
- Option to manually log

### 🔔 Smart Notifications
- Water reminders
- Sleep notifications
- Custom medicine alarms

### 📊 Health Charts
- Weekly & monthly charts for sleep, water, steps

### 📁 Offline Support
- Store logs locally using AsyncStorage
- Sync with Firebase when reconnected

### 🌙 Dark Mode & Settings
- Toggle dark/light themes
- Update profile (name, age, weight)
- Export weekly report as PDF

---

## ⚙️ Tech Stack

| Technology        | Use Case                          |
|-------------------|------------------------------------|
| React Native (Expo) | Frontend UI                      |
| Firebase Auth      | User authentication               |
| Firebase Firestore | Real-time health data storage     |
| Firebase ML Kit    | Text Recognition (OCR)            |
| OpenAI GPT         | AI-based suggestions              |
| Expo Notifications | Push notifications                |
| AsyncStorage       | Offline health data logging       |
| React Navigation   | App navigation                    |
| Victory Native / ChartKit | Data visualization        |
| React Native Paper | Beautiful UI Components           |

---

## 🗂️ Project Structure

