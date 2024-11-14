import { get as getStoreValue } from "svelte/store"
import { getWritableValue } from "./helpers";
import { player, playerComponent, roomId, connectedClients, videoProps, playbackrate, history, waitingVideoSet, playing, currentRewindStage, RewindStage } from "./stores";
import YoutubePlayer from './lib/players/YoutubePlayer.svelte';
import DashPlayer from './lib/players/DASHPlayer.svelte';

export const ws = new WebSocket(import.meta.env.VITE_WS_URL);

let ytPlayer;
player.subscribe(value => ytPlayer = value);

ws.addEventListener("open", async () => {
    ws.send(JSON.stringify({ type: "sendToRoom", roomId: getWritableValue(roomId) }));
});

ws.addEventListener("message", async (msg) => {
    const message = JSON.parse(await msg.data);

    if(message.type == "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
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
        playing.set(message.status);
        message.status ? ytPlayer.play() : ytPlayer.pause();
    } else if(message.type == "setPlaybackRate") {
        ytPlayer.setPlaybackRate(message.rate);
        playbackrate.set(String(message.rate));
    } else if(message.type == "updateHistory") {
        history.set(message.history);
    } else if(message.type == "unlockSetVideo") {
        waitingVideoSet.set(false);
    } else if (message.type == "rewind") {
		const rewindSeconds = message.seconds;
		const shouldAnnounce = message.shouldAnnounce;
		const videoDuration = getStoreValue(ytPlayer.durationTime)
		const currentTime = getStoreValue(ytPlayer.currentTime)
		const seekTarget = Math.max(0, (currentTime - rewindSeconds) / videoDuration)

		const doRewind = function() {
			currentRewindStage.set(RewindStage.REWINDING)
			ytPlayer.seek(seekTarget)

			if (!getStoreValue(playing)) {
				playing.set(true)
				ytPlayer.play()
			}

			setTimeout(() => {
				currentRewindStage.set(RewindStage.NOT_REWINDING)
			}, rewindSeconds * 1000)
		}

		if (shouldAnnounce) {
			playing.set(false)
			ytPlayer.pause();
			currentRewindStage.set(RewindStage.PAUSED)

			const audio = new Audio("https://audio.jukehost.co.uk/bvdt4TAH0AMN4yftOjySCPZSFe8HkxSe")
			const audio_duration = 6.51 // seconds

			audio.volume = Number(localStorage.getItem("previousVolume")) / 100
			audio.play()

			setTimeout(doRewind, audio_duration * 1000)
		} else {
			doRewind()
		}
	}
});
