<template>
    <n-space>
        <n-button>Default</n-button>
        <n-button type="tertiary">
            Load Config
        </n-button>
        <n-button type="primary" @click="getGachaLog({type:1, page: 100})">
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
        <n-button type="error" @click="console.log(sys_config)">
            Show Config
        </n-button>
    </n-space>
</template>


<script setup>
import router from "../router";
import { readLog, getGachaLog } from "../genshin";
import { sys_config } from "../config";

// deprecated!
async function request_genshin_data({ key, page, authKey, retryCount, endId }) {
    const queryString = `authkey=${authKey}&gacha_type=${key}&page=${page}&size=${20}${endId ? '&end_id=' + endId : ''}`;
    const url = `${apiDomain}/${apiPath}?${queryString}`;
    await requestJson(url).then((data) => {
        console.log(data);
        if (data.retcode != 0) {
            console.log("request_genshin_data fail: " + data.message);
        }else {
            console.log("request_genshin_data success");
        }
    });
}




</script>