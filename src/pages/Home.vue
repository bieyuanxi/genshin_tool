<template>
    <n-button type="info" @click="getAllGachaLog">
        Update Gacha Data
    </n-button>
    <pre>{{ JSON.stringify(user, replacer, 4) }}</pre>
</template>




<script setup>
import { computed } from "vue";
import { info, warn } from "tauri-plugin-log-api";
import { user } from "../store"
import { requestGachaLog } from "../genshin";
import { gacha_type, getUserGameRolesByStoken, getGachaAuthkey } from "../mihoyo_api";
import { sleep, short } from "../utils";
import { getDb, val2sql, key2sql } from "../db";


const props = defineProps({
    id: String,
})

const replacer = (key, val) => {
    if (key == 'game_token' || key == 'stoken' || key == 'authkeyB') {
        return short(val)
    }
    return val
}

console.log(`id: ${props.id}`)

/*
identifier=org.flyme2genshin.dev    //see tauri.conf.json: tauri.bundle.identifier
on Linux:
    App: ~/.config/{identifier}/
    AppCache: ~/.cache/{identifier}/
    AppConfig: ~/.config/{identifier}/
    AppData: ~/.local/share/{identifier}/
    AppLocalData: ~/.local/share/{identifier}/
    AppLog: ~/.cache/{identifier}/logs/
    Audio: ~/Music/
    Cache: ~/.cache/
    Config: ~/.config/
    Data: ~/.local/share/
    LocalData: ~/.local/share/
    Log: ~/.cache/{identifier}/logs/
    Resource: ./        //path of executable file
    Executable: ~/.local/bin/
On Windows:
    TODO
*/

async function getAllGachaLog() {
    const stoken = user.stoken;
    const mid = user.mid;
    const resp = await getUserGameRolesByStoken({ stoken, mid });
    switch (resp.retcode) {
        case 0:
            const roles = resp.data.list;
            const { game_uid, region, game_biz, region_name, nickname } = roles[0];  //use first TODO
            // FIX ME: nasty code
            user.game_biz = game_biz;
            user.game_uid = game_uid;
            user.nickname = nickname;
            user.region = region;
            user.region_name = region_name;

            const authkey = await getGachaAuthkey({ game_uid, region, stoken, mid })
            user.updateAuthkeyB(authkey);

            for (const [index, type] of gacha_type.entries()) {
                if (index > 0) await sleep(200);
                await getGachaLog(user.authkeyB, type);
            }
            break;
        case -100:  // stoken expired
            console.log(resp);  warn(JSON.stringify(resp)); //TODO: generate stoken using game_token
            break;
        default:    // other error
            console.log(resp); warn(JSON.stringify(resp));
            break;
    }
}

async function getGachaLog(authKey = "invalid_authkey", type = "301") {
    const size = 20;
    let rowsInsert = 0;

    for (let check = true, endId = "0"; check;) {
        const ret = await requestGachaLog({ authKey, type, endId, size });
        const resp = ret.data;

        if (0 == resp.retcode) {
            const list = resp.data.list;
            // console.log(resp.data)
            if (list.length > 0) {
                endId = list[list.length - 1].id;
                const result = await merge(list);
                rowsInsert += result.rowsAffected;
                check = !(result.rowsAffected < size);
            } else {  // no data found from server
                check = false;  //break
            }
        } else {    // api retcode error
            console.log(resp); warn(resp.message);
            break;
        }

        if (check) await sleep(200);
    }
    const msg = `in getGachaLog, type=${type}, total rows affected: ${rowsInsert}`
    console.log(msg); info(msg);
}

async function merge(list = []) {
    const db = await getDb();

    //TODO: turn gacha_type=400 to 301
    const keys = key2sql(list);
    const vals = val2sql(list);

    const sql = `INSERT OR IGNORE INTO gacha_log ${keys} VALUES ${vals}`;
    // console.log(sql)
    return await db.execute(sql);
}

</script>