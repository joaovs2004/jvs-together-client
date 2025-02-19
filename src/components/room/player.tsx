import { Card, CardContent } from '@/components/ui/card';

export default function Player() {
  return (
    <div className="lg:col-span-3">
      <Card className="bg-white rounded-none border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-800 dark:text-zinc-100">
            <span className="text-center px-4">Enter a YouTube URL to start watching</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
