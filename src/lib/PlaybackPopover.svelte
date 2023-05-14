<script>
    import Popover from 'svelte-easy-popover';
    import { blur } from 'svelte/transition';
    import { ClockIcon } from 'lucide-svelte';
    import { ws } from '../webSocket';
    import { roomId } from '../stores';

    let referenceElement;
    let rates = [0.25, 0.5, 0.75, 1, 1.5, 1.75, 2];

    function changePlaybackRate(e) {
        ws.send(JSON.stringify({ type: "setPlaybackRate", rate: Number(e.target.innerHTML), roomId: $roomId, broadcast: true }));
    }
</script>

<button bind:this={referenceElement} class="iconButton">
    <ClockIcon color="#ffff" size=20 />
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
        {#each rates as rate}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="rates" on:click={changePlaybackRate}>{rate}</div>
        {/each}
    </div>
</Popover>

<style>
    .popover-contents {
        color: #fff;
        background-color: #141414;
        border-radius: 4px;
        padding: 8px;
    }

    .rates {
        padding: 10px 5px;
        text-align: center;
        cursor: pointer;
        opacity: 0.85;
    }

    .rates:hover {
        opacity: 1;
    }
</style>