<template>
    <router-view />
</template>
  
<script setup>
import { onErrorCaptured, watch, watchEffect } from "vue";
import { useNotification } from "naive-ui"
import { info } from "tauri-plugin-log-api"

import { getGachaAuthkey, getSToken, getUserGameRoles, getUserGameRolesByStoken } from './mihoyo_api';
import { getDb, val2sql, key2sql, obj2sql } from "./db"

import { user } from "./store"
import { short } from './utils';

// watchEffect(async () => {
//     const msg = `user: ${user.uid}`;
//     console.log(msg); info(msg);
// })
const notifyDuration = 2500;
const notification = useNotification();

onErrorCaptured((e, instance, info) => {
    if (e.toString().startsWith("Network Error")) { // e is string from tauri side, so nasty code is used
        notification.warning({
            title: "Network Error",
            content: "Please check your internet connection.",
            meta: info,
            duration: notifyDuration,
            keepAliveOnHover: true
        });
        return false;
    }

    console.log(e)
})

watch(
    () => user.game_token,
    async (newVal, oldVal) => {
        const msg = `user: ${user.uid}, game_token: ${short(user.game_token)}`;
        console.log(msg); info(msg);
        const { stoken, mid } = await getSToken(user.uid, user.game_token);
        user.stoken = stoken;
        user.mid = mid;
        await sqlUpdateUser({ uid: user.uid, game_token: user.game_token, stoken, mid });

        const resp = await getUserGameRolesByStoken({ stoken, mid })
        const list = resp.data.list;
        await sqlUpdateGameRole(list, user.uid);
    }
)

async function sqlUpdateUser({ uid, game_token, stoken, mid }) {
    const login_time = (Date.now() / 1000).toFixed();
    const db = await getDb();
    const keys = `uid, game_token, stoken, mid, login_time`;
    const vals = `'${uid}','${game_token}','${stoken}','${mid}',${login_time}`
    const sql = `REPLACE INTO users (${keys}) VALUES (${vals})`;

    return await db.execute(sql);
}

async function sqlUpdateGameRole(list, uid) {
    const time = (Date.now() / 1000).toFixed();
    const db = await getDb();
    for (const obj of list) {
        obj.uid = uid; // add uid
        const { keys, vals } = obj2sql(obj);
        const sql = `REPLACE INTO game_roles (${keys}) VALUES (${vals})`;
        await db.execute(sql);
    }
}

// watch(
//     () => user.game_token,
//     async (newVal, oldVal) => {
//         const msg = `game_token: ${short(oldVal)} -> ${short(newVal)}`;
//         console.log(msg); info(msg);

//         const { stoken, mid } = await getSToken(user.uid, user.game_token);
//         const roles = await getUserGameRoles(stoken, mid);
//         const { game_uid, region, game_biz, region_name, nickname } = roles[0];  //use first TODO
//         const authkey = await getGachaAuthkey({ game_uid, region, stoken, mid })

//         // FIX ME: ugly code
//         user.updateSToken(stoken);
//         user.updateAuthkeyB(authkey);
//         user.updateGameId(game_uid);
//         user.region = region;
//         user.mid = mid;
//         user.game_biz = game_biz;
//         user.region_name = region_name;
//         user.nickname = nickname;

//         console.log(authkey); info(authkey);
//     }
// )
</script>

<style scoped></style>