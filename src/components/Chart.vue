<template>
    <n-flex vertical>
        <v-chart :option="option" autoresize />
    </n-flex>
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
import { ref, provide } from 'vue';
import { NFlex } from "naive-ui"

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

provide(THEME_KEY, 'white');

const props = defineProps({
    title: String,
    data: {
        name: String,
        value: Number
    },
})

const data1 = ref([
    "actor_msgTODO", "weapon_msgTODO", "normal_msgTODO"
])

const legend = ref([])

for (const { name, value } of props.data) {
    legend.value.push(name)
}

const option = ref({
    title: {
        text: props.title,
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: legend,   //TODO
    },
    series: [
        {
            name: props.title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: props.data,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
});

</script>

<style scoped></style>
