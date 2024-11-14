<script lang="ts">
	import { rewindSelectionScreenOpen, roomId } from "../stores"
    import { ws } from "../webSocket";

	const OPTIONS = [5, 10, 15, 30];
	let selectedSeconds = 0;

	function performRewind(seconds: number) {
		ws.send(JSON.stringify({ type: "rewind", roomId: $roomId, seconds: seconds }))
	}

	function onMouseUp() {
		$rewindSelectionScreenOpen = false
		performRewind(selectedSeconds)
	}
</script>

<div id="rewindSelectionOverlay" on:mouseup={onMouseUp} class:visible={$rewindSelectionScreenOpen}>
	{#each OPTIONS as seconds}
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button on:mouseover={() => selectedSeconds = seconds}>{seconds}s</button>
	{/each}
</div>

<style>
	#rewindSelectionOverlay {
		position: absolute;
		display: none;
		grid-auto-flow: column;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 5;
		background: rgba(0,0,0,0.5);
		backdrop-filter: blur(10px);
		opacity: 0;
		transition: opacity 250ms;

		&.visible {
			display: grid;
			opacity: 1;
		}

		& > button {
			background: transparent;
			color: white;
			border-color: transparent;
			transition: border-color 250ms;
			font-size: 2rem;
			text-transform: none;

			&:hover {
				border-color: #1e87f0
			}
		}
	}
</style>
