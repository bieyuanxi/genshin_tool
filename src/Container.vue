<template>
    <router-view></router-view>
</template>
  
<script setup>
import { watch, watchEffect } from "vue";
import { info } from "tauri-plugin-log-api"

import { getGachaAuthkey, getSToken, getUserGameRoles } from './mihoyo_api';
import { getDb } from "./db"

import { user } from "./store"
import { short } from './utils';

// watchEffect(async () => {
//     const msg = `user: ${user.uid}`;
//     console.log(msg); info(msg);
// })

watch(
    () => user.game_token,
    async (newVal, oldVal) => {
        const msg = `user: ${user.uid}, game_token: ${short(user.game_token)}`;
        console.log(msg);   info(msg);
        await sqlUpdateUser({ uid: user.uid, game_token: user.game_token });
    }
)

async function sqlUpdateUser({ uid, game_token }) {
    const login_time = (Date.now() / 1000).toFixed();
    const db = await getDb();
    const sql = `REPLACE INTO users(uid, game_token, login_time) VALUES ('${uid}','${game_token}',${login_time})`;

    return await db.execute(sql);
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