<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Shaka from "shaka-player";
    import { generate_dash_file_from_formats } from "../../dashHelpers";
    import { videoProps } from "../../stores";

    let videoElement: HTMLVideoElement;
    let player;
    let ready = false;
    let readyFunctions = [];
    let customWidth, customHeight = 0;

    export const playing = writable(false);
    export const currentTime = writable(0);
    export const durationTime = writable(0);
    export const captions = writable([]);

    $: $videoProps, loadVideo();

    export function onReady(fn: () => void) {
        readyFunctions.push(fn);

        if(ready) {
            fn();
        }
    }

    export function play() {
        videoElement.play();
    }

    export function pause() {
        videoElement.pause();
    }

    export function seek(percentage: number) {
        videoElement.currentTime = videoElement.duration * percentage;
    }

    export function setVolume(volume: number) {
        videoElement.volume = volume / 100;
    }

    export function resize(width: number, height: number) {
        customWidth = width;
        customHeight = height;
    }

    export function setCaption(language: string) {}

    async function loadVideo () {
        if (!videoElement) return;

        Shaka.polyfill.installAll();

        player = new Shaka.Player(videoElement);

        player.addEventListener("error", e => console.error('Error code', e.detail.code, 'object', e.detail));
        videoElement.addEventListener("play", () => playing.set(true));
        videoElement.addEventListener("pause", () => playing.set(false));
        videoElement.addEventListener("timeupdate", e => currentTime.set(e.target.currentTime));
        videoElement.addEventListener("canplay", e => {
            durationTime.set(e.target.duration);

            for (const fn of readyFunctions)
                fn();
        });

        const xml = generate_dash_file_from_formats($videoProps.tracks, $videoProps.duration);

        await player.load(`data:application/dash+xml;charset=utf-8;base64,${btoa(xml)}`, null, "application/dash+xml");
    }

    onMount(loadVideo);
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    bind:this={videoElement}
    poster={$videoProps.thumbnail}
    style={customWidth ? `width: ${customWidth}px; height: ${customHeight}px` : ""}
></video>

<style>
    video {
        display: block;
        width: 1024px;
        height: 576px;
        background-color: black;
    }
</style>