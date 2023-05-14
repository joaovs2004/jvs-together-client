<script>
    import Popover from 'svelte-easy-popover';
    import { blur } from 'svelte/transition';
    import { Volume2 } from 'lucide-svelte';
    import { player } from '../stores';
    import { onMount } from 'svelte';

    let referenceElement;

    let volume = localStorage.getItem("previousVolume");

    onMount(() => {
        $player.onReady(() => {
            $player.setVolume(volume);
        });
    });

    function changeVolume(e) {
        volume = e.target.value;
        $player.setVolume(volume);
        localStorage.setItem("previousVolume", volume);
    }
</script>

<button bind:this={referenceElement} class="iconButton">
    <Volume2 color="#ffff" size=20 />
</button>
<Popover
  triggerEvents={["click"]}
  {referenceElement}
  placement="top"
  spaceAway={5}
  closeOnClickAway={true}
>
    <div
        class="popover-contents"
        transition:blur={{ duration: 250 }}
    >
        <input type="range" min=0 max=100 class="volume" id="volume" on:input={changeVolume} value={volume}>
    </div>
</Popover>

<style>
    .popover-contents {
        background-color: #141414;
        border-radius: 4px;
        padding: .5em;
        height: 150px;
        width: 20px;
    }

    input {
        margin: 0px;
        width: 150px;
        height: 20px;
        transform: rotate(-90deg);
        transform-origin: 75px 75px;
        box-sizing: border-box;
    }
</style>