import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { User } from 'lucide-react';

export default function UsernameChanger() {
  const [username, setUsername] = useState('Anonymous');

  function handleUsernameChange(newUsername) {
    setUsername(newUsername);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-100"
        >
          <User className="mr-2 h-4 w-4" />
          Change Username ({username})
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-zinc-900 dark:border-zinc-800 sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="dark:text-zinc-100 text-black">Change Username</DialogTitle>
        </DialogHeader>
        <Input 
          placeholder="Enter new username"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          className="bg-white border-gray-200 text-black placeholder-gray-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400"
        />
      </DialogContent>
    </Dialog>
  );
};
