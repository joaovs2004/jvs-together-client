import { getWritableValue } from "./helpers";
import { player, clientId, roomId, connectedClients, videoId, playbackrate, history, ignoreNextEvent } from "./stores";

export const ws = new WebSocket(import.meta.env.VITE_WS_URL);

let ytPlayer;
player.subscribe(value => ytPlayer = value);

ws.addEventListener("message", async (msg) => {
    const message = JSON.parse(await msg.data);

    if(message.type == "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
    } else if(message.type == "clientConnected") {
        clientId.set(message.id);
        ws.send(JSON.stringify({ type: "sendToRoom", roomId: getWritableValue(roomId), clientId: getWritableValue(clientId) }))
    } else if(message.type == "connectedClients") {
        connectedClients.set(message.clients);
    } else if(message.type == "setVideo") {
        videoId.set(message.videoId);
    } else if(message.type == "seeked") {
        ytPlayer.seek(message.time);
    } else if(message.type == "setPlaying") {
        ignoreNextEvent.set(true);
        message.status ? ytPlayer.play() : ytPlayer.pause();
    } else if(message.type == "setPlaybackRate") {
        ytPlayer.setPlaybackRate(message.rate);
        playbackrate.set(String(message.rate));
    } else if(message.type == "updateHistory") {
        history.set(message.history);
    }
});
