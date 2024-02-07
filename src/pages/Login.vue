<template>
    <n-flex vertical>
        <p style="text-align: center;">Login</p>
        <n-flex justify="center" size="large">
            <n-flex vertical>
                <UserList :list="list"></UserList>
                <n-button @click="refresh(); login_by_QRCode = true;" v-if="!login_by_QRCode">or login by QRCode</n-button>
            </n-flex>

            <n-flex vertical v-if="login_by_QRCode">
                <n-qr-code :value="qr_text" :size="240" @click="refresh" />
                <p>{{ qr_status }}</p>
                <p>{{ msg }}</p>
            </n-flex>
        </n-flex>
    </n-flex>
</template>

<script setup>
import { onActivated, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { trace, warn, error, info } from "tauri-plugin-log-api"
import Database from "tauri-plugin-sql-api";
import { db_name } from "../config"
import { createGenshinQRLogin, queryGenshinQRLoginStatus, getSToken, getTokenByGameToken, genAuthKeyB, getUserGameRolesByStoken } from "../mihoyo_api"
import { user } from "../store";

import UserList from '../components/UserList.vue';
import { getDb } from "../db"

const router = useRouter();

const list = ref([]);

// const emit = defineEmits(['ok', 'err'])

const login_by_QRCode = ref(false);
const qr_text = ref("");
const ticket = ref("");
const qr_status = ref("");

const intervalId = ref(null);
const msg = ref("");

getDb().then(async (db) => {
    let sql = `SELECT * FROM users ORDER BY login_time DESC`;
    await db.select(sql).then((val) => list.value = val);
})

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})

function startQueryStatus(delay = 1000) {
    stopQueryStatus()
    intervalId.value = setInterval(queryStatus, delay);
}

function stopQueryStatus() {
    if (intervalId.value) clearInterval(intervalId.value);
}


async function err_handle(reason) {
    warn(reason.toString())
    console.log(reason.toString())
    stopQueryStatus()
}

async function refresh() {
    stopQueryStatus()
    msg.value = "";

    await createGenshinQRLogin()
        .then(async (resp) => await handleCreate(resp))
        .catch(async (reason) => await err_handle(reason));

}

async function handleCreate(resp) {
    const retcode = resp.retcode;
    switch (retcode) {
        case 0:
            qr_text.value = resp.data.url;

            const url = new URL(qr_text.value);
            ticket.value = url.searchParams.get("ticket");

            startQueryStatus();  // query QR status
            break;
        default:
            error(`createGenshinQRLogin: unknown retcode ${JSON.stringify(resp)}`)    // create QRcode api fail
            break;
    }
}

async function queryStatus() {
    await queryGenshinQRLoginStatus(ticket.value)
        .then(async (resp) => await handleQuery(resp))
        .catch(async (reason) => await err_handle(reason));
}

async function handleQuery(resp) {
    const fn = "queryGenshinQRLoginStatus";
    const retcode = resp.retcode;
    switch (retcode) {
        case 0:
            await processQuery(resp.data);
            break;
        case -106:  //expired code
            info(`${fn}: expired code`)
            break;
        default:    // api fail
            error(`${fn}: unknown retcode ${JSON.stringify(data)}`)
    }
    if (0 != retcode) stopQueryStatus()
}

async function processQuery(data) {
    qr_status.value = data.stat;   //data has a key named `stat`
    switch (data.stat) {
        case "Init":
            break;
        case "Scanned":
            break;
        case "Confirmed":
            stopQueryStatus();
            // get uid & game_token
            const proto = data.payload.proto;
            const obj = JSON.parse(data.payload.raw);   //{uid, token}
            console.log(obj)
            let uid = "invalid_uid";
            let game_token = "invalid_game_token";

            switch (proto) {
                case "Account": // mys
                    // use mys: { uid, token, }
                    uid = obj.uid;
                    game_token = obj.token;

                    break;
                case "Combo":   // genshin client & genshin cloud
                    // use genshin client: { open_id, open_token, ... }
                    // {
                    //     account_type: 1
                    //     app_id: 4
                    //     asterisk_name: "187******51"
                    //     channel_id: 1
                    //     combo_id: 0
                    //     combo_token: "***"
                    //     device_id: "***"
                    //     guest: false
                    //     heartbeat: false
                    //     open_id: "***"
                    //     open_token: "***"
                    // }
                    uid = obj.open_id;
                    game_token = obj.open_token;

                    break;
                default:
                    error(`unknown proto ${proto}`)
                    throw new Error(`unknown proto ${proto}`)
            }

            // console.log(await getSToken(uid, game_token));
            console.log(await sqlUpdateUser({ uid, game_token }))
            
            user.updateUID(uid, game_token);
            // router.push({ path: `home/${user.account_id}` });

            break;  //Hey I'm a BREAK! 
        default:
            error(`process_query: unknown stat ${JSON.stringify(data)}`)
    }


}

async function sqlUpdateUser({ uid, game_token }) {
    const login_time = (Date.now() / 1000).toFixed();
    const db = await getDb();
    const sql = `REPLACE INTO users(uid, game_token, login_time) VALUES ('${uid}','${game_token}',${login_time})`;
    console.log(sql)
    return await db.execute(sql);
}

</script>
