import { invoke } from "@tauri-apps/api";

export async function sleep(ms = 1000) {
    await new Promise(res => setTimeout(res, ms));
}

export async function gen_qrcode(url) {
    return await invoke("gen_qrcode", { url });
}

/**
 * shorten string
 * @param {*} str 
 * @returns 
 */
export function short(str = "") {
    const left = 2;
    const right = 2;
    let ret = "";
    if(str.length <= left + right) {
        ret = str;
    }else {
        ret = `${str.substring(0, left)}***${str.substring(str.length - right, str.length)}`;
    }
    return ret;
}