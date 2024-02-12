<template>
    <n-flex justify="space-around" :size='0' style="height: 100%;">
        <Chart class="chart" title="Actor" :data="actor_data"></Chart>
        <Chart class="chart" title="Weapon" :data="weapon_data"></Chart>
        <Chart class="chart" title="Normal" :data="normal_data"></Chart>
    </n-flex>
</template>

<script setup>
import { ref, provide, onMounted, reactive } from 'vue';
import { NGrid, NGi } from "naive-ui"

// import Chart from '../components/Chart.vue';
import { getDb } from '../db';
import { gacha_type } from '../mihoyo_api';

import { defineAsyncComponent } from 'vue'

const Chart = defineAsyncComponent(async () => {
    await summary();

    return import('../components/Chart.vue')
}


)

const actor_data = ref([
    // { value: 335, name: '5star' },
    // { value: 10, name: '4star_actor' },
    // { value: 30, name: '4star_weapon' },
])
const weapon_data = ref([])
const normal_data = ref([])

async function summary() {
    await summaryActor();
    await summaryWeapon();
    await summaryNormal();
    // await query();
}

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

    // pie_actor_data.legend_data.push('5star', '4star_actor', '4star_weapon')

    // console.log(pie_actor_data)
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
}

async function query() {
    // const item_type = ['角色', '武器'];
    // const rank_type = ['4', '5'];
    const db = await getDb();
    const type = '5'
    const gacha_type = ['200', '301', '302'];
    for (let type of gacha_type) {
        let sql = `SELECT * FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);
        console.log(result)
        for (let one of result) {
            data.value.push(one.name);
        }
    }


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