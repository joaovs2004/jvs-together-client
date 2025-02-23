import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWebSocketContext } from "@/websocket-context";

export default function VideoChanger({ room_id }: { room_id: string }) {
  const [videoUrl, setVideoUrl] = useState("");
  const { sendMessage } = useWebSocketContext();

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    setVideoUrl(event.target.value);
  };

  function handleLoadVideoClick() {
    sendMessage(JSON.stringify({ type: "setVideo", url: videoUrl, broadcast: true, roomId: room_id }));
    setVideoUrl("");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={(event) => {handleVideoChange(event)}}
        className="flex-1 bg-white border-gray-200 text-black placeholder-gray-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
      />
      <Button
        onClick={handleLoadVideoClick}
        className="bg-white text-black hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 w-full sm:w-auto">
        Load Video
      </Button>
    </div>
  );
};
