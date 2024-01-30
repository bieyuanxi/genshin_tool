import { reactive, watch, watchEffect, ref } from 'vue'
import { getDb } from './db';
import { getSToken } from './mihoyo_api';
import { short } from './utils';
import { info } from 'tauri-plugin-log-api';

export const user = reactive({
    game_biz: "hk4e_cn",
    region: "cn_gf01",
    region_name: "天空岛",
    game_uid: "",
    nickname: "Terra",
    level: 60,
    mid: "",
    uid: "",
    game_token: "",
    stoken: "",
    authkeyB: "",

    updateUID(uid, game_token) {
        this.uid = uid;
        this.game_token = game_token;
    },

    updateGameToken(token) {
        this.game_token = token
    },
    updateSToken(token) {
        this.stoken = token
    },
    updateAuthkeyB(authkey) {
        this.authkeyB = authkey
    }
})

watchEffect(async () => {
    let db = await getDb();
    let ret = await db.select("SELECT * FROM users ORDER BY login_time DESC LIMIT 1");
    if( ret.length > 0) {
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
        console.log(msg)
        info(msg)
    }
)

watch(
    () => user.game_token,
    async (newVal, oldVal) => {
        const msg = `game_token: ${short(oldVal)} -> ${short(newVal)}`;
        console.log(msg)
        info(msg)
    }
)

// watch(async () => {
//     let ret = await getSToken(user.uid, user.game_token);
//     console.log(ret)
// })
