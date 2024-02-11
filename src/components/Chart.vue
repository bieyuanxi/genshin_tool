<template>
    <n-grid x-gap="3" y-gap="3" :cols="3" style="width: 100%;">
        <n-gi v-for="option in options">
            <div style=" height: 50vh;">
                <v-chart class="chart" :option="option" autoresize />
            </div>
        </n-gi>

        <n-gi v-for="i in data">
            <div>
                <p>{{ i }}</p>
            </div>
        </n-gi>
    </n-grid>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, onMounted, reactive } from 'vue';
import { NGrid, NGi } from "naive-ui"

import { getDb } from '../db';
import { gacha_type } from '../mihoyo_api';

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

provide(THEME_KEY, 'white');

const data = ref([
    "actor_msgTODO", "weapon_msgTODO", "normal_msgTODO"
])

const actor_data = ref([
    // { value: 335, name: '5star' },
    // { value: 10, name: '4star_actor' },
    // { value: 30, name: '4star_weapon' },
])
const weapon_data = ref([])
const normal_data = ref([])

const pie_actor_data = reactive({
    legend_data: [],
    series_data: []
})

const pie_weapon_data = reactive({
    legend_data: [],
    series_data: []
})

const pie_normal_data = reactive({
    legend_data: [],
    series_data: []
})

summary()

const options = ref([
    {
        title: {
            text: 'Actor',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: pie_actor_data.legend_data,
        },
        series: [
            {
                name: 'actor',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: pie_actor_data.series_data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    },
    {
        title: {
            text: 'Weapon',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: pie_weapon_data.legend_data,
        },
        series: [
            {
                name: 'weapon',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: pie_weapon_data.series_data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    },
    {
        title: {
            text: 'Normal',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: pie_normal_data.legend_data,
        },
        series: [
            {
                name: 'Normal',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: pie_normal_data.series_data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
]);



async function summary() {
    await summaryActor();
    await summaryWeapon();
    await summaryNormal();
    await query();
}

async function summaryActor() {
    const type = '301'
    const db = await getDb();

    // pie_data.legend_data.push('5star', '4star_actor', '4star_weapon')

    {
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);

        pie_actor_data.series_data.push({ value: result[0].count, name: "5star" })
    }

    {
        let item = '武器'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        pie_actor_data.series_data.push({ value: result[0].count, name: "4star_weapon" })
    }

    {
        let item = '角色'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        pie_actor_data.series_data.push({ value: result[0].count, name: "4star_actor" })
    }

    pie_actor_data.legend_data.push('5star', '4star_actor', '4star_weapon')

    console.log(pie_actor_data)
}

async function summaryWeapon() {
    const type = '302'
    const db = await getDb();

    // pie_data.legend_data.push('5star', '4star_actor', '4star_weapon')

    {
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);

        pie_weapon_data.series_data.push({ value: result[0].count, name: "5star" })
    }

    {
        let item = '武器'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        pie_weapon_data.series_data.push({ value: result[0].count, name: "4star_weapon" })
    }

    {
        let item = '角色'   //FIX ME: i18n
        let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='4' AND item_type='${item}'`;
        const result = await db.select(sql);

        pie_weapon_data.series_data.push({ value: result[0].count, name: "4star_actor" })
    }

    pie_weapon_data.legend_data.push('5star', '4star_actor', '4star_weapon')
}

async function summaryNormal() {
    const type = '200'
    const db = await getDb();
    const item_type = ['角色', '武器'];
    const rank_type = ['4', '5'];

    for (let item of item_type) {
        for (let rank of rank_type) {
            let sql = `SELECT COUNT(*) AS count FROM gacha_log WHERE gacha_type=${type} AND rank_type='${rank}' AND item_type='${item}'`;
            const result = await db.select(sql);
            console.log(sql)
            console.log(result)
            pie_normal_data.series_data.push({ value: result[0].count, name: `${rank}star_${item}` })
            pie_normal_data.legend_data.push(`${rank}star_${item}`)
        }
    }
}

async function query() {
    // const item_type = ['角色', '武器'];
    // const rank_type = ['4', '5'];
    const db = await getDb();
    const type = '5'
    const gacha_type = ['200', '301', '302'];
    for(let type of gacha_type) {
        let sql = `SELECT * FROM gacha_log WHERE gacha_type=${type} AND rank_type='5'`;
        const result = await db.select(sql);
        console.log(result)
        for(let one of result) {
            data.value.push(one.name);
        }
    }
    
    
}
</script>

<style scoped>
.chart {
    /* height: 100vh; */
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