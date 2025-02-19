import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function VideoChanger() {
  const [videoUrl, setVideoUrl] = useState('');

  function handleVideoChange() {
    setVideoUrl(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={handleVideoChange}
        className="flex-1 bg-white border-gray-200 text-black placeholder-gray-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
      />
      <Button className="bg-white text-black hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 w-full sm:w-auto">
        Load Video
      </Button>
    </div>
  );
};
