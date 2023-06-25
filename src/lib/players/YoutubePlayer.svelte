<script lang="ts">
    import YouTube from 'svelte-youtube';
    import { ignoreNextEvent, roomId, videoProps } from '../../stores';
    import { writable } from 'svelte/store';
    import { onDestroy } from 'svelte';

    let player;
    let ready = false;
    let readyFunctions = [];
    let updateInterval;

    export const playing = writable(false);
    export const currentTime = writable(0);
    export const durationTime = writable(0);
    export const captions = writable([]);

    export function onReady(fn: () => void) {
        readyFunctions.push(fn);

        if(ready) {
            fn();
        }
    }

    export function play() {
        player.playVideo();
    }

    export function pause() {
        player.pauseVideo();
    }

    export function setVolume(volume: number) {
        player.setVolume(volume);
    }

    export function seek(percentage: number) {
        player.seekTo(player.playerInfo.duration * percentage);
    }

    export function resize(width: number, height: number) {
        player.setSize(width, height);
    }

    export function setCaption(language: string) {
        player.setOption("captions", "track", {languageCode: language});
    }

    export function setPlaybackRate(rate: number) {
        player.setPlaybackRate(rate);
    }

    function onPlayerReady(event) {
        player = event.detail.target;
        player.loadModule("captions");

        updateInterval = setInterval(() => {
            currentTime.set(player.getCurrentTime());
            durationTime.set(player.playerInfo.duration);

            player.loadModule("captions");
            captions.set(player.getOption("captions", "tracklist"));
        }, 500);
    }

    function stateChange(e) {
        if(e.detail.data == 5) {
            for (const fn of readyFunctions)
                fn();
            // ws.send(JSON.stringify({ type: "setReady", roomId: $roomId }));
        }
    }

    function onPlay() {
        playing.set(true);
    }

    function onPause() {
        playing.set(false);
    }

    onDestroy(() => {
        clearInterval(updateInterval);
    });
</script>

<!-- @ts-expect-error -->
<YouTube
    videoId={$videoProps.id}
    id="player"
    options={{
        width: 1024,
        height: 576,
        playerVars: {
            controls: 0,
            disablekb: 1,
        }
    }}
    on:ready={onPlayerReady}
    on:stateChange={stateChange}
    on:play={onPlay}
    on:pause={onPause}
/>