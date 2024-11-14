<script>
    import { useParams } from "svelte-navigator";
    import { roomId } from "../stores";

    import VideoChanger from "../lib/VideoChanger.svelte";
    import Youtube from "../lib/Controls.svelte";
    import NameModal from "../lib/NameModal.svelte";
    import Clients from "../lib/Clients.svelte";
    import BackgroundModal from "../lib/BackgroundModal.svelte";
    import BackgroundImage from "../lib/BackgroundImage.svelte";
    import { User, Image, History } from "lucide-svelte";
    import OffCanvas from "../lib/OffCanvas.svelte";
    import RewindSelectionOverlay from "../lib/RewindSelectionOverlay.svelte";

    let showNameModal = true;
    let showBackgroundModal = false;

    let isOffCanvasOpen = false;

    const params = useParams();
    roomId.set($params.roomId);
</script>

<BackgroundImage />

<OffCanvas bind:isOpen={isOffCanvasOpen} />

<div>
    <div id="actions">
        <button on:click={() => showNameModal = true} title="Trocar nome de usuario"><User size=22 /></button>
        <button on:click={() => showBackgroundModal = true} title="Trocar imagem de fundo"><Image size=22 /></button>
        <button on:click={() => isOffCanvasOpen = true} title="Ver historico de videos"><History size=22 /></button>
    </div>

	<RewindSelectionOverlay/>
    <VideoChanger />
    <Youtube />

    <NameModal bind:showModal={showNameModal} />
    <BackgroundModal bind:showModal={showBackgroundModal} />

    <Clients />
</div>

<style>
    :global(body) {
        margin: 0px;
        overflow: hidden;
        font-family: ProximaNova,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    }

    div {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        right: 0%;
        transition: right 0.5s;
    }

    #actions {
        position: absolute;
        right: 0;
        top: 0;
        width: auto;
        height: auto;
        margin: 10px;
        display: inline-block;
    }

    #actions button {
        border: none;
        border-radius: 50%;
        display: inline-flex;
        padding: 10px;
        background-color: rgb(39, 39, 39);
        box-sizing: border-box;
        color: #808080;
        transition: color 200ms;
    }

    #actions button:hover {
        color: #fff;
    }
</style>
