<template>
    <Container></Container>
</template>
  
<script setup>
import { watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { info } from "tauri-plugin-log-api"

import { getGachaAuthkey, getSToken, getUserGameRoles } from './mihoyo_api';
import { create_table, getDb } from "./db"

import { user } from "./store"
import { short } from './utils';

import Container from "./Container.vue"

const router = useRouter();
const route = useRoute();

watch(() => route.path, async () => {
    console.log(route.path)
})

watchEffect(async () => {
    let db = await getDb();
    let ret = await db.select("SELECT * FROM users ORDER BY login_time DESC LIMIT 1");
    if (ret.length > 0) {
        const row = ret[0];

        user.uid = row.uid;
        user.game_token = row.game_token;
    }

    console.log(user)
})

watch(
    () => user.uid,
    async (newVal, oldVal) => {
        const msg = `user: ${oldVal} -> ${newVal}`;
        console.log(msg); info(msg);
    }
)

watch(
    () => user.game_token,
    async (newVal, oldVal) => {
        const msg = `game_token: ${short(oldVal)} -> ${short(newVal)}`;
        console.log(msg); info(msg);

        const { stoken, mid } = await getSToken(user.uid, user.game_token);
        const roles = await getUserGameRoles(stoken, mid);
        const { game_uid, region, game_biz, region_name, nickname } = roles[0];  //use first TODO
        const authkey = await getGachaAuthkey({ game_uid, region, stoken, mid })

        // FIX ME: ugly code
        user.updateSToken(stoken);
        user.updateAuthkeyB(authkey);
        user.updateGameId(game_uid);
        user.region = region;
        user.mid = mid;
        user.game_biz = game_biz;
        user.region_name = region_name;
        user.nickname = nickname;

        console.log(authkey); info(authkey);
    }
)

/*** before app mount ***/
create_table();
/*** end ***/
</script>

<style scoped></style>