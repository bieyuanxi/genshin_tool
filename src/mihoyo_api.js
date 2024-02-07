import { fetch, ResponseType, Body } from "@tauri-apps/api/http";
import md5 from "md5";
import { gen_qrcode } from "./utils";

export const mysPassportDomain = "https://passport-api.miyoushe.com";

const app_id = "bll8iq97cem8";
const device_id = "flyme2genshin";

//中国版米游社salt
//https://githubfast.com/UIGF-org/mihoyo-api-collect/issues/1
const mys_ver = "2.63.1";
const salt_LK2 = "9ttJY72HxbjwWRNHJvn0n2AYue47nYsK";    //mys v2.63.1
const salt_K2 = "BIPaooxbWZW02fGHZL1If26mYCljPgst";

const x_rpc_client_type = Object.freeze({
    IOS: "1",
    Android: "2",
    Web: "4",
    Other: "5",
});

// unused now
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

// unused now
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

/**
 * Login genshin impact by mys QR code.
 * @returns return url and ticket
 */
export async function createGenshinQRLogin() {
    const url = `https://hk4e-sdk.mihoyo.com/hk4e_cn/combo/panda/qrcode/fetch`;
    const resp = await fetch(url, {
        method: "POST",
        query: {
            app_id: "4",    //4 《原神》
            device: device_id,
        },
        responseType: ResponseType.JSON
    });

    return resp.data;
}

/**
 * Query QR code status
 * @param {*} ticket ticket from createGenshinQRLogin
 * @returns uid(account_id) and token(game_token)
 */
export async function queryGenshinQRLoginStatus(ticket) {
    const url = `https://hk4e-sdk.mihoyo.com/hk4e_cn/combo/panda/qrcode/query`;
    const resp = await fetch(url, {
        method: "POST",
        query: {
            app_id: "4",
            device: device_id,
            ticket: ticket
        },
        responseType: ResponseType.JSON
    });
    console.log(resp);
    return resp.data;
}

/**
 * Get stoken using game token
 * @param {*} param0 
 * @returns stoken and mid(mihoyo_id)
 */
export async function getTokenByGameToken({ account_id, game_token }) {
    const url = `https://api-takumi.mihoyo.com/account/ma-cn-session/app/getTokenByGameToken`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "x-rpc-app_id": app_id,
        },
        query: {
            account_id,
            game_token
        },
        responseType: ResponseType.JSON
    });
    // console.log(resp)
    return resp.data;
}

/**
 * Get authkeyB, which will be used to get gacha data
 * @param {*} param0 
 * @returns authkeyB
 */
export async function genAuthKeyB({ game_uid = "", region = "cn_gf01", stoken = "", mid = "" }) {
    const url = `https://api-takumi.miyoushe.com/binding/api/genAuthKey`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "x-rpc-client_type": x_rpc_client_type.Other,
            "DS": genDS1(salt_LK2),
            "x-rpc-app_version": mys_ver,
            "X-Requested-With": "com.mihoyo.hyperion",

            "Cookie": `stoken=${stoken};mid=${mid}`,
        },
        query: {
            game_biz: "hk4e_cn",
            game_uid,
            region,
            auth_appid: "webview_gacha",
        },
        responseType: ResponseType.JSON
    });
    console.log(resp.data)

    return resp.data;
}

/**
 * Get user game roles using stoken
 * @param {*} param0 
 * @returns All of the roles the account has
 */
export async function getUserGameRolesByStoken({ stoken = "", mid = "" }) {
    const url = `https://api-takumi.miyoushe.com/binding/api/getUserGameRolesByStoken`;
    const resp = await fetch(url, {
        method: "GET",
        headers: {
            "x-rpc-client_type": x_rpc_client_type.Android,
            "DS": genDS1(salt_K2),
            "x-rpc-app_version": mys_ver,
            "X-Requested-With": "com.mihoyo.hyperion",

            "Cookie": `stoken=${stoken};mid=${mid}`,
        },
        query: {
            game_biz: "hk4e_cn",    //genshin
        },
        responseType: ResponseType.JSON
    });
    // console.log(resp.data)

    return resp.data;
}


export async function getSToken(account_id, game_token) {
    const ret = {
        stoken: "",
        mid: "",
    };

    await getTokenByGameToken({
        account_id,
        game_token
    }).then((resp) => {
        const fn = "getTokenByGameToken";
        switch (resp.retcode) {
            case 0:
                ret.stoken = resp.data.token.token;
                ret.mid = resp.data.user_info.mid;

                break;
            default:
                error(`${fn}: ${JSON.stringify(resp)}`)
        }
    });

    return ret;
}

export async function getGachaAuthkey({
    game_uid = "",
    region = "region.value",
    stoken = "",
    mid = ""
}) {
    let authkey = "invaid authkeyB";
    await genAuthKeyB({
        game_uid,
        region,
        stoken,
        mid
    }).then((resp) => {
        const fn = "genAuthKeyB";
        switch (resp.retcode) {
            case 0:
                authkey = resp.data.authkey;  // Take authkeyB to query gacha log
                break;
            default:
                error(`${fn}: ${JSON.stringify(resp)}`)
        }
    });

    return authkey;
}

export async function getUserGameRoles(stoken, mid) {
    let ret = [{
        game_uid: "",
        region: "",
        region_name: "",
        game_biz: "",
        level: "",
        nickname: "",
    }];
    await getUserGameRolesByStoken({
        stoken,
        mid
    }).then((resp) => {
        const role_list = resp.data.list; //a list
        // user_info = info;
        /*
        game_biz: "hk4e_cn"
        game_uid: "***"
        is_chosen: false
        is_official: true
        level: 60
        nickname: "Terra"
        region: "cn_gf01"
        region_name: "天空岛"
        */
        console.log(role_list)
        ret = role_list;

    });

    return ret;
}


function genDS1(salt) {
    const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    const t = Math.floor(Date.now() / 1000)
    let r = ""
    for (let i = 0; i < 6; i++) {
        r += lettersAndNumbers[Math.floor(Math.random() * lettersAndNumbers.length)]
    }

    const main = `salt=${salt}&t=${t}&r=${r}`
    const ds = md5(main)

    const final = `${t},${r},${ds}`

    return final;
}