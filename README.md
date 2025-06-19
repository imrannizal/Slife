# Slife

Slife is a to-do mobile application that enables users (primarily students) to access notes and todos from anywhere and across devices with the help of cloud sync. Slife also connects to Google Mail and Google Cloud with the permission of users who logged in with their google accounts, allowing users to receive important mails and upload/download their files on the cloud storage. Slife also has workspace features, where it resembles Microsoft Teams' team group. Users can create their own workspace and invite other users through a generated token. From there, users can edit the workspace in their favour, add todos and notes, and it will be shared across the participants of the workspace group.

These combined features that Slife offers to users allows them to be in a structured environment where they can focus in their daily tasks.

Tech Stack:
Frontend: React Native + Expo
Backend: Express + PostgreSQL
Backend Host: Railway + Beekeeper Studio (as DB client)
Offline storage: AsyncStorage
Auth: Google OAuth + JWT (Passport handles them)
State management: Zustand
UI: React Native Paper
SecureStore