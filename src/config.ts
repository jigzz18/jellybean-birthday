/**
 * ==============================================================================
 * 💖 ROMANTIC BIRTHDAY DATE SURPRISE — CENTRAL CONFIGURATION
 * ==============================================================================
 * 
 * Simply edit the values below to personalize the experience for your girlfriend!
 * You do not need to edit any other files.
 */

export interface BirthdayConfig {
  /** Her name as it appears in headings and romantic notes */
  herName: string;

  /** Your name as signed at the bottom of the secret invite */
  myName: string;

  /** 
   * Path to the opening birthday video. 
   * Place your MP4 video in: /public/assets/birthday-video.mp4
   */
  introVideo: string;

  /** Date of the surprise date */
  date: string;

  /** Time of the date */
  time: string;

  /** Secret meeting location or pickup place */
  location: string;

  /** Final secret promise shown on the celebration screen */
  finalMessage: string;
}

export const CONFIG: BirthdayConfig = {
  // ✏️ Change to her real name
  herName: "Jellybean",

  // ✏️ Change to your name
  myName: "Charm",

  // 🎬 Video path in /public/assets/
  introVideo: "public/assets/birthday-video.mp4",

  // 📅 Fixed date details (she chooses the vibe, you handle the plan)
  date: "Saturday, September 23, 2026",
  time: "2:30 PM",
  location: "NL College(Malad)",

  // 💌 Final loving assurance
  finalMessage:
    "The actual plan stays a secret. Your only job is to show up and let me take care of the rest. ❤️",
};

/**
 * The 4 Vibe Moods
 * Note: Under NO circumstance are actual activities revealed here or anywhere in code!
 */
export interface VibeOption {
  id: "cozy" | "exciting" | "fun" | "surprise";
  emoji: string;
  title: string;
  subtitle: string;
  reactionHeader: string;
  reactionMessage: string;
  badge: string;
  gradient: string;
  accentColor: string;
}

export const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "cozy",
    emoji: "🌙",
    title: "TAKE IT EASY",
    subtitle: "A cozy little day with me.",
    reactionHeader: "Excellent choice. 🌙",
    reactionMessage: "I had a feeling you'd pick this one. 😌",
    badge: "Warm & Relaxed",
    gradient: "from-amber-500/20 via-rose-500/10 to-transparent",
    accentColor: "#E2C974",
  },
  {
    id: "exciting",
    emoji: "⚡",
    title: "SOMETHING EXCITING",
    subtitle: "Let's make some memories.",
    reactionHeader: "Ohhh... you picked this one. 👀",
    reactionMessage: "I like your thinking.",
    badge: "Thrilling & Electric",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    accentColor: "#D98894",
  },
  {
    id: "fun",
    emoji: "💃",
    title: "LET'S HAVE FUN",
    subtitle: "No boring birthday allowed.",
    reactionHeader: "Now we're talking. 😏",
    reactionMessage: "If you only knew what I have planned...",
    badge: "Playful & Vibrant",
    gradient: "from-rose-500/20 via-amber-500/10 to-transparent",
    accentColor: "#C7828D",
  },
  {
    id: "surprise",
    emoji: "🎁",
    title: "SURPRISE ME",
    subtitle: "I trust you. Do your worst. 😌",
    reactionHeader: "Brave choice. 😏",
    reactionMessage: "Okay. I won't tell you anything.",
    badge: "Pure Mystery",
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    accentColor: "#B76E79",
  },
];
