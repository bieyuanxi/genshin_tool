<template>
    <n-flex justify="space-around" :size='0' style="height: 100%;">
        <ChartActor class="chart" title="Actor" :data="actor_data" :list="actor_list"/>
        <ChartWeapon class="chart" title="Weapon" :data="weapon_data" :list="weapon_list"/>
        <ChartNormal class="chart" title="Normal" :data="normal_data" :list="normal_list"/>
    </n-flex>
</template>

<script setup>
import { ref } from 'vue';
import { NFlex, NTag } from "naive-ui"

// import Chart from '../components/Chart.vue';
import { getDb } from '../db';
import { gacha_type } from '../mihoyo_api';

import { defineAsyncComponent } from 'vue'

const ChartActor = defineAsyncComponent(async () => {
    await summaryActor();

    return import('../components/Chart.vue')
})

const ChartWeapon = defineAsyncComponent(async () => {
    await summaryWeapon();

    return import('../components/Chart.vue')
})

const ChartNormal = defineAsyncComponent(async () => {
    await summaryNormal();

    return import('../components/Chart.vue')
})

const actor_data = ref([
    // { value: 335, name: '5star' },
    // { value: 10, name: '4star_actor' },
    // { value: 30, name: '4star_weapon' },
])
const weapon_data = ref([])
const normal_data = ref([])

const actor_list = ref([])
const weapon_list = ref([])
const normal_list = ref([])

async function summaryActor() {
    const type = '301'
    const db = await getDb();

    {
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);

        actor_data.value.push({ value: result[0].count, name: "5star" })
    }

    {
        let item = '武器'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        actor_data.value.push({ value: result[0].count, name: "4star_weapon" })
    }

    {
        let item = '角色'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        actor_data.value.push({ value: result[0].count, name: "4star_actor" })
    }

    actor_list.value = await queryList(type);
}

async function summaryWeapon() {
    const type = '302'
    const db = await getDb();

    {
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);

        weapon_data.value.push({ value: result[0].count, name: "5star" })
    }

    {
        let item = '武器'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        weapon_data.value.push({ value: result[0].count, name: "4star_weapon" })
    }

    {
        let item = '角色'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        weapon_data.value.push({ value: result[0].count, name: "4star_actor" })
    }

    weapon_list.value = await queryList(type);
    // pie_weapon_data.legend_data.push('5star', '4star_actor', '4star_weapon')
}

async function summaryNormal() {
    const type = '200'
    const db = await getDb();
    const item_type = ['角色', '武器'];
    const item_type1 = ['actor', 'weapon'];
    const rank_type = ['4', '5'];

    for (let [index, item] of item_type.entries()) {
        for (let rank of rank_type) {
            let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='${rank}' AND item_type='${item}'`;
            const result = await db.select(sql);
            // console.log(sql)
            // console.log(result)
            normal_data.value.push({ value: result[0].count, name: `${rank}star_${item_type1[index]}` })
        }
    }

    normal_list.value = await queryList(type);
}

async function queryList(type) {
    const db = await getDb();

    let sql = `SELECT * FROM gacha_log WHERE gacha_type=${type} AND rank_type='5' ORDER BY id asc`
    const result = await db.select(sql);

    let list = [];
    let left = 0;

    for (const [index, row] of result.entries()) {
        let sql = `SELECT count(*) as count FROM gacha_log WHERE gacha_type=${type} AND id BETWEEN ${left} AND ${row.id}`
        const countResult = await db.select(sql);
        // console.log(result[0].count)
        list.push({ name: result[index].name, count: countResult[0].count - 1 });

        left = row.id
    }

    return list;
}
</script>

<style scoped>
.chart {
    height: 100%;
    width: 33.3%;
}
</style>




  
<style scoped>
.n-layout-header,
.n-layout-footer {
    background: rgba(128, 128, 128, 0.2);
    padding: 24px;
}

.n-layout-sider {
    background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
    background: rgba(128, 128, 128, 0.4);
}
</style>