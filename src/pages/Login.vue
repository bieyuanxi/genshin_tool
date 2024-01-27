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
import { trace, warn, error, info } from "tauri-plugin-log-api"
import { createGenshinQRLogin, queryGenshinQRLoginStatus, getTokenByGameToken, genAuthKeyB, getUserGameRolesByStoken } from "../mihoyo_api"
import { user } from "../store";

import UserList from '../components/UserList.vue';
import { queryUserInfo, insertInto } from "../db"

const list = ref([]);

// const emit = defineEmits(['ok', 'err'])

const login_by_QRCode = ref(false);
const qr_text = ref("");
const ticket = ref("");
const qr_status = ref("");

const intervalId = ref(null);
const msg = ref("");


onMounted(() => {
    queryUserInfo() //once mounted, query user login info
        .then((val) => list.value = val);
});

onActivated(() => {

});

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
        .then(async (resp) => await hanleQuery(resp))
        .catch(async (reason) => await err_handle(reason));
}

async function hanleQuery(resp) {
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
            const obj = JSON.parse(data.payload.raw);   //{uid, token}

            // emit("ok", { account_id: obj.uid, game_token: obj.token });

            const user = {
                account_id: obj.uid,
                game_token: obj.token,
                login_time: (Date.now() / 1000).toFixed(),    //seconds
            }
            console.log(user)
            //TODO: if user exists, just update game_token & login_time
            await insertInto("user", [user]);

            break;  //Hey I'm a BREAK! 
        default:
            error(`process_query: unknown stat ${JSON.stringify(data)}`)
    }


}


</script>
