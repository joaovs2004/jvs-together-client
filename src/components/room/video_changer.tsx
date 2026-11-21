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

  function handleLoadVideoClick(event?: React.FormEvent) {
    event?.preventDefault();
    if (!videoUrl.trim()) return;
    sendMessage(JSON.stringify({ type: "setVideo", url: videoUrl, broadcast: true, roomId: room_id }));
    setVideoUrl("");
  }

  return (
    <form className="room-video-form" onSubmit={handleLoadVideoClick}>
      <Input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={(event) => {handleVideoChange(event)}}
        className="room-video-input"
      />
      <Button
        type="submit"
        className="room-video-submit">
        Load
      </Button>
    </form>
  );
};
