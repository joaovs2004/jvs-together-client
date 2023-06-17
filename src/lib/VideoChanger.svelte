<script>
    import { ws } from "../webSocket";
    import { roomId, waitingVideoSet } from "../stores";
    import Spinner from "./Spinner.svelte";

    let inputVideoUrl;

    function setVideoId() {
        if(inputVideoUrl) {
            waitingVideoSet.set(true);
            ws.send(JSON.stringify({ type: "setVideo", url: inputVideoUrl, broadcast: true, roomId:$roomId }));

            inputVideoUrl = "";
        }
    }
</script>

<div class="container">


    <input type="text" placeholder="Url do video" bind:value={inputVideoUrl} disabled={$waitingVideoSet}>
    <button on:click={setVideoId} class="btnPrimary" class:waiting={$waitingVideoSet} disabled={$waitingVideoSet}>
        {#if $waitingVideoSet}
            <div id="loading">
                <Spinner />
            </div>
        {/if}

        Mudar Video
    </button>
</div>



<style>
    #loading {
        display: flex;
        width: 100%;
        height: 100%;
        position: absolute;
        justify-content: center;
        align-items: center;
        left: 0px;
    }

    .container {
        position: relative;
        margin-bottom: 10px;
        display: inline-block;
    }

    input {
        width: 400px;
    }

    button {
        position: relative;
    }

    .waiting, .waiting:hover {
        opacity: 0.5;
        color: transparent;
        pointer-events: none;
        user-select: none;
    }
</style>