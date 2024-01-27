<template>
    <n-list hoverable clickable>
        <n-list-item v-for="one in list">
            <n-thing :title=one.account_id content-style="margin-top: 10px;">
                <template #description v-if="one.game_uid == last_login_game_uid">
                    <n-flex size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            Last Login Account
                        </n-tag>
                    </n-flex>
                </template>
                奋勇呀然后休息呀<br>
                完成你伟大的人生
            </n-thing>
        </n-list-item>
    </n-list>
</template>

<script setup>
import { defineProps, withDefaults } from 'vue';
import { NList, NListItem } from "naive-ui"

const props = defineProps({
    list: Array,
    last_login_game_uid: String,
});
</script>