<template>
    <n-flex>
        <n-button>Default</n-button>
        <n-button type="tertiary">
            Load Config
        </n-button>
        <n-button type="primary" @click="getGachaLog({ type: 301, endId: 0 })">
            Request Genshin Data
        </n-button>
        <n-button type="info" @click="create_table">
            create table
        </n-button>
        <n-button type="success" @click="getGaChaAuthKey">
            Read AuthKey
        </n-button>
        <n-button type="warning" @click="router.replace('/chart')">
            Router
        </n-button>
        <n-button type="error" @click="console.log(sys_config)">
            Show Config
        </n-button>
    </n-flex>
</template>


<script setup>
import { invoke } from "@tauri-apps/api"
import { NFlex } from "naive-ui"
import Database from "tauri-plugin-sql-api"

import router from "../router";
import { readLog, getGachaLog, getGaChaAuthKey } from "../genshin";
import { sys_config, db_name } from "../config";
import { insertInto, selectFrom } from "../db"
async function write2db() {
    const data = [
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-28 15:04:24",
            "name": "飞天御剑",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1701155160000057096"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-28 15:04:18",
            "name": "铁影阔剑",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1701155160000056596"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-26 08:36:16",
            "name": "黑缨枪",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700957160000771696"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-26 08:36:04",
            "name": "以理服人",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700957160000766096"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-26 08:35:59",
            "name": "冷刃",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700957160000761596"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-26 08:35:51",
            "name": "北斗",
            "lang": "zh-cn",
            "item_type": "角色",
            "rank_type": "4",
            "id": "1700957160000757196"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-26 08:35:44",
            "name": "讨龙英杰谭",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700957160000752396"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-24 10:18:11",
            "name": "迪希雅",
            "lang": "zh-cn",
            "item_type": "角色",
            "rank_type": "5",
            "id": "1700791560000289296"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-24 08:58:17",
            "name": "飞天御剑",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700784360000565196"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-24 08:42:49",
            "name": "讨龙英杰谭",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700784360000394196"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-24 08:42:41",
            "name": "鸦羽弓",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700784360000393496"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-22 11:37:21",
            "name": "魔导绪论",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700622360000611296"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-21 17:36:43",
            "name": "鸦羽弓",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700557560000596396"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-20 11:01:34",
            "name": "黑缨枪",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700449560000028696"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-20 11:01:23",
            "name": "西风猎弓",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "4",
            "id": "1700449560000025396"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-19 08:48:28",
            "name": "沐浴龙血的剑",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700352360000926696"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-19 08:48:05",
            "name": "柯莱",
            "lang": "zh-cn",
            "item_type": "角色",
            "rank_type": "4",
            "id": "1700352360000922096"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-18 14:32:51",
            "name": "铁影阔剑",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700287560001477696"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-18 14:31:22",
            "name": "讨龙英杰谭",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700287560001419296"
        },
        {
            "uid": "100309696",
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": "2023-11-17 16:37:59",
            "name": "魔导绪论",
            "lang": "zh-cn",
            "item_type": "武器",
            "rank_type": "3",
            "id": "1700208360001066396"
        }
    ];

    const table = "gacha_log";

    await insertInto(table, data).then(null, (reason) => {
        console.log("write failed: " + reason);
    });
}

async function create_table() {
    let db = await Database.load("sqlite:test.db");
    let ret = await db.execute(
        `CREATE TABLE IF NOT EXISTS gacha_log(
        id          INT PRIMARY KEY     NOT NULL,
        uid         TEXT    NOT NULL,
        gacha_type  TEXT    NOT NULL,
        item_id     TEXT    NOT NULL,
        count       TEXT    NOT NULL,
        time        TEXT    NOT NULL,
        name        TEXT    NOT NULL,
        lang        TEXT    NOT NULL,
        item_type   TEXT    NOT NULL,
        rank_type   TEXT    NOT NULL
        );`).then(null, (reason) => {
            console.log(reason)
        });

    await db.close("sqlite:test.db");

    write2db();
}

</script>