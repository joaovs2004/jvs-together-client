import { Writable, writable } from "svelte/store";
import type { playerProvider } from "./playerProvider";
import type { ComponentType, SvelteComponent } from "svelte";
import YoutubePlayer from './lib/players/YoutubePlayer.svelte';

export const player: Writable<playerProvider> = writable();
export const playerComponent: Writable<ComponentType<SvelteComponent & playerProvider>> = writable(YoutubePlayer);
export const playing: Writable<boolean> = writable(false);
export const roomId = writable();
export const connectedClients = writable();
export const videoProps: any = writable({id: "cJtCyqB2uFg"});
export const playbackrate = writable("1");
export const history = writable([]);
export const waitingVideoSet = writable(false);

export const backgroundImageUrl = writable();