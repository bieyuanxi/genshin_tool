<template>
    <n-flex>
        <n-button>Default</n-button>
        <n-button type="tertiary">
            Load Config
        </n-button>
        <n-button type="primary" @click="getGachaLog({ type: 301, endId: 0 })">
            Request Genshin Data
        </n-button>
        <n-button type="info" @click="create_table">
            create table
        </n-button>
        <n-button type="success" @click="getGaChaAuthKey">
            Read AuthKey
        </n-button>
        <n-button type="warning" @click="router.replace('/chart')">
            Router
        </n-button>
        <n-button type="error" @click="ins">
            ins
        </n-button>
    </n-flex>
    <pre>{{ JSON.stringify(user, replacer, 4) }}</pre>
</template>


<script setup>
import { invoke } from "@tauri-apps/api"
import { NFlex } from "naive-ui"
import Database from "tauri-plugin-sql-api"

import router from "../router";
import { readLog, requestGachaLog, getGaChaAuthKey } from "../genshin";
import { sys_config, db_name } from "../config";
import { insertInto, create_table } from "../db"
import { user } from "../store";
import { short } from "../utils";

/*
        `CREATE TABLE IF NOT EXISTS user(
            account_id  TEXT PRIMARY KEY NOT NULL,
            mid         TEXT    NOT NULL,
            game_biz    TEXT    NOT NULL,
            region      TEXT    NOT NULL,
            region_name TEXT    NOT NULL,
            game_uid    TEXT    NOT NULL,
            nickname    TEXT    NOT NULL,
            level       INT     NOT NULL,
            game_token  TEXT    NOT NULL,
            stoken      TEXT    NOT NULL,
            authkeyB    TEXT    NOT NULL,
            login_time  INT     NOT NULL
        );`
*/
async function ins() {
    const user = {
        account_id: "account_id",
        game_token: "game_token",
        login_time: (Date.now() / 1000).toFixed(),    //seconds
    }
    await insertInto("user", [user]);
}

const replacer = (key, val) => {
    if (key == 'game_token' || key == 'stoken' || key == 'authkeyB') {
        return short(val)
    }
    return val
}
</script>