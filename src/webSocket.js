import { getWritableValue } from "./helpers";
import { player, playerComponent, clientId, roomId, connectedClients, videoProps, playbackrate, history, ignoreNextEvent, waitingVideoSet } from "./stores";
import YoutubePlayer from './lib/players/YoutubePlayer.svelte';
import DashPlayer from './lib/players/DASHPlayer.svelte';

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
        if(!message.isRestrictedVideo) {
            videoProps.set({id: message.videoId});
            playerComponent.set(YoutubePlayer);
        } else {
            videoProps.set({id: message.videoId, tracks: message.tracks, duration: message.duration, thumbnail: message.thumbnail})
            playerComponent.set(DashPlayer);
        }
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
    } else if(message.type == "unlockSetVideo") {
        waitingVideoSet.set(false);
    }
});
