<template>
    <n-space vertical>
        <n-layout has-sider style="height: 100vh; width: 100vw;">
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                    :options="menuOptions" />
            </n-layout-sider>
            <!-- <n-switch v-model:value="collapsed" /> -->
            <n-layout  content-style="padding: 12px;">
                <span>{{ activeKey }}</span>
                <router-view></router-view>
            </n-layout>
        </n-layout>
    </n-space>
</template>
  
<script setup>
import { h, ref } from "vue";
import { RouterLink } from "vue-router";
import { NIcon, NLayout, NLayoutSider, NSpace, NSwitch, NMenu } from "naive-ui";
import {
    BookOutline as BookIcon,
    PersonOutline as PersonIcon,
    WineOutline as WineIcon,
    HomeOutline as HomeIcon,
    BugOutline as BugIon,
    SettingsOutline as SettingsIcon,
    DocumentOutline as DocumentIcon,
    PieChartOutline as PieChartIcon,
} from "@vicons/ionicons5";

import router from "./router"
import { firstPage } from "./config"

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

function routerLink(to, name) {
    return () => h(RouterLink,
        { to: to },
        { default: () => name }
    );
}

const activeKey = ref(firstPage);
const collapsed = ref(true);

// app load success, first page
router.push("/" + activeKey.value);

const menuOptions = [
    {
        label: routerLink("/page1", "Page1"),
        key: "page1",
        disabled: false,
        icon: renderIcon(BookIcon)
    },
    {
        label: routerLink("/chart", "Chart"),
        key: "chart",
        disabled: false,
        icon: renderIcon(PieChartIcon)
    },
    {
        label: routerLink("/statistics", "Statistics"),
        key: "statistics",
        disabled: false,
        icon: renderIcon(DocumentIcon)
    },
    {
        label: routerLink("/setting", "Setting"),
        key: "setting",
        disabled: false,
        icon: renderIcon(SettingsIcon)
    },
    {
        label: routerLink("/debug", "Debug"),
        key: "debug",
        disabled: false,
        icon: renderIcon(BugIon)
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