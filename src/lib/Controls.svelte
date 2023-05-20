<script lang="ts">
    import { convertSeconds } from '../helpers';
    import { player, playerComponent, roomId } from '../stores';
    import { ws } from '../webSocket';
    import PlaybackPopover from './PlaybackPopover.svelte';
    import VolumePopover from './VolumePopover.svelte';

    import { Play, Pause, Maximize2 } from "lucide-svelte";
    import CaptionsPopover from './CaptionsPopover.svelte';

    let rangeValue = 0;

    let playerContainer;

    let isFullScreen = false;

    $: ({playing, currentTime, durationTime} = $player || {});
    $: playing?.subscribe(value => {
        if(ws.readyState == 1) {
            ws.send(JSON.stringify({ type: "setPlaying", status: value, roomId: $roomId }));
        }
    });
    $: $player?.onReady(() => {
        ws.send(JSON.stringify({ type: "setReady", roomId: $roomId }));
    })

    $: rangeValue = ($currentTime / $durationTime) * 1000;

    function seek(e) {
        $player.seek((e.target.value / 1000));
        ws.send(JSON.stringify({ type: "seeked", time: e.target.value / 1000, roomId: $roomId }));
    }

    function changePlayingState() {
        $playing ? $player.pause() : $player.play();
    }

    function toggleFullscreen() {
        if(!isFullScreen) {
            const screenSize = window.screen;

            $player.resize(screenSize.width, screenSize.height);
            playerContainer.requestFullscreen({navigationUI: "hide"});
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
            <input type="range" min=0 max=1000 step="1" on:change={seek} value={rangeValue}>

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