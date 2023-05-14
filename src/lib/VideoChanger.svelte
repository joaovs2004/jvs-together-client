<script>
    import { ws } from "../webSocket";
    import { roomId, videoId } from "../stores";

    let inputVideoUrl;

    function setVideoId() {
        if(inputVideoUrl) {
            const videoUrl = new URL(inputVideoUrl);

            if(videoUrl.pathname == "/watch") {
                videoId.set(videoUrl.searchParams.get("v"));
            } else {
                videoId.set(videoUrl.pathname.substring(8));
            }

            ws.send(JSON.stringify({ type: "setVideo", videoId: $videoId, broadcast: true, roomId:$roomId }));

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