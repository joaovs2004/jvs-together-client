<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { convertSeconds } from "../helpers";

    export let value: number;
    export let duration: number;

    let self: HTMLDivElement;
    let selfMargin = 0;
    let mouseRelX: number = null;
    let enterDraggingModeTimeout = null;
    let draggingMode = false;

    let dispatch = createEventDispatcher();

    $: finalRelX = `${(draggingMode ? mouseRelX : value) * 100}%`;

    function onMouseMove(e: MouseEvent) {
        let x = e.offsetX;
        let width = (e.target as HTMLElement).clientWidth;

        // Check if we're inside the bar (taking padding into consideration)
        if (x >= selfMargin && x <= (width - selfMargin)) {
            let relX = calculateRelativeWidth(x, width);

            mouseRelX = relX;
        } else {
            mouseRelX = null;
        }
    }

    function onMouseLeave(e: MouseEvent) {
        mouseRelX = null;
    }

    function onMouseDown(e: MouseEvent) {
        // Left button
        if (e.button === 0) {
            enterDraggingModeTimeout = setTimeout(function() { draggingMode = true; }, 50);
        }
    }

    function onClick(e: MouseEvent) {
        let x = e.offsetX;
        let width = (e.target as HTMLElement).clientWidth;
        let relX = calculateRelativeWidth(x, width);

        dispatch("seek", relX);
        disableDraggingMode();
    }

    function calculateRelativeWidth(xpos: number, containerWidth: number) {
        return (xpos - selfMargin) / (containerWidth - selfMargin * 2);
    }

    function disableDraggingMode() {
        if (enterDraggingModeTimeout) {
            clearTimeout(enterDraggingModeTimeout);
            enterDraggingModeTimeout = null;
        }

        draggingMode = false;
    }

    onMount(() => {
        selfMargin = parseFloat(getComputedStyle(self).getPropertyValue("padding-left"));
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div
    id="seekbar-container"
    bind:this={self}
    on:mousemove|self={onMouseMove}
    on:mouseleave={onMouseLeave}
    on:mousedown={onMouseDown}
    on:click|self={onClick}
>
    <div class="bar" >
        <div class="trail" style:width={finalRelX}></div>
        <div class="dot" style:left={finalRelX} style:opacity={mouseRelX ? 1 : 0} ></div>

        {#if mouseRelX}
            <div class="tooltip" style:left={`${mouseRelX * 100}%`}>
                {convertSeconds(mouseRelX * duration)}
            </div>
        {/if}
    </div>
</div>

<style>
    #seekbar-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;

        & .bar {
            --bar-height: 4px;
            --bar-border-radius: 10px;

            position: relative;
            width: 100%;
            height: var(--bar-height);
            border-radius: var(--bar-border-radius);
            background-color: grey;
            pointer-events: none;

            & .trail {
                position: absolute;
                height: 100%;
                border-radius: var(--bar-border-radius);
                background-color: #1e87f0;
            }

            & .dot {
                --dot-size: 12px;

                position: absolute;
                width: var(--dot-size);
                height: var(--dot-size);
                top: calc((var(--dot-size) / 2 * -1) + (var(--bar-height) / 2));
                border-radius: 60%;
                background-color: #1e87f0;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 250ms ease-in-out;
            }

            & .tooltip {
                position: absolute;
                top: calc(-2rem - 10px);
                padding: 5px;
                border-radius: 10px;
                transform: translateX(-50%);
                width: contents;

                background: #1e87f0;
                text-shadow: 0 0 4px rgba(0,0,0,.75)
            }
        }
    }
</style>