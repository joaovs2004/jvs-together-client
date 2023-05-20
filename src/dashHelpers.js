// Based of https://github.com/TeamPiped/Piped/blob/master/src/utils/DashUtils.js

import { create as createXML } from 'xmlbuilder2';

export function generate_dash_file_from_formats(VideoFormats, VideoLength) {
    const generatedJSON = generate_xmljs_json_from_data_dois(VideoFormats, VideoLength);
    const doc = createXML({ encoding: "utf-8" }, generatedJSON);
    return doc.end();
}

function generate_xmljs_json_from_data_dois(VideoFormatArray, VideoLength) {
    const convertJSON = {
        "MPD": {
            "@xmlns": "urn:mpeg:dash:schema:mpd:2011",
            "@profiles": "urn:mpeg:dash:profile:full:2011",
            "@minBufferTime": "PT1.5S",
            "@type": "static",
            "@mediaPresentationDuration": `PT${VideoLength}S`,

            "Period": {
                "AdaptationSet": [...generate_adaptation_set_dois(VideoFormatArray)]
            }
        },
    };
    return convertJSON;
}

function generate_adaptation_set_dois(VideoFormatArray) {
    const adaptationSets = [];

    let mimeAudioObjs = [];

    VideoFormatArray.forEach(videoFormat => {
        // the dual formats should not be used
        if (
            (videoFormat.mimeType.includes("video") && !videoFormat.videoOnly) ||
            videoFormat.mimeType.includes("application")
        ) {
            return;
        }

        const audioTrackId = videoFormat.audioTrackId;
        const mimeType = videoFormat.mimeType;

        for (let i = 0; i < mimeAudioObjs.length; i++) {
            const mimeAudioObj = mimeAudioObjs[i];

            if (mimeAudioObj.audioTrackId == audioTrackId && mimeAudioObj.mimeType == mimeType) {
                mimeAudioObj.videoFormats.push(videoFormat);
                return;
            }
        }

        mimeAudioObjs.push({
            audioTrackId,
            mimeType,
            videoFormats: [videoFormat],
        });
    });

    mimeAudioObjs.forEach(mimeAudioObj => {
        let isVideoFormat = false;
        let scanType = null;

        if (mimeAudioObj.mimeType.includes("video")) {
            isVideoFormat = true;
        }

        if (isVideoFormat) {
            scanType = "progressive";
        }

        const representations = [];

        for (var i = 0; i < mimeAudioObj.videoFormats.length; i++) {
            const videoFormat = mimeAudioObj.videoFormats[i];
            if (isVideoFormat) {
                representations.push(generate_representation_video_dois(videoFormat));
            } else {
                representations.push(generate_representation_audio_dois(videoFormat));
            }
        }

        adaptationSets.push({
            "@id": mimeAudioObj.audioTrackId,
            "@lang": mimeAudioObj.audioTrackId?.substr(0, 2),
            "@mimeType": mimeAudioObj.mimeType,
            "@startWithSAP": "1",
            "@subsegmentAlignment": "true",
            "@scanType": scanType,

            "Representation": [...representations]
        });
    });
    return adaptationSets;
}

function generate_representation_audio_dois(Format) {
    const representation = {
        "@id": Format.itag,
        "@codecs": Format.codec,
        "@bandwidth": Format.bitrate,

        "AudioChannelConfiguration": {
            "@schemeIdUri": "urn:mpeg:dash:23003:3:audio_channel_configuration:2011",
            "@value": "2",
        },

        "BaseURL": {
            "#": Format.url,
        },

        "SegmentBase": {
            "@indexRange": `${Format.indexStart}-${Format.indexEnd}`,
            "Initialization": {
                "@range": `${Format.initStart}-${Format.initEnd}`,
            }
        },
    };
    return representation;
}

function generate_representation_video_dois(Format) {
    const representation = {
        "@id": Format.itag,
        "@codecs": Format.codec,
        "@bandwidth": Format.bitrate,
        "@width": Format.width,
        "@height": Format.height,
        "@maxPlayoutRate": "1",
        "@frameRate": Format.fps,

        "BaseURL": {
            "#": Format.url,
        },

        "SegmentBase": {
            "@indexRange": `${Format.indexStart}-${Format.indexEnd}`,
            "Initialization": {
                "@range": `${Format.initStart}-${Format.initEnd}`,
            },
        },
    };
    return representation;
}