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
    HomeOutline as HomeIcon
} from "@vicons/ionicons5";

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

function routerLink(to, name) {
    return () => h(RouterLink,
        { to: to },
        { default: () => name }
    );
}

const activeKey = ref("setting");
const collapsed = ref(true);

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
        icon: renderIcon(WineIcon)
    },
    {
        label: routerLink("/statistics", "Statistics"),
        key: "statistics",
        disabled: false,
        icon: renderIcon(PersonIcon)
    },
    {
        label: routerLink("/setting", "Setting"),
        key: "setting",
        disabled: false,
        icon: renderIcon(BookIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/zh-CN/os-theme/components/code'
                    }
                },
                { default: () => '上班' }
            ),
        key: 'go-to-work',
        icon: renderIcon(HomeIcon)
    }
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