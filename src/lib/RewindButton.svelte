<script lang="ts">
    import { currentRewindStage, rewindSelectionScreenOpen, RewindStage, roomId } from "../stores";
    import { ws } from "../webSocket";
    import { Rewind } from "lucide-svelte";

	const OPEN_OVERLAY_DELAY = 200;

	let latestMouseDownMs = 0
	let openOverlayTimeout: number | null = null;

	function requestRewind() {
		if ($currentRewindStage !== RewindStage.NOT_REWINDING) return;

		ws.send(JSON.stringify({ type: "rewind", roomId: $roomId, seconds: 15 }))
	}

	function openOverlay() {
		if ($currentRewindStage !== RewindStage.NOT_REWINDING) return;

		$rewindSelectionScreenOpen = true
		openOverlayTimeout = null
	}

	function onMouseDown() {
		latestMouseDownMs = Date.now()

		if (openOverlayTimeout) clearTimeout(openOverlayTimeout)
		openOverlayTimeout = setTimeout(openOverlay, OPEN_OVERLAY_DELAY + 1)
	}

	function onMouseUp() {
		const now = Date.now()

		if ((now -latestMouseDownMs) <= OPEN_OVERLAY_DELAY) {
			clearTimeout(openOverlayTimeout)
			openOverlayTimeout = null

			requestRewind()
		}

		if ($rewindSelectionScreenOpen)
			$rewindSelectionScreenOpen = false
	}
</script>

<button class="iconButton" on:mousedown={onMouseDown} on:mouseup={onMouseUp}><Rewind color="#ffff" size={20} /></button>
