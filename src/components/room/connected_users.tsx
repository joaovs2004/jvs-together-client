import { Card, CardContent } from '@/components/ui/card';
import { useWebSocketContext } from '@/websocket-context';
import { Users, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConnectedUsers() {
  const { lastMessage } = useWebSocketContext();
  const [connectedUsers, setConnectedUsers] = useState(Array<string>());

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "connectedClients") {
        setConnectedUsers(jsonMessageData.clients);
      }
    }
  }, [lastMessage]);

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-gray-800 dark:text-zinc-100" />
            <span className="font-medium text-gray-800 dark:text-zinc-100">Connected Users</span>
          </div>
          <div className="space-y-2">
            {connectedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-100 text-gray-800 dark:bg-zinc-800 rounded-md dark:text-zinc-100"
              >
                <User className="h-4 w-4" />
                <span>{user}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
