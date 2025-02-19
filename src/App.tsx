import { useState } from 'react';
import Player from './components/room/player';
import VideoChanger from './components/room/video_changer';
import ConnectedUsers from './components/room/connected_users';
import DarkModeToggler from './components/room/dark_mode_toggler';
import UsernameChanger from './components/room/username_changer';

export default function YoutubeSyncPlayer() {
  const [isDark, setIsDark] = useState(true);

  function toggleDarkMode() {
    setIsDark(!isDark);
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen min-w-screen transition-colors duration-200 dark:bg-zinc-950 bg-white">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <UsernameChanger></UsernameChanger>
            <DarkModeToggler isDark={isDark} toggleDarkMode={toggleDarkMode}></DarkModeToggler>
          </div>

          <VideoChanger></VideoChanger>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Player></Player>
            <ConnectedUsers></ConnectedUsers>
          </div>
        </div>
      </div>
    </div>
  );
};

