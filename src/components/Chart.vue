<template>
    <n-flex vertical style="height: 100%;">
        <v-chart :option="option" autoresize class="chart" />
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

// provide(THEME_KEY, 'dark');

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
        textStyle: {
            color: '#666'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: legend,
        textStyle: {
            color: 'inherite',
            fontWeight: 'bold',
        }
    },
    series: [
        {
            name: props.title,
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: props.data,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
            // minAngle: 1,    //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
            minShowLabelAngle: 1,   //小于这个角度（0 ~ 360）的扇区，不显示标签（label 和 labelLine）
            label: {
                show: true,
                color: 'inherit',
                textBorderColor: 'inherit',
                fontWeight: 'bold',
                overflow: 'breakAll',    //强制单词内换行
                bleedMargin: 0,
                distanceToLabelLine: 0
            },
        },
    ],
});

</script>

<style scoped>
.chart {
    height: 50%;
    width: 100%;
}

.n-divider {
    /* height: 100%; */
    padding: 0%;
    margin: 0%;
}
</style>
