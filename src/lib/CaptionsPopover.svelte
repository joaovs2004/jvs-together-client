<script>
    import Popover from 'svelte-easy-popover';
    import { blur } from 'svelte/transition';
    import { Subtitles } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    import { player } from '../stores';

    $: ({captions} = $player || {});

    let referenceElement;

    $: captionsExtended = $captions ? [...$captions, {displayName: "Desativado", languageCode: undefined}] : [];

    function changeCaption(lang) {
        $player.setCaption(lang.languageCode);
    }
</script>

{#if $captions && $captions.length > 0}
    <button bind:this={referenceElement} class="iconButton">
        <Subtitles color="#ffff" size=20 />
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
            {#each captionsExtended as caption}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="rates" on:click={e => changeCaption(caption)}>{caption.displayName}</div>
            {/each}
        </div>
    </Popover>
{/if}

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