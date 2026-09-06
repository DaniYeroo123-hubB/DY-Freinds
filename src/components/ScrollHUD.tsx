import React from 'react';
import { Chapter, FriendshipProfile } from '../types';

interface ScrollHUDProps {
  profile: FriendshipProfile;
  chapters: Chapter[];
  progress: number;
  currentChapterIndex: number;
  isAudioOn?: boolean;
  isAutoScrolling?: boolean;
  onToggleAudio?: () => void;
  onToggleAutoScroll?: () => void;
  onOpenCustomize?: () => void;
  onOpenCodeModal?: () => void;
  onJumpToProgress: (progress: number) => void;
}

export const ScrollHUD: React.FC<ScrollHUDProps> = () => {
  return null;
};
