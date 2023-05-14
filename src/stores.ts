import { Writable, writable } from "svelte/store";
import type { playerProvider } from "./playerProvider";

export const player: Writable<playerProvider> = writable();

export const roomId = writable();
export const clientId = writable();
export const connectedClients = writable();
export const videoId = writable("cJtCyqB2uFg");
export const playbackrate = writable("1");
export const history = writable([]);
export const ignoreNextEvent = writable(false);

export const backgroundImageUrl = writable();