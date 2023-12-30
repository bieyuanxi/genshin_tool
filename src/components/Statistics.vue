<template>
    <n-space vertical>
        <n-table striped>
            <thead>
                <tr>
                    <th v-for="h in form_header">{{h}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="line in data">
                    <td v-for="e in line">{{e}}</td>
                </tr>
            </tbody>
        </n-table>
        <n-pagination v-model:page="page" :page-count="page_cnt" />
    </n-space>

</template>
  
<script setup>
import { defineComponent, ref } from "vue";
import { NPagination } from "naive-ui"

const form_header = [
    "A", "B", "C", "D", "E"
];

const data = [
    [1, 2, 3, 4, 5], 
    [6, 7, 8, 9, 0],
    [6, 5, 4, 3, 2],
];

const page = ref(1)
const page_cnt = ref(1023)

</script>