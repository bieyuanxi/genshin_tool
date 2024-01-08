import { invoke } from "@tauri-apps/api";
import { fetch, ResponseType } from '@tauri-apps/api/http';

import { apiDomain, apiPath } from "./config";
import { requestJson, requestText } from "./request";

// read genshin log, return authkey
export async function readLog() {
    return "invaild authkey";
}

// get wish log from official web server
export async function getGachaLog({ type = 301, endId = 0 }) {
    let authKey = await getGaChaAuthKey();

    let url = new URL(`${apiDomain}/${apiPath}`);
    url.searchParams.set("authkey_ver", 1);
    url.searchParams.set("authkey", authKey);
    url.searchParams.set("gacha_type", type);
    url.searchParams.set("size", 20);
    url.searchParams.set("end_id", endId);
    url.searchParams.set("lang", "zh-cn");

    // let query = {
    //     authkey_ver: 1,
    //     authkey: encodeURIComponent(authKey),
    //     gacha_type: type,
    //     size: 20,
    //     end_id: endId,
    //     lang: "zh-cn",
    // }

    await requestJson(url).then((data) => {
        console.log(data);
        if (data.retcode != 0) {
            console.log("dbg! request_genshin_data fail: " + data.message);
            if(data.message == "authkey timeout") {
                console.log("authkey timeout, please reopen your wish window!");
            }
        } else {
            console.log("dbg! request_genshin_data success");
        }
    });
}


export async function getGaChaAuthKey() {
    return getAuthKeyFromWebCache("/home/terra/Downloads/data_2");
}

async function getAuthKeyFromWebCache(file_path) {
    let cacheText = await invoke("read_web_cache", {    // read original web cache text
        filePath: file_path
    });
    // console.log(cacheText)
    cacheText = cacheText.toString();
    // console.log(cacheText)
    const urlMatch = cacheText.match(/https.+?auth_appid=webview_gacha.+?authkey=.+?game_biz=hk4e_\w+/g);
    // console.log(urlMatch)
    cacheText = undefined;

    let authkey = null;
    // for (let _url of urlMatch) { // select a url
    //     let url = new URL(_url);
    //     authkey = url.searchParams.get("authkey");
    //     if (authkey) {
    //         // break;
    //         console.log(authkey);
    //     }
    // }
    let url = new URL(urlMatch[urlMatch.length - 1]);
    authkey = url.searchParams.get("authkey");
    // console.log(authkey)
    return authkey;
    // url = new URL(url);

    // url.searchParams.set("gacha_type", 301);
    // url.searchParams.set("size", 20);
    // url.searchParams.set("end_id", 0);

    // const res = await fetch(url + "&gacha_type=301&size=5&end_id=0");
    // console.log(await res.json())
}