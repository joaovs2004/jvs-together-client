import { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Player from './components/room/player';
import VideoChanger from './components/room/video_changer';
import ConnectedUsers from './components/room/connected_users';
import UsernameChanger from './components/room/username_changer';

export default function YoutubeSyncPlayer() {
  const [connectedUsers, setConnectedUsers] = useState(Array<string>());
  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:9001");

  useEffect(() => {
    sendMessage(JSON.stringify({ type: "sendToRoom", roomId: "teste" }));
  }, []);

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "connectedClients") {
        setConnectedUsers(jsonMessageData.clients);
      } else if (jsonMessageData.type == "ping") {
        sendMessage(JSON.stringify({"type": "pong"}));
      }
    }

  }, [lastMessage]);

  return (
    <div className="dark">
      <div className="min-h-screen min-w-screen transition-colors duration-200 dark:bg-zinc-950 bg-white">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <UsernameChanger sendMessageFunction={sendMessage}/>
          </div>

          <VideoChanger/>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Player sendMessageFunction={sendMessage}/>
            <ConnectedUsers connectedUsers={connectedUsers}/>
          </div>
        </div>
      </div>
    </div>
  );
};

