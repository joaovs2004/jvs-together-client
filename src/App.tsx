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
          <div className="max-w-7xl mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <UsernameChanger room_id={room_id} />
              <VideoHistory room_id={room_id} />
            </div>

            <VideoChanger room_id={room_id} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Player room_id={room_id} />
              <ConnectedUsers />
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

