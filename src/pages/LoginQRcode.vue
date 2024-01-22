<template>
    <n-button type="info" @click="refresh">
        Refresh
    </n-button>

    <n-button type="info" @click="queryStatus">
        query
    </n-button>

    <n-button type="info" @click="genAuthKeyB({ stoken })">
        genAuthKeyB
    </n-button>

    <p>{{ status }}</p>

    <n-space vertical>
        <n-qr-code :value="qr_text" :size="160" @click="refresh" />
        <!-- <n-input v-model:value="qr_text" :maxlength="60" type="text" /> -->
        <p>{{ msg }}</p>
    </n-space>
</template>

<script setup>
import { onActivated, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { createGenshinQRLogin, queryGenshinQRLoginStatus, getTokenByGameToken, genAuthKeyB } from "../mihoyo_api"

const qr_text = ref("");
const ticket = ref("");
const status = ref("");
const stoken = ref("");
const mid = ref("");
const authkey = ref("");
const intervalId = ref(null);
const msg = ref("");


onMounted(() => {
    refresh();
});

onActivated(() => {

});

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})


function errInternetConnection(reason) {
    msg.value = "Please check your internet connection"

    console.log(msg.value)

    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
}

async function refresh() {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }

    await createGenshinQRLogin().then((val) => {
        const retcode = val.retcode;
        switch (retcode) {
            case 0:
                qr_text.value = val.data.url;

                const url = new URL(qr_text.value);
                ticket.value = url.searchParams.get("ticket");

                intervalId.value = setInterval(queryStatus, 1000);  // query QR status
                break;
            default:
                console.log(val)    // create QRcode api fail
                break;
        }
    }).catch((reason) => errInternetConnection(reason));

}


async function queryStatus() {
    await queryGenshinQRLoginStatus(ticket.value)
        .then(async (resp) => {
            const retcode = resp.retcode;
            switch (retcode) {
                case 0:
                    await process_query(resp.data);
                    break;
                default:    // api fail
                    console.log(`error unknown retcode: ${data.message}`);
            }
            // console.log(resp)
        }).catch((reason) => errInternetConnection(reason));
}

async function process_query(data) {
    status.value = data.stat;
    switch (data.stat) {
        case "Init":
            break;
        case "Scanned":
            break;
        case "Confirmed":
            clearInterval(intervalId.value);
            const obj = JSON.parse(data.payload.raw);   //{uid, token}

            // got uid & game_token

            //TODO: remove these code to seperate function
            let resp = await getTokenByGameToken({ account_id: obj.uid, game_token: obj.token });   // get stoken
            //TODO: error handle
            stoken.value = resp.data.token.token;
            mid.value = resp.data.user_info.mid;

            resp = await genAuthKeyB({ stoken: stoken.value, mid: mid.value }); // get authkeyB
            if (resp.retcode != 0) {
                //TODO:error handle
            }
            authkey.value = resp.data.authkey;  // Take authkeyB to query gacha log

            break;
        default:
            console.log("got unknown queryStatus!");
    }


}


</script>
