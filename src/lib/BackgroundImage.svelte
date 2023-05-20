<script>
    import { getWorkingYoutubeThumbUrl } from "../helpers";
    import { backgroundImageUrl, videoProps } from "../stores";

    $: isCustomBackground = $backgroundImageUrl != null;
</script>

{#if isCustomBackground}
    <img src={$backgroundImageUrl} alt="Background">
{:else}
    {#await getWorkingYoutubeThumbUrl($videoProps.id) then videoUrl }
        <img src={videoUrl} alt="Background">
    {/await}
{/if}


<!-- <img src="https://w.wallhaven.cc/full/qz/wallhaven-qzdqvr.jpg" alt="Background"> -->

<style>
    img {
        transform: scale(1.2);
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        filter: blur(10px) brightness(0.8);
        object-fit: cover;
    }
</style>