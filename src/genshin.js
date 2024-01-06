import { apiDomain, apiPath } from "./config";
import { requestJson, requestText } from "./request";

// read genshin log, return authkey
export async function readLog() {
    return "invaild authkey";
}

// get wish log from official web server
export async function getGachaLog({type, page, endId}) {
    let authKey;
    await readLog().then((key) => {
        authKey = key;
        console.log(key);
    });

    const queryString = `authkey=${authKey} \
        &gacha_type=${type} \
        &page=${page}   \
        &size=${20} \
        ${endId ? '&end_id=' + endId : ''}`;

    const url = `${apiDomain}/${apiPath}?${queryString}`;

    await requestJson(url).then((data) => {
        console.log(data);
        if (data.retcode != 0) {
            console.log("dbg! request_genshin_data fail: " + data.message);
        }else {
            console.log("dbg! request_genshin_data success");
        }
    });
}

// 
export async function updateAuthkey() {

}
