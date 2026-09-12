# 💖 Interactive Birthday Date Surprise Experience

A cinematic, romantic, interactive birthday surprise website designed for your girlfriend. 

She chooses the **mood/vibe** of the date, while you secretly plan the actual itinerary. At no point in the code or website are the actual activities revealed—keeping the surprise completely mysterious, exciting, and personal!

---

## ✨ Features

- 🎬 **Cinematic Opening Video**: Full-screen video that begins with a romantic "Tap to begin" overlay. The website only reveals itself when the video naturally finishes (`ended` event listener), with an 800–1200ms blurred sparkle transition.
- 💌 **One Central Configuration**: Change names, date, time, location, and video in `src/config.ts` without touching any other code.
- 🌙 **4 Romantic Vibe Options**:
  - 🌙 **Take It Easy** (*"A cozy little day with me."*)
  - ⚡ **Something Exciting** (*"Let's make some memories."*)
  - 💃 **Let's Have Fun** (*"No boring birthday allowed."*)
  - 🎁 **Surprise Me** (*"I trust you. Do your worst. 😌"*)
- 🔒 **Zero Spoilers**: Strict secrecy. The website only knows about the 4 moods; the real itinerary stays exclusively in your head.
- 📅 **Save The Date**: Calendar-style reveal card showing fixed date, time, location, and 4 playful instructions.
- 🎉 **Celebration & Confetti**: Heart confetti cascades and personal note when she confirms.
- 🎵 **Romantic Sound & Subtle Controls**: Ambient romantic audio toggle with procedural gentle chimes/harmonies (no broken audio links).
- 📱 **Mobile-First Luxury**: Perfectly tuned for iPhone/Android (375px, 390px, 430px) as well as tablets and desktops.

---

## 🛠️ Installation & Getting Started

### 1. Installation

Clone this repository and install all dependencies:

```bash
npm install
```

### 2. Development Server

Start the local development server:

```bash
npm run dev
```

Visit the local URL shown in your terminal (typically `http://localhost:3000`).

### 3. Production Build

To test or generate the production build:

```bash
npm run build
```

---

## 📹 Adding Your Video

Place your personal birthday video file at:

```text
public/assets/birthday-video.mp4
```

A sample romantic video is provided by default so you can preview the website immediately. When you are ready, simply replace `public/assets/birthday-video.mp4` with your own video (vertical 9:16 portrait or standard 16:9 MP4 format works smoothly).

If you want to use a different filename or path, update `introVideo` in `src/config.ts`.

---

## ✏️ Personalization (How to customize)

All personalization is managed in one central file: **`src/config.ts`**.

Open `src/config.ts` to customize:

```ts
export const CONFIG = {
  // ✏️ Her name
  herName: "Sarah",

  // ✏️ Your name
  myName: "Alex",

  // 🎬 Video path
  introVideo: "/assets/birthday-video.mp4",

  // 📅 Fixed date & time
  date: "Saturday, September 19, 2026",
  time: "7:00 PM",

  // 📍 Meeting point / pickup location
  location: "The Grand Arch Entrance (Downtown)",

  // 💌 Final loving note
  finalMessage:
    "The actual plan stays a secret. Your only job is to show up and let me take care of the rest. ❤️",
};
```

---

## 🚀 Deployment Instructions

This website runs entirely in the browser with no backend required, making deployment instant and free.

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will automatically be detected as **Vite**.
5. Click **"Deploy"**.

### Deploy to Netlify

1. Sign in to [Netlify](https://www.netlify.com).
2. Drag and drop the `dist` folder created by `npm run build`, OR connect your GitHub repository:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Click **"Deploy site"**.

### Deploy to GitHub Pages

1. In `vite.config.ts`, set the `base` property to your repository name:
   ```ts
   export default defineConfig({
     base: '/your-repo-name/',
     // ...
   });
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the `dist/` directory to GitHub Pages via Settings > Pages, selecting GitHub Actions or the `gh-pages` branch.

---

## 🔒 Security & Surprise Guarantee

The actual date activities (movie, shopping, dinner, escape room, etc.) are **NEVER** mentioned anywhere in the website, HTML, CSS, JavaScript, console messages, or metadata. Only the vibe mood is recorded.

Enjoy celebrating her special birthday! ❤️
