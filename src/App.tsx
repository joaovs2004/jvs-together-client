import Player from './components/room/player';
import VideoChanger from './components/room/video_changer';
import ConnectedUsers from './components/room/connected_users';
import UsernameChanger from './components/room/username_changer';
import { WebSocketProvider } from './websocket-context';
import { useParams } from 'react-router';
import VideoHistory from './components/room/video_history';
import { Menu, Share2, Users } from 'lucide-react';

export default function YoutubeSyncPlayer() {
  const params = useParams();
  const room_id = params.room_id;

  if (!room_id) return;

  return (
    <WebSocketProvider room_id={room_id}>
      <div className="dark">
        <div className="min-h-screen min-w-screen transition-colors duration-200 dark:bg-zinc-950">
          <div className="room-shell">
            <header className="sync-topbar">
              <button className="topbar-icon" aria-label="Menu"><Menu size={20} /></button>
              <a className="sync-logo" href="#">Jvs Together</a>
              <button className="topbar-icon share-room" aria-label="Compartilhar sala"><Share2 size={17} /></button>
              <div className="topbar-media"><VideoChanger room_id={room_id} /></div>
              <div className="topbar-right">
                <VideoHistory room_id={room_id} />
                <UsernameChanger room_id={room_id} />
              </div>
            </header>

            <main className="sync-room-layout">
              <section className="sync-video-column"><Player room_id={room_id} /></section>
              <aside className="sync-chat-panel">
                <div className="chat-heading"><Users size={16} /><strong>Usuários conectados</strong><span>Sala {room_id}</span></div>
                <div className="chat-spacer" />
                <ConnectedUsers />
              </aside>
            </main>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

