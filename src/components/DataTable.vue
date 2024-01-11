<template>
    <n-flex vertical>
        <n-data-table flex-height :style="{ height: `90vh` }" remote ref="table" :columns="columnsRef" :data="dataRef"
            :loading="loadingRef" :pagination="paginationReactive" :row-key="rowKey" @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange" @update:page="handlePageChange" />
    </n-flex>
</template>
  
<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { NDataTable, NFlex } from 'naive-ui';

import { selectFrom } from "../db";


const column_id = {
    title: 'id',
    key: 'id',
    sorter: true,
    sortOrder: false
}

const column_rank_type = {
    title: 'rank_type',
    key: 'rank_type',
    filter: true,
    filterOptionValues: [],
    filterOptions: [
        {
            label: 'star4',
            value: 4
        },
        {
            label: 'star5',
            value: 5
        }
    ]
}

const column_name = {
    title: 'name',
    key: 'name',
    // sorter: true,
    // sortOrder: false
}

//fields wanna show
const columns = [
    column_id,
    column_rank_type,
    {
        title: 'item_type',
        key: 'item_type'
    },
    column_name,
    {
        title: 'time',
        key: 'time'
    },
]

const data = [];

async function query(page, pageSize = 10, order = 'ascend', filterValues = []) {
    const offset = (page - 1) * pageSize;
    const where = (filterValues.length == 0) ? "" : `rank_type IN (${filterValues.toString()})`;

    const total = await selectFrom("COUNT(*) as count", "gacha_log", where);

    const ret = await selectFrom(["*"], "gacha_log", where, pageSize, offset);
    
    return {
        // pageCount: 1115,
        data: ret,
        total: total[0].count
    }
}


const dataRef = ref([])
const loadingRef = ref(true)
const columnsRef = ref(columns)
const columnIdReactive = reactive(column_id)
const columnRankTypeReactive = reactive(column_rank_type)
const paginationReactive = reactive({
    page: 1,
    // pageCount: 1,
    pageSize: 10,
    prefix({ itemCount }) {
        return `Total is ${itemCount}.`
    }
})

onMounted(() => {
    query(
        paginationReactive.page,
        paginationReactive.pageSize,
        columnIdReactive.sortOrder,
        columnRankTypeReactive.filterOptionValues
    ).then((data) => {
        dataRef.value = data.data
        // paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
    })
})

function rowKey(rowData) {
    return rowData.column_id
}


function handleSorterChange(sorter) {
    if (!sorter || sorter.columnKey === 'column_id') {
        if (!loadingRef.value) {
            loadingRef.value = true
            query(
                paginationReactive.page,
                paginationReactive.pageSize,
                !sorter ? false : sorter.order,
                columnRankTypeReactive.filterOptionValues
            ).then((data) => {
                columnIdReactive.sortOrder = !sorter ? false : sorter.order
                dataRef.value = data.data
                // paginationReactive.pageCount = data.pageCount
                paginationReactive.itemCount = data.total
                loadingRef.value = false
            })
        }
    }
}

function handleFiltersChange(filters, sourceColumn) {
    if (!loadingRef.value) {
        loadingRef.value = true
        // console.log(filters)
        const filterValues = filters[sourceColumn.key] || []

        // console.log(filterValues)
        query(
            paginationReactive.page,
            paginationReactive.pageSize,
            columnIdReactive.sortOrder,
            filterValues
        ).then((data) => {
            columnRankTypeReactive.filterOptionValues = filterValues
            dataRef.value = data.data
            // paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
        })
    }
}

function handlePageChange(currentPage) {
    if (!loadingRef.value) {
        loadingRef.value = true
        query(
            currentPage,
            paginationReactive.pageSize,
            columnIdReactive.sortOrder,
            columnRankTypeReactive.filterOptionValues
        ).then((data) => {
            dataRef.value = data.data
            paginationReactive.page = currentPage
            // paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
        })
    }
}

</script>