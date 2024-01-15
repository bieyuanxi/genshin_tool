<template>
    <n-button type="info" @click="queryStatus">
        query QR Login Status
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
    intervalId.value = setInterval(queryStatus, 1000);
});

onActivated(() => {
    
});

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})


async function refresh() {
    await createQRLogin().then((val) => {
        // console.log(val)
        qr_text.value = val.url;
        ticket.value = val.ticket;
    });
}

async function queryStatus() {
    const resp = await queryQRLoginStatus(ticket.value);
    switch (resp.data.data.status) {
        case "Created":
            break;
        case "Scanned":
            break;
        case "Confirmed":
            clearInterval(intervalId.value);
            break;
        default:
            console.log("got unknown queryQRLoginStatus!");
    }
    status.value = resp.data.data.status;
    console.log(resp)
}

</script>
