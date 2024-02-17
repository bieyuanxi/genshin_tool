<template>
    <n-flex vertical style="height: 100%;">
        <v-chart :option="option" autoresize class="chart"/>
        <n-divider />
        <n-flex>
            <n-tag size="small" v-for="one in props.list">{{ one.name }}[{{ one.count }}]</n-tag>
        </n-flex>
        
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
import { NFlex, NTag, NDivider } from "naive-ui"

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
    list: {
        name: String,
        count: Number
    }
})

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
        data: legend,
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

<style scoped>
.chart {
    height: 70%;
    width: 100%;
}
.n-divider {
    /* height: 100%; */
    padding: 0%;
    margin: 0%;
}
</style>
