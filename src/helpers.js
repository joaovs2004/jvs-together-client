export function convertSeconds(time) {
    if(!time) time = 3600;

    if(time < 3600) {
        return new Date(time * 1000).toISOString().substring(14, 19);
    } else {
        return new Date(time * 1000).toISOString().substring(11, 19);
    }
}

export function getWritableValue(writable) {
    let writableValue;
    writable.subscribe(value => writableValue = value);

    return writableValue;
}

export async function getWorkingYoutubeThumbUrl(videoId) {
    return `https://vid.puffyan.us/vi/${videoId}/maxresdefault.jpg`;
}