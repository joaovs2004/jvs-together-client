import { Card, CardContent } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import { useState } from 'react';

export default function ConnectedUsers() {
  const [connectedUsers] = useState([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ]);

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-gray-800 dark:text-zinc-100" />
            <span className="font-medium text-gray-800 dark:text-zinc-100">Connected Users</span>
          </div>
          <div className="space-y-2">
            {connectedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center gap-2 p-2 bg-gray-100 text-gray-800 dark:bg-zinc-800 rounded-md dark:text-zinc-100"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
