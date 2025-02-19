import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggler({ isDark, toggleDarkMode }) {
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleDarkMode}
      className="bg-white text-black hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-100"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
