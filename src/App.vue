<template>
    <n-space vertical>
        <n-layout has-sider style="height: 100vh; width: 100vw;">
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                    :options="menuOptions" />
            </n-layout-sider>
            <!-- <n-switch v-model:value="collapsed" /> -->
            <n-layout>
                <span>{{ activeKey }}</span>
                <Statistics v-if="activeKey == 'statistics'" />
                <Chart v-else-if="activeKey == 'chart'" />
                <Setting v-else-if="activeKey == 'setting'" />
            </n-layout>
        </n-layout>
    </n-space>
</template>
  
<script setup>
import { h, ref } from "vue";
import { NIcon, NLayout, NLayoutSider, NSpace, NSwitch, NMenu } from "naive-ui";
import {
    BookOutline as BookIcon,
    PersonOutline as PersonIcon,
    WineOutline as WineIcon
} from "@vicons/ionicons5";

import Statistics from "./components/Statistics.vue"
import Setting from "./components/Setting.vue"
import Chart from "./components/Chart.vue";

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const activeKey = ref("setting");
const collapsed = ref(true);

const menuOptions = [
    {
        label: "page1",
        key: "page1",
        disabled: false,
        icon: renderIcon(BookIcon)
    },
    {
        label: "Chart",
        key: "chart",
        disabled: false,
        icon: renderIcon(WineIcon)
    },
    {
        label: "Statistics",
        key: "statistics",
        disabled: false,
        icon: renderIcon(PersonIcon)
    },
    {
        label: "Setting",
        key: "setting",
        disabled: false,
        icon: renderIcon(BookIcon)
    },
];



</script>

<style scoped>
.light-green {
    /* height: 108px; */
    background-color: rgba(0, 128, 0, 0.12);
}

.green {
    /* height: 108px; */
    background-color: rgba(0, 128, 0, 0.24);
}
</style>