<template>
    <n-flex>
        <n-drawer v-model:show="active" :width="300" :placement="placement">
            <n-drawer-content :title="title">
                {{ error_log }}
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
const error_log = ref("");

const activate = () => {
    active.value = true;
};

function show_error(msg) {
    title.value = "warning";
    error_log.value += JSON.stringify(msg);
    activate();
    console.log(`dbg! updateGenshinWish code: ${JSON.stringify(msg)}`);
}

function clear_error_log() {
    error_log.value = ""; // clear former error_log
}

async function updateGenshinWish() {
    clear_error_log();

    //FIX ME: request until untilEndId
    //1. get latest id

    const authKey = await getGaChaAuthKey()
        .catch((reason) => {
            show_error(reason);
        });

    if (!authKey) return;

    //2. FIX ME: get 100, 200, 301, 302
    const resp = await requestGachaLog({ authKey, type: 301, endId: 0 })
        .then((val) => {
            if (val.retcode != 0) { // api return error code
                show_error(val.data);
            }
            return val.data.data;
        });

    if (!resp) return;
    // sleep(200);
    // await requestGachaLog({ authKey, type: 302, endId: 0 }).then(handle_request);
    // sleep(200);
    // await requestGachaLog({ authKey, type: 200, endId: 0 }).then(handle_request);
    // sleep(200);
    // await requestGachaLog({ authKey, type: 100, endId: 0 }).then(handle_request);

    //3. write2db FIX ME: compare before insert
    let data = [];
    const result = await writeGaChaLog(data).catch((reason) => {
        console.log(reason)
    });
}

</script>