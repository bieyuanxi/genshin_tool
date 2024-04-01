<template>
    <n-flex>
        <n-button>Default</n-button>
        <n-button type="tertiary">
            Load Config
        </n-button>
        <n-button type="primary" @click="getAuthKeyHKRPG">
            getAuthKeyHKRPG
        </n-button>
        <n-button type="info" @click="create_table">
            create table
        </n-button>
        <n-button type="success" @click="getUserGameRoles">
            getUserGameRolesByStoken
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
import { genAuthKeyB, getUserGameRolesByStoken } from "../mihoyo_api";

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




async function getAuthKeyHKRPG() {
    const stoken = user.stoken;
    const mid = user.mid;
    const region = "prod_gf_cn";
    const game_uid = "100572813";
    const game_biz = "hkrpg_cn";
    // const game_biz = "hk4e_cn";

    await genAuthKeyB({ game_uid, region, stoken, game_uid, mid, game_biz })
}

async function getUserGameRoles() {
    const stoken = user.stoken;
    const mid = user.mid;
    const game_biz = "hkrpg_cn";
    await getUserGameRolesByStoken({stoken, mid, game_biz});
}
</script>