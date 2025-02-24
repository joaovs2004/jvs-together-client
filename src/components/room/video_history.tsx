import { History } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useWebSocketContext } from "@/websocket-context";
import { useEffect, useState } from "react";

export default function VideoHistory({ room_id }: { room_id: string }) {
  const [videoHistory, setVideoHistory] = useState([]);
  const { sendMessage, lastMessage } = useWebSocketContext();

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "updateHistory") {
        setVideoHistory(jsonMessageData.history);
      }     
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  function getWorkingYoutubeThumbUrl(videoId: string) {
    return `https://vid.puffyan.us/vi/${videoId}/maxresdefault.jpg`;
  }

  function handleOnOldVideoClick(videoUrl: string) {
    sendMessage(JSON.stringify({ type: "setVideo", url: videoUrl, broadcast: true, roomId: room_id }));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="text-black px-1 hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-100"
        >
          <History />
        </Button>
      </SheetTrigger>
      <SheetContent className="dark text-white w-[600px] sm:w-[540px]">
        <SheetHeader className="dark text-white">
          <SheetTitle>Video History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-6">
          <div className="space-y-4 cursor-pointer" >
            {videoHistory.reverse().map((video, index) => (
              <div 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleOnOldVideoClick(video.url)}
                key={index}
              >
                <div className="flex-shrink-0 relative w-24 h-16 rounded-md overflow-hidden">
                  <img
                    src={getWorkingYoutubeThumbUrl(video.videoId)}
                    alt={`${video.title} thumbnail`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
