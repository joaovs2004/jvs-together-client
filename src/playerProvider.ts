import { Writable } from "svelte/store";

export interface playerProvider {
    onReady(fn: () => void);
    play();
    pause();
    seek(percentage: number);
    setVolume(volume: number);
    resize(width: number, height: number);
    setCaption(language: string);
    setPlaybackRate(rate: number);

    currentTime: Writable<number>;
    durationTime: Writable<number>;
    captions: Writable<Array<any>>;
}