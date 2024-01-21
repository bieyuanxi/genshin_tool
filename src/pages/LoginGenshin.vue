<template>
    <n-button type="info" @click="refresh">
        Refresh
    </n-button>

    <n-button type="info" @click="queryStatus">
        query
    </n-button>

    <n-button type="info" @click="genAuthKeyB({ SToken })">
        genAuthKeyB
    </n-button>

    <p>{{ status }}</p>

    <n-space vertical>
        <n-qr-code :value="qr_text" :size="160" />
        <n-input v-model:value="qr_text" :maxlength="60" type="text" />
    </n-space>
</template>

<script setup>
import { onActivated, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { createGenshinQRLogin, queryGenshinQRLoginStatus, getTokenByGameToken, genAuthKeyB } from "../mihoyo_api"

const qr_text = ref("");
const ticket = ref("");
const status = ref("");
const SToken = ref("");
const authkey = ref("");
const intervalId = ref(null);


onMounted(() => {
    refresh();
});

onActivated(() => {

});

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})


async function refresh() {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }

    await createGenshinQRLogin().then((val) => {
        // console.log(val)
        if (val.retcode != 0) {
            // TODO
        }
        qr_text.value = val.data.url;

        const url = new URL(qr_text.value);

        ticket.value = url.searchParams.get("ticket");
    });
    intervalId.value = setInterval(queryStatus, 1000);
}


async function queryStatus() {
    const resp = await queryGenshinQRLoginStatus(ticket.value);
    // console.log(resp)

    const retcode = resp.retcode;
    switch (retcode) {
        case 0:
            await process_query(resp.data);
            break;
        default:
            console.log(`error unknown retcode: ${data.message}`);
    }
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

            let resp = await getTokenByGameToken({ account_id: obj.uid, game_token: obj.token });
            SToken.value = resp.data.token.token;

            resp = await genAuthKeyB({ stoken: SToken.value });
            if (resp.retcode != 0){
                //TODO
            }
            authkey.value = resp.data.authkey;  // Take this to query gacha log
            
            break;
        default:
            console.log("got unknown queryStatus!");
    }


}

</script>
