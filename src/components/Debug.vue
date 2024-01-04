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
        <n-button type="warning" @click="router.replace('/chart')">
            Router
        </n-button>
        <n-button type="error">
            Error
        </n-button>
    </n-space>
</template>


<script setup>
import { requestJson, requestText } from "../get_data";
import router from "../router";
import { apiDomain, apiPath } from "../config";

async function request_genshin_data() {
    const queryString = "";
    const url = `${apiDomain}/${apiPath}?${queryString}`;
    requestJson(url).then((data) => {
        console.log(data);
        if (data.retcode != 0) {
            console.log("request_genshin_data fail: " + data.message);
        }else {
            console.log("request_genshin_data success");
        }
    });

    // requestText("https://example.com/").then((data) => {
    //     console.log(data); // JSON data parsed by `data.json()` call
    // });

}




</script>