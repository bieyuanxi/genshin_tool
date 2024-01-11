<template>
    <n-flex>
        <n-drawer v-model:show="active" :width="300" :placement="placement">
            <n-drawer-content :title="title">
                {{ msg }}
            </n-drawer-content>
        </n-drawer>
        <n-button type="primary" @click="updateGenshinWish">
            Update Genshin Data
        </n-button>

        <n-row>
            <n-col :span="12">
                <n-statistic label="近期出货列表" :value="99">
                    <template #prefix>
                        <n-icon>
                        </n-icon>
                    </template>
                    <template #suffix>
                        / 100
                    </template>
                </n-statistic>
            </n-col>
            <n-col :span="12">
                <n-statistic label="近期抽卡次数">
                    1,234,123
                </n-statistic>
            </n-col>
        </n-row>
    </n-flex>
</template>
  
<script setup>
import { defineComponent, ref } from "vue";
import { } from "naive-ui";
import { requestGachaLog, getGaChaAuthKey, writeGaChaLog } from "../genshin"
import { sleep } from "../utils"



const active = ref(false);
const placement = ref("right");
const title = ref("");
const msg = ref("");

const activate = () => {
    active.value = true;
};

function handle_request(val) {
    if (val.retcode == 0) { // api return success code
        // val.data.data;
    } else {                // api return error code
        title.value = "warning";
        msg.value += JSON.stringify(val.data);
        activate();
    }
    console.log(`dbg! updateGenshinWish code: ${val}`);
}

async function updateGenshinWish() {
    msg.value = ""; // clear former msg

    //FIX ME: request until untilEndId
    //1. get latest id

    let authKey = await getGaChaAuthKey();
    //2. get 100, 200, 301, 302
    await requestGachaLog({ authKey, type: 301, endId: 0 }).then(handle_request);
    // sleep(200);
    // await requestGachaLog({ authKey, type: 302, endId: 0 }).then(handle_request);
    // sleep(200);
    // await requestGachaLog({ authKey, type: 200, endId: 0 }).then(handle_request);
    // sleep(200);
    // await requestGachaLog({ authKey, type: 100, endId: 0 }).then(handle_request);

    //3. write2db
    let data = [];
    await writeGaChaLog(data).catch((reason) => {
        console.log(reason)
    });
}

</script>