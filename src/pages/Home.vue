<template>
    <n-spin :show="status.loading">
        <n-flex>
            <n-button type="info" @click="getAllGachaLog" style="height: 48px;">
                Update Gacha Data
            </n-button>
            <n-alert title="" :type="alert.type">
                {{ alert.msg }}
            </n-alert>
        </n-flex>
        <template #description>
            {{ alert.msg }}
        </template>
    </n-spin>
    <n-divider />
    <n-list hoverable clickable>
        <template #header>
            Account info
        </template>
        <n-list-item v-for="role in gameRolesList">
            <template #prefix>
                <n-thing :title="`${role.nickname}`" description=""></n-thing>
            </template>
            <template #suffix>
                <n-tag v-if="role.game_uid == user.game_uid" :bordered="false" type="info" size="large">
                    Current
                </n-tag>
            </template>
            <n-thing :title="`UID ${role.game_uid}`" content-style="margin-top: 10px;">
                <template #description>
                    <n-flex size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            {{ role.region_name }}
                        </n-tag>
                        <n-tag :bordered="false" type="info" size="small">
                            lv{{ role.level }}
                        </n-tag>
                    </n-flex>
                </template>
                奋勇呀然后休息呀<br>
                完成你伟大的人生
            </n-thing>
        </n-list-item>
    </n-list>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { NList, NListItem, NThing, NFlex, NTag, NAlert, NButton, NSpin, NDivider } from "naive-ui"

import { info, warn } from "tauri-plugin-log-api";
import { user } from "../store"
import { requestGachaLog } from "../genshin";
import { gacha_type, getUserGameRolesByStoken, getGachaAuthkey } from "../mihoyo_api";
import { sleep, short } from "../utils";
import { getDb, val2sql, key2sql } from "../db";


const props = defineProps({
    id: String,
})

const status = reactive({
    loading: false,
    setLoadingStatus(status = true) {
        this.loading = status
    },
})

const alert = reactive({
    type: "success",
    msg: "",
    success(msg = "") {
        this.type = "success"
        this.msg = msg;
    },
    info(msg = "") {
        this.type = "info"
        this.msg = msg;
    },
    warn(msg = "") {
        this.type = "warning"
        this.msg = msg;
    },
    error(msg = "") {
        this.type = "error"
        this.msg = msg;
    }
})



const gameRolesList = reactive([]);

onMounted(async () => {
    const stoken = user.stoken;
    const mid = user.mid;
    alert.info("Query game roles")
    const resp = await getUserGameRolesByStoken({ stoken, mid });   //TODO: no internet error handle

    switch (resp.retcode) {
        case 0:
            const roles = resp.data.list;
            gameRolesList.push(...roles);

            const { game_uid, region, game_biz, region_name, nickname } = roles[0];  //TODO: select last game_uid from db
            // FIX ME: nasty code
            user.game_biz = game_biz;
            user.game_uid = game_uid;
            user.nickname = nickname;
            user.region = region;
            user.region_name = region_name;
            break;
        case -100:  // stoken expired
            alert.warn(resp)
            console.log(resp); warn(JSON.stringify(resp)); //TODO: generate stoken using game_token
            break;
        default:    // other error
            alert.error(resp)
            console.log(resp); warn(JSON.stringify(resp));
            break;
    }
    await sleep(200)
})

async function getAllGachaLog() {
    status.setLoadingStatus(true);

    const stoken = user.stoken;
    const mid = user.mid;
    const region = user.region;
    const game_uid = user.game_uid;

    const authkey = await getGachaAuthkey({ game_uid, region, stoken, mid })
    user.updateAuthkeyB(authkey);
    alert.info("getGachaAuthkey")

    for (const [index, type] of gacha_type.entries()) {
        if (index > 0) await sleep(200);
        await getGachaLog(user.authkeyB, type);
        alert.info(`getGachaLog:${type}`)
    }

    status.setLoadingStatus(false);
}

async function getGachaLog(authKey = "invalid_authkey", type = "301") {
    const size = 20;
    let rowsInsert = 0;

    for (let check = true, endId = "0"; check;) {
        const ret = await requestGachaLog({ authKey, type, endId, size });
        const resp = ret.data;

        if (0 == resp.retcode) {
            const list = resp.data.list;
            // console.log(resp.data)
            if (list.length > 0) {
                endId = list[list.length - 1].id;
                const result = await merge(list);
                rowsInsert += result.rowsAffected;
                check = !(result.rowsAffected < size);
            } else {  // no data found from server
                check = false;  //break
            }
        } else {    // api retcode error
            console.log(resp); warn(resp.message);
            break;
        }

        if (check) await sleep(200);
    }
    const msg = `in getGachaLog, type=${type}, total rows affected: ${rowsInsert}`
    console.log(msg); info(msg);
}

async function merge(list = []) {
    const db = await getDb();

    //TODO: turn gacha_type=400 to 301
    const keys = key2sql(list);
    const vals = val2sql(list);

    const sql = `INSERT OR IGNORE INTO gacha_log ${keys} VALUES ${vals}`;
    // console.log(sql)
    return await db.execute(sql);
}

</script>

<style scoped>

</style>