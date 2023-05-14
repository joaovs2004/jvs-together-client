<script>
    import { getWorkingYoutubeThumbUrl } from "../helpers";
import { roomId, videoId, history } from "../stores";
    import { ws } from "../webSocket";
    import { X } from "lucide-svelte";

    export let isOpen = false;

    let completellyHidden = !isOpen;

    $: if(isOpen) completellyHidden = false;

    function close() {
        isOpen = false;

        setTimeout(() => {
            completellyHidden = true;
        }, 500);
    }

    function changeVideo(video) {
        ws.send(JSON.stringify({ type: "setVideo", videoId: video.videoId, broadcast: true, roomId: $roomId }));
        console.log(video.videoId);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="background" class:open={isOpen} class:hidden={completellyHidden} on:click|self={close}>
    <div class="offCanvas">
        <h2>Historico de Videos</h2>
        <button on:click={close}><X size=22 /></button>
        {#each $history.reverse() as video}
            <div class="video" on:click={() => changeVideo(video)}>
                {#await getWorkingYoutubeThumbUrl(video.videoId) then videoUrl }
                    <img src={videoUrl} alt={video.title}>
                {/await}
                <p>{video.title}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .background {
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: transparent;
        z-index: 3;
        transition: background-color 0.5s;
    }

    .background.open {
        display: initial;
        background-color: #00000040;

    }

    .hidden {
        z-index: 0;
    }

    .offCanvas {
        background-color: rgba(27, 27, 27, 0.925);
        position: absolute;
        right: -30%;
        height: 100vh;
        width: 30%;
        transition: 0.5s;
        box-sizing: border-box;
        overflow-y: auto;
        backdrop-filter: blur(10px);
    }

    .background.open .offCanvas {
        right: 0;
    }

    .offCanvas h2 {
        color: #fff;
        text-align: center;
    }

    .video {
        display: flex;
        width: 100%;
        padding: 10px 15px;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
    }

    .video:hover {
        background-color: rgba(5, 5, 5, 0.4);
    }

    .video img {
        height: 80px;
        border-radius: 3px;
    }

    .video p {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
    }

    button {
        position: absolute;
        top: 0;
        right: 0;
        margin: 10px;
        border: none;
        border-radius: 50%;
        display: inline-flex;
        padding: 10px;
        background-color: rgb(39, 39, 39);
        box-sizing: border-box;
        color: #808080;
        transition: color 200ms;
    }
</style>