<script lang="ts">
    import { convertSeconds } from '../helpers';
    import { ignoreNextEvent, player, playerComponent, roomId } from '../stores';
    import { ws } from '../webSocket';
    import PlaybackPopover from './PlaybackPopover.svelte';
    import VolumePopover from './VolumePopover.svelte';

    import { Play, Pause, Maximize2 } from "lucide-svelte";
    import CaptionsPopover from './CaptionsPopover.svelte';
    import SeekBar from './SeekBar.svelte';

    let rangeValue = 0;
    let lastSubscription;

    let playerContainer;

    let isFullScreen = false;

    $: ({playing, currentTime, durationTime} = $player || {});
    player.subscribe(value => {
        if(!value) return;
        if(lastSubscription) lastSubscription();

        lastSubscription = value.playing?.subscribe(value => {
            if(ws.readyState == 1) {
                if($ignoreNextEvent) {
                    ignoreNextEvent.set(false);
                    return;
                }

                ws.send(JSON.stringify({ type: "setPlaying", status: value, roomId: $roomId }));
            }

        });

    });

    $: $player?.onReady(() => {
        ws.send(JSON.stringify({ type: "setReady", roomId: $roomId }));
    })

    $: rangeValue = $currentTime / $durationTime;

    function seek(e) {
        $player.seek(e.detail);
        ws.send(JSON.stringify({ type: "seeked", time: e.detail, roomId: $roomId }));
    }

    function changePlayingState() {
        $playing ? $player.pause() : $player.play();
    }

    async function toggleFullscreen() {
        if(!isFullScreen) {
            const screenSize = window.screen;

            await playerContainer.requestFullscreen({navigationUI: "hide"});
            $player.resize(screenSize.width, screenSize.height);
        } else {
            document.exitFullscreen();
        }
    }

    function onFullscreenChange(e) {
        isFullScreen = !!document.fullscreenElement;

        if(document.fullscreenElement == null) {
            $player.resize(1024, 576);
        }
    }

    function onKeyDown(e) {
        if(document.activeElement.tagName == "INPUT") {
            return;
        }

        if(e.code == "KeyF") {
            toggleFullscreen();
        } else if(e.code == "Space") {
            changePlayingState();
        }
    }
</script>

<svelte:window on:keydown={onKeyDown}/>

<div id="playerContainer" bind:this={playerContainer} on:fullscreenchange={onFullscreenChange}>
    <svelte:component this={$playerComponent} bind:this={$player} />

    {#if $player}
        <div id="controls" class:fullscreen={isFullScreen}>
            <button on:click={changePlayingState} class="iconButton">
                {#if $playing}
                    <Pause color="#ffff" size=20 />
                {:else}
                    <Play  color="#ffff" size=20 />
                {/if}
            </button>

            <span>{convertSeconds($currentTime)}/{convertSeconds($durationTime)}</span>

            <SeekBar value={rangeValue} duration={$durationTime} on:seek={seek}/>

            <div class="right">
                <CaptionsPopover on:change={e => $player.setOption("captions", "track", {languageCode: e.detail.languageCode})} />
                <PlaybackPopover />
                <VolumePopover />
                <button class="iconButton" on:click={toggleFullscreen}><Maximize2 color="#ffff" size=20 /></button>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(#playerContainer > div:nth-child(1))  {
        height: 576px;
    }

    #controls {
        display: flex;
        background-color: #14141491;
        backdrop-filter: blur(10px);
        color: #fff;
        padding: 5px 10px;
        box-sizing: border-box;
    }

    #controls.fullscreen {
        position: absolute;
        bottom: 0;
        margin: 0px;
        width: 100vw;
        opacity: 0;
        transition: opacity 250ms;
    }

    #controls.fullscreen:hover {
        opacity: 1;
    }

    span {
        margin: auto 5px;
    }

    input {
        width: auto;
        height: auto;
        flex-grow: 1;
    }

    .right {
        float: right;
    }
</style>