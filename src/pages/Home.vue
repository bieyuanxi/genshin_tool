<template>
    <n-button type="info" @click="writeUserData">
        writeUserData
    </n-button>

    <n-button type="info" @click="readUserData(`100309696`)">
        readUserData
    </n-button>

    <n-button type="info" @click="getAllGachaLog">
        Update Gacha Data
    </n-button>
    <pre>{{ JSON.stringify(user, null, 4) }}</pre>
</template>




<script setup>
import { BaseDirectory, exists, createDir, writeTextFile, readTextFile } from "@tauri-apps/api/fs"
import Database from "tauri-plugin-sql-api";

import { user } from "../store"
import { requestGachaLog, writeGaChaLog } from "../genshin";
import { db_name } from "../config"
import { sleep } from "../utils";


const props = defineProps({
    id: String,
})

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
async function writeUserData() {
    const path = `userdata/user_${user.game_uid}.json`
    await createDir('userdata', { dir: BaseDirectory.AppData, recursive: true });
    await writeTextFile(path, JSON.stringify(user, null, 4), { dir: BaseDirectory.AppData });
}

async function readUserData(game_uid) {
    let ret = null;
    const path = `userdata/user_${game_uid}.json`
    if (await exists(path, { dir: BaseDirectory.AppData })) {
        ret = JSON.parse(await readTextFile(path, { dir: BaseDirectory.AppData }));
    }

    user.account_id = ret.account_id
    user.game_biz = ret.game_biz
    user.game_uid = ret.game_uid
    user.level = ret.level
    user.mid = ret.mid
    user.nickname = ret.nickname
    user.region = ret.region
    user.region_name = ret.region_name

    user.auth = ret.auth

    console.log(ret)

    return ret;
}

async function getAllGachaLog() {
    const db = await Database.load(db_name);
    const table = "gacha_log"
    let type = "301"

    const sql = `SELECT id FROM ${table} WHERE gacha_type=${type} ORDER BY id desc LIMIT 1`;

    const ret = await db.select(sql).finally(async () => {
        await db.close(db_name);
    });

    let end_id_in_db = (ret.length > 0) ? ret[0].id : 0

    let list = [];
    for (let end_id = "0"; "0" == end_id || (end_id > end_id_in_db); end_id = list[list.length - 1].id) {
        if (end_id != "0") await sleep(1000);

        let resp = await requestGachaLog({
            authKey: user.auth.authkeyB,
            type: type,
            endId: end_id,
        })
        console.log(resp.data)
        list = resp.data.data.list;


        console.log(resp.data.data.list)

        resp = await writeGaChaLog(list);
        if (list.length < 20) {
            break;
        }
    }
}

</script>