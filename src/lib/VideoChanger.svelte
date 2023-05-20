<script>
    import { ws } from "../webSocket";
    import { roomId } from "../stores";

    let inputVideoUrl;

    function setVideoId() {
        if(inputVideoUrl) {
            ws.send(JSON.stringify({ type: "setVideo", url: inputVideoUrl, broadcast: true, roomId:$roomId }));

            inputVideoUrl = "";
        }
    }
</script>

<div>
    <input type="text" placeholder="Url do video" bind:value={inputVideoUrl}>
    <button on:click={setVideoId} class="btnPrimary">Mudar Video</button>
</div>

<style>
    div {
        margin-bottom: 10px;
        display: inline-block;
    }

    input {
        width: 400px;
    }
</style>