export function convertSeconds(time) {
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

export async function getWorkingUrl(urls, fallback="https://w.wallhaven.cc/full/qz/wallhaven-qzdqvr.jpg") {
    for(const url of urls) {
        const response = await fetch(`https://api.allorigins.win/info?url=${encodeURIComponent(url)}`);

        if(response.status == 200) {
            const body = await response.json();

            if(body.http_code == 200) {
                return url;
            }
        }
    }

    return fallback;
}

export async function getWorkingYoutubeThumbUrl(videoId) {
    return `https://vid.puffyan.us/vi/${videoId}/maxresdefault.jpg`;
    // return getWorkingUrl([`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`]);
}