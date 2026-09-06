export interface FriendshipProfile {
  person1: string;
  person2: string;
  startYear: number;
  currentYear: number;
  theme: 'sunset' | 'midnight' | 'emerald' | 'amber';
  tagline: string;
}

export interface Chapter {
  id: string;
  index: number;
  year: string;
  title: string;
  subtitle: string;
  narrative: string;
  quote: string;
  image?: string;
  photoCaption?: string;
  dialogue?: {
    speaker: string;
    text: string;
  }[];
  pos: {
    x: number;
    y: number;
    z: number;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
  };
  visualType: 'hallway' | 'stargazing' | 'diner' | 'distance' | 'reunion' | 'forever';
  badge: string;
}

export interface MemoryItem {
  id: string;
  chapterId: string;
  type: 'polaroid' | 'cassette' | 'note' | 'ticket' | 'origami' | 'bracelet';
  title: string;
  date: string;
  content: string;
  details?: string;
  image?: string;
  pos: {
    x: number;
    y: number;
    z: number;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
  };
  flipped?: boolean;
}

export interface EchoDialogueLine {
  speaker: string;
  text: string;
  color?: 'amber' | 'cyan' | 'emerald' | 'purple';
}

export interface FriendshipEcho {
  id: string;
  title: string;
  era: string;
  location: string;
  lines: EchoDialogueLine[];
  pos: {
    x: number;
    y: number;
    z: number;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
  };
}

export interface MilestonePolaroid {
  id: string;
  year: '2016' | '2017' | '2018' | '2019';
  milestoneTitle: string;
  photoTitle: string;
  caption: string;
  handwrittenNote: string;
  date: string;
  location: string;
  image?: string;
  accentColor: string;
  tapeColor?: string;
  rotationDeg: number;
  pos: {
    x: number;
    y: number;
    z: number;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
  };
}
