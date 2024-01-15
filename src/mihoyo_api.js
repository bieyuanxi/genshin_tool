import { fetch, ResponseType, Body } from "@tauri-apps/api/http"
import { gen_qrcode } from "./utils"

export const mysPassportDomain = "https://passport-api.miyoushe.com";

const app_id = "bll8iq97cem8";
const device_id = "flyme2genshin";

export async function createQRLogin() {
    const url = `${mysPassportDomain}/account/ma-cn-passport/web/createQRLogin`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "x-rpc-app_id": app_id,
            "x-rpc-device_id": device_id,
        },
        responseType: ResponseType.JSON
    });

    const qr_url = resp.data.data.url;
    const ticket = resp.data.data.ticket;

    return {
        url: qr_url,
        ticket
    };
}

export async function queryQRLoginStatus(ticket) {
    const url = `${mysPassportDomain}/account/ma-cn-passport/web/queryQRLoginStatus`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "x-rpc-app_id": app_id,
            "x-rpc-device_id": device_id,
        },
        query: {
            ticket: ticket
        },
        responseType: ResponseType.JSON
    });
    // console.log(resp)
    return resp;
}
