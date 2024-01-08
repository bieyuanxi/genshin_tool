<template>
    <n-layout has-sider>
        <n-layout-sider bordered content-style="padding: 0px" width="160px">
            <n-flex style="margin-bottom: 12px">
                <n-switch v-model:value="showRail" /> 展示轨道
                <!-- <n-switch v-model:value="showBackground" /> 展示背景 -->
            </n-flex>

            <n-anchor :show-rail="showRail" :show-background="showBackground">

                <n-anchor-link v-for="option in menuOptions" :title="option.title" :href="option.href">
                    <n-anchor-link v-for="sub_option in option.children" :title="sub_option.title"
                        :href="sub_option.href" />
                </n-anchor-link>


                <!-- <n-anchor-link title="Debug" href="#setting/debug" /> -->
            </n-anchor>
        </n-layout-sider>

        <n-layout>
            <router-view name="sub_view"></router-view>
        </n-layout>
    </n-layout>
</template>

  
<script setup>
import { defineComponent, ref } from "vue";
import { NAnchorLink, NFlex, NLayout, NLayoutSider, NAnchor, NSwitch } from "naive-ui"

const showRail = ref(true);
const showBackground = ref(true);

// todo: a recursive menu
const menuOptions = [
    {
        title: "Config",
        href: "#setting",
        children: [
            {
                title: "t11",
                href: "#setting",
            },
        ],
    },
    {
        title: "About",
        href: "#setting/about",
    },
];




</script>