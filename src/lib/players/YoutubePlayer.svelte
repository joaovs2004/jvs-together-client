<script lang="ts">
    import YouTube from 'svelte-youtube';
    import { playing, roomId, videoProps } from '../../stores';
    import { writable } from 'svelte/store';
    import { onDestroy } from 'svelte';

    let player;
    let ready = false;
    let readyFunctions = [];
    let updateInterval;
    let dontIgnoreNextEvent = false;

    let lastPausedTime;

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
        dontIgnoreNextEvent = true;
        player.playVideo();
    }

    export function pause() {
        dontIgnoreNextEvent = true;
        lastPausedTime = player.getCurrentTime();

        player.pauseVideo();
    }

    export function setVolume(volume: number) {
        player.setVolume(volume);
    }

    export function seek(percentage: number) {
        let newTime = player.getDuration() * percentage;
        if($playing) {
            dontIgnoreNextEvent = true
        } else {
            lastPausedTime = newTime;
        }

        player.seekTo(newTime);
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
            durationTime.set(player.getDuration());

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
        if(dontIgnoreNextEvent) {
            dontIgnoreNextEvent = false;
            return
        }

        dontIgnoreNextEvent = true;

        player.pauseVideo();
        setTimeout(() => {
            player.seekTo(lastPausedTime);
        }, 50);
    }

    function onPause() {
        if(dontIgnoreNextEvent) {
            dontIgnoreNextEvent = false;
            return
        }

        dontIgnoreNextEvent = true;

        player.playVideo();
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
