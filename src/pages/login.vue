<template>
    <n-button type="info" @click="refresh">
        Refresh
    </n-button>

    <p>{{ status }}</p>

    <n-space vertical>
        <n-qr-code :value="qr_text" :size="160" />
        <n-input v-model:value="qr_text" :maxlength="60" type="text" />
    </n-space>
</template>

<script setup>
import { onActivated, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { createQRLogin, queryQRLoginStatus } from "../mihoyo_api"

const qr_text = ref("");
const ticket = ref("");
const status = ref("");
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

    await createQRLogin().then((val) => {
        // console.log(val)
        qr_text.value = val.url;
        ticket.value = val.ticket;
    });
    intervalId.value = setInterval(queryStatus, 1000);
}


/**
 * -3001 请求头缺少参数
-3501 二维码已过期
-3505 用户取消扫码
 */

//
async function queryStatus() {
    const resp = await queryQRLoginStatus(ticket.value);
    const data = resp.data;
    const header = resp.headers;
    const raw_header = resp.rawHeaders;

    const retcode = data.retcode;
    switch (retcode) {
        case 0:
            process_query(data.data, raw_header);
            break;
        case -3001:
            console.log("Lack of request header params");
            clearInterval(intervalId.value);
            break;
        case -3501:
            status.value = "Expired";
            clearInterval(intervalId.value);
            break;
        case -3505:
            status.value = "Canceled";
            clearInterval(intervalId.value);
            break;
        default:
            console.log(`error unknown retcode: ${data.message}`);
    }
}

function process_query(data, raw_header) {
    switch (data.status) {
        case "Created":
            break;
        case "Scanned":
            break;
        case "Confirmed":
            clearInterval(intervalId.value);
            console.log(raw_header)
            break;
        default:
            console.log("got unknown queryQRLoginStatus!");
    }
    status.value = data.status;
    console.log(data)
}

</script>
