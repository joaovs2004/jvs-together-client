<script lang="ts">
    import { convertSeconds } from '../helpers';
    import { currentRewindStage, player, playerComponent, playing, RewindStage, roomId } from '../stores';
    import { ws } from '../webSocket';
    import PlaybackPopover from './PlaybackPopover.svelte';
    import VolumePopover from './VolumePopover.svelte';

    import { Play, Pause, Maximize2 } from "lucide-svelte";
    import CaptionsPopover from './CaptionsPopover.svelte';
    import SeekBar from './SeekBar.svelte';
    import RewindButton from './RewindButton.svelte';
    import RewindSelectionOverlay from './RewindSelectionOverlay.svelte';

    let rangeValue = 0;
    let lastSubscription;

    let playerContainer;

    let isFullScreen = false;

    $: ({ currentTime, durationTime } = $player || {});

    $: $player?.onReady(() => {
        ws.send(JSON.stringify({ type: "setReady", roomId: $roomId }));
    })

    $: rangeValue = $currentTime / $durationTime;

    function seek(e) {
		if ($currentRewindStage !== RewindStage.NOT_REWINDING) return;

        $player.seek(e.detail);
        ws.send(JSON.stringify({ type: "seeked", time: e.detail, roomId: $roomId }));
    }

    function changePlayingState() {
		if ($currentRewindStage !== RewindStage.NOT_REWINDING) return;

        playing.set(!$playing);
        ws.send(JSON.stringify({ type: "setPlaying", status: $playing, roomId: $roomId, broadcast: true }));
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
	<div id="playbackContainer">
		<svelte:component this={$playerComponent} bind:this={$player} />

		<div id="rewindOverlay" class:show={$currentRewindStage === RewindStage.REWINDING}>
			<p>REPLAY IMEDIATO</p>
		</div>
	</div>

	<RewindSelectionOverlay/>

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
				<RewindButton/>
                <CaptionsPopover on:change={e => $player.setOption("captions", "track", {languageCode: e.detail.languageCode})} />
                <PlaybackPopover />
                <VolumePopover />
                <button class="iconButton" on:click={toggleFullscreen}><Maximize2 color="#ffff" size=20 /></button>
            </div>
        </div>
    {/if}
</div>

<style>
	#playbackContainer {
		position: relative;

		& > #rewindOverlay {
			position: absolute;
			display: none;
			align-items: flex-end;
			justify-content: center;
			bottom: 0;
			left: 0;
			width: 100%;
			user-select: none;

			&.show { display: flex; }

			& > p {
				margin: 0;
				color: white;
				font-size: 70pt;
			}
		}
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
