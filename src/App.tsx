import Player from './components/room/player';
import VideoChanger from './components/room/video_changer';
import ConnectedUsers from './components/room/connected_users';
import UsernameChanger from './components/room/username_changer';
import { WebSocketProvider } from './websocket-context';
import { useParams } from 'react-router';
import VideoHistory from './components/room/video_history';

export default function YoutubeSyncPlayer() {
  const params = useParams();
  const room_id = params.room_id;

  if (!room_id) return;

  return (
    <WebSocketProvider room_id={room_id}>
      <div className="dark">
        <div className="min-h-screen min-w-screen transition-colors duration-200 dark:bg-zinc-950">
          <div className="room-shell">
            <header className="room-header">
              <div className="room-brand"><span className="brand-mark">J</span><div><strong>Jvs Together</strong><small>Watch together</small></div></div>
              <div className="room-actions"><span className="room-badge"><i /> Room {room_id}</span><UsernameChanger room_id={room_id} /><VideoHistory room_id={room_id} /></div>
            </header>

            <main className="room-layout">
              <section className="watch-column">
                <div className="room-title"><div><span className="eyebrow">WATCH PARTY</span><h1>Watching together</h1></div><span className="live-badge"><i /> LIVE ROOM</span></div>
                <VideoChanger room_id={room_id} />
                <Player room_id={room_id} />
              </section>
              <aside className="room-sidebar"><ConnectedUsers /></aside>
            </main>
            <footer className="room-footer">A shared room for videos, wherever you are.</footer>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

