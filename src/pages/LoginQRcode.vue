<template>
    <n-button type="info" @click="refresh">
        Refresh
    </n-button>

    <n-button type="info" @click="queryStatus">
        query
    </n-button>

    <n-button type="info" @click="getSToken(account_id, game_token)">
        getSToken
    </n-button>

    <n-button type="info" @click="getGachaAuthkey">
        genAuthKeyB
    </n-button>

    <p>{{ qr_status }}</p>

    <n-space vertical>
        <n-qr-code :value="qr_text" :size="160" @click="refresh" />
        <!-- <n-input v-model:value="qr_text" :maxlength="60" type="text" /> -->
        <p>{{ msg }}</p>
    </n-space>
</template>

<script setup>
import { onActivated, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { trace, warn, error, info } from "tauri-plugin-log-api"
import { createGenshinQRLogin, queryGenshinQRLoginStatus, getTokenByGameToken, genAuthKeyB } from "../mihoyo_api"

const qr_text = ref("");
const ticket = ref("");
const qr_status = ref("");

const intervalId = ref(null);
const msg = ref("");

const game_uid = ref("100309696")
const region = ref("cn_gf01")

const account_id = ref("");
const game_token = ref("");

const stoken = ref("");
const mid = ref("");

const authkey = ref("");



onMounted(() => {
    refresh();
});

onActivated(() => {

});

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})

function startQueryStatus() {
    if (!intervalId.value) intervalId.value = setInterval(queryStatus, 1000);
}

function stopQueryStatus() {
    if (intervalId.value) clearInterval(intervalId.value);
}


async function errInternetConnection(reason) {
    msg.value = "Please check your internet connection"
    warn("internet connection failed")
    stopQueryStatus()
}

async function refresh() {
    stopQueryStatus()

    await createGenshinQRLogin().then((resp) => {
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
    }).catch(async (reason) => await errInternetConnection(reason));

}


async function queryStatus() {
    await queryGenshinQRLoginStatus(ticket.value)
        .then(async (resp) => {
            const retcode = resp.retcode;
            switch (retcode) {
                case 0:
                    await process_query(resp.data);
                    break;
                case -106:  //expired code
                    info("queryGenshinQRLoginStatus: expired code")
                    break;
                default:    // api fail
                    error(`queryGenshinQRLoginStatus: unknown retcode ${JSON.stringify(data)}`)
                // console.log(`queryGenshinQRLoginStatus: unknown retcode ${JSON.stringify(data)}`);
            }
            if (0 != retcode) stopQueryStatus()

        }).catch(async (reason) => await errInternetConnection(reason));
}

async function process_query(data) {
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
            account_id.value = obj.uid;
            game_token.value = obj.token;

            break;  //Hey I'm a BREAK! 
        default:
            error(`process_query: unknown stat ${JSON.stringify(data)}`)
    }


}

async function getSToken(account_id, game_token) {
    await getTokenByGameToken({
        account_id,
        game_token
    }).then((resp) => {
        switch (resp.retcode) {
            case 0:
                stoken.value = resp.data.token.token;
                mid.value = resp.data.user_info.mid;
                break;
            default:
                error(`getTokenByGameToken: unknown retcode ${JSON.stringify(resp)}`)
        }
    }).catch(async (reason) => await errInternetConnection(reason));   // get stoken
}

async function getGachaAuthkey() {
    //TODO: remove these code to seperate function
    await genAuthKeyB({
        game_uid: game_uid.value,
        region: region.value,
        stoken: stoken.value,
        mid: mid.value
    }).then((resp) => {
        switch (resp.retcode) {
            case 0:
                authkey.value = resp.data.authkey;  // Take authkeyB to query gacha log
                break;
            default:
                error(`genAuthKeyB: unknown retcode ${JSON.stringify(resp)}`)
        }
    }).catch(async (reason) => await errInternetConnection(reason)); // get authkeyB
}

</script>
