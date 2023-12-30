<template>
    <n-layout has-sider>
        <n-layout-sider bordered content-style="padding: 12px;">
            <n-space style="margin-bottom: 12px">
                <n-switch v-model:value="showRail" /> 展示轨道
                <n-switch v-model:value="showBackground" /> 展示背景
            </n-space>
            <n-anchor :show-rail="showRail" :show-background="showBackground">
                <n-anchor-link title="演示" href="#演示">
                    <n-anchor-link title="Theme" href="#basic.vue" />
                    <n-anchor-link title="固定" href="#affix.vue" />
                    <n-anchor-link title="滚动到" href="#Forbidden.vue" />
                </n-anchor-link>
                <n-anchor-link title="About" href="#setting/about" />
            </n-anchor>
        </n-layout-sider>

        <n-layout>
            <router-view name="sub_view"></router-view>
        </n-layout>
    </n-layout>
</template>

  
<script setup>
import { defineComponent, ref } from "vue";
import About from "./About.vue"

const showRail = ref(true);
const showBackground = ref(true);

</script>