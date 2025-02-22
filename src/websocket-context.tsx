import React, { createContext, useContext, ReactNode, JSX, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  room_id: string;
}

export function WebSocketProvider({ children, room_id }: WebSocketProviderProps): JSX.Element {
  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:9001");

  useEffect(() => {
    sendMessage(JSON.stringify({type: "sendToRoom", roomId: room_id}));
  }, []);

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "ping") {
        sendMessage(JSON.stringify({"type": "pong"}));
      }
    }

  }, [lastMessage]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}
