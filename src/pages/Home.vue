<template>
    <n-flex>
        <n-spin :show="status.loading">
            <n-button type="info" @click="getAllGachaLog">
                Update Gacha Data
            </n-button>
            <template #description>
                {{ status.msg }}
            </template>
        </n-spin>
        <n-divider />
        <n-list hoverable clickable style="width: 100%;">
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
    </n-flex>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { NList, NListItem, NThing, NFlex, NTag, NAlert, NButton, NSpin, NDivider } from "naive-ui"
import { useNotification } from "naive-ui";

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
    msg: "",
    setLoadingStatus(status = true) {
        this.loading = status;
        this.msg = status ? this.msg : "";
    },
    setMsg(msg) {
        this.msg = msg;
    }
})

const notifyDuration = 2500;
const notification = useNotification();


const gameRolesList = reactive([]);

onMounted(async () => {
    const stoken = user.stoken;
    const mid = user.mid;

    await getUserGameRolesByStoken({ stoken, mid })
        .then((resp) => handleRequestGameRoles(resp))
})

async function handleRequestGameRoles(resp) {
    let retcode = 0;
    retcode = resp.retcode;
    switch (retcode) {
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
            notification.warning({
                title: "Stoken expired",
                content: resp.message,
                meta: "Stoken expired. Please sign in.",
                duration: notifyDuration,
                keepAliveOnHover: true
            });
            console.log(resp); warn(JSON.stringify(resp)); //TODO: generate stoken using game_token
            break;
        default:    // other error
            notification.error({
                title: "Api error",
                content: JSON.stringify(resp, null, 4),
                meta: "This might be a bug, please report.",
                duration: notifyDuration,
                keepAliveOnHover: true
            });
            console.log(resp); warn(JSON.stringify(resp));
            break;
    }

    return retcode;
}

async function getAllGachaLog() {
    status.setLoadingStatus(true);

    const stoken = user.stoken;
    const mid = user.mid;
    const region = user.region;
    const game_uid = user.game_uid;

    try {
        const authkey = await getGachaAuthkey({ game_uid, region, stoken, mid })
        user.updateAuthkeyB(authkey);
        status.setMsg("getGachaAuthkey")

        for (const [index, type] of gacha_type.entries()) {
            // if (index > 0) await sleep(200);
            await getGachaLog(user.authkeyB, type);
            status.setMsg(`getGachaLog:${type}`)
            await sleep(200);
        }
    } catch (error) {
        notification.warning({
            title: "Network Error",
            content: "Please check your internet connection.",
            meta: "",
            duration: notifyDuration,
            keepAliveOnHover: true
        });
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
.n-divider {
    padding: 0%;
    margin: 0%;
}
</style>