<template>
    <n-space>
        <n-button>Default</n-button>
        <n-button type="tertiary">
            Load Config
        </n-button>
        <n-button type="primary" @click="request_genshin_data">
            Request Genshin Data
        </n-button>
        <n-button type="info">
            Store Data to DB
        </n-button>
        <n-button type="success">
            Read AuthKey
        </n-button>
        <n-button type="warning">
            Warning
        </n-button>
        <n-button type="error">
            Error
        </n-button>
    </n-space>
</template>


<script setup>
import { requestJson, requestText } from "../get_data";

async function request_genshin_data() {

    requestJson("https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog").then((data) => {
        console.log(data);
    });

    // requestText("https://example.com/").then((data) => {
    //     console.log(data); // JSON data parsed by `data.json()` call
    // });

}



</script>