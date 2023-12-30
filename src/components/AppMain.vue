<template>
    <n-space vertical>
        <n-switch v-model:value="collapsed" />
        <n-layout has-sider>
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                    :options="menuOptions" />
            </n-layout-sider>
            <n-layout>
                <span>{{activeKey}}</span>
                <div>
                    <Statistics v-if="activeKey == 'statistics'"></Statistics>
                    <Setting v-else-if="activeKey == 'setting'" />
                </div>
                
                
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

import Statistics from "./Statistics.vue"
import Setting from "./Setting.vue"

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
    label: "page2",
    key: "page2",
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