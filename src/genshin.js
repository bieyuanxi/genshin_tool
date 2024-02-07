import { invoke } from "@tauri-apps/api";
import { fetch, ResponseType } from '@tauri-apps/api/http';

import { apiDomain, apiPath } from "./config";
import { getJson, getText } from "./request";
import { insertInto } from "./db";

// read genshin log, return authkey
export async function readLog() {
    return "invaild authkey";
}

// get wish log from official web server
export async function requestGachaLog({authKey, type = 301, endId = 0, size = 20}) {
    // let authKey = await getGaChaAuthKey();

    let url = new URL(`${apiDomain}/${apiPath}`);
    url.searchParams.set("authkey_ver", 1);
    url.searchParams.set("authkey", authKey);
    url.searchParams.set("gacha_type", type);
    url.searchParams.set("size", size);
    url.searchParams.set("end_id", endId);
    url.searchParams.set("lang", "zh-cn");
    // console.log(url.search)
    // let query = {
    //     authkey_ver: 1,
    //     authkey: encodeURIComponent(authKey),
    //     gacha_type: type,
    //     size: 20,
    //     end_id: endId,
    //     lang: "zh-cn",
    // }
    const response = await getJson(url);

    return response;
}


export async function getGaChaAuthKey() {
    let path = import.meta.env.VITE_WEB_CACHE_FILE;

    if(!path) path = "";
    return await getAuthKeyFromWebCache(path);
}

async function getAuthKeyFromWebCache(file_path) {
    let cacheText = await invoke("read_web_cache", {    // read original web cache text
        filePath: file_path
    });
    // console.log(cacheText)
    cacheText = cacheText.toString();
    // console.log(cacheText)
    const urlMatch = cacheText.match(/https.+?auth_appid=webview_gacha.+?authkey=.+?game_biz=hk4e_\w+/g);
    console.log(urlMatch)
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
    let url = new URL(urlMatch[urlMatch.length - 1]);   // select latest authkey
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

// deprecated
export async function writeGaChaLog(data = []) {
    const table = "gacha_log";

    return await insertInto(table, data);;
}