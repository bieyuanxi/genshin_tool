import { invoke } from "@tauri-apps/api";

export async function sleep(ms = 1000) {
    await new Promise(res => setTimeout(res, ms));
}

export async function gen_qrcode(url) {
    return await invoke("gen_qrcode", { url });
}