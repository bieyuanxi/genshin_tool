<template>
    <n-flex vertical style="height: 100%;">
        <n-flex>
            <n-radio v-for="_type in gacha_type" :checked="checkedValueRef == _type" :value="_type" name="basic-demo"
                @change="handleChange">
                {{ _type }}
            </n-radio>
        </n-flex>
        <n-data-table flex-height striped :row-class-name="rowClassName" style="height: 100%;" remote ref="table" :columns="columnsRef" :data="dataRef"
            :loading="loadingRef" :pagination="paginationReactive" :row-key="rowKey" @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange" @update:page="handlePageChange" />
    </n-flex>
</template>
  
<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { NDataTable, NFlex, NRadio } from 'naive-ui';

import { selectFrom } from "../db";
import { gacha_type } from '../mihoyo_api';

const checkedValueRef = ref('301'); //actor wish

function handleChange(e) {
    checkedValueRef.value = e.target.value;
    paginationReactive.page = 1;
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
}

const column_id = {
    title: 'id',
    key: 'id',
    sorter: true,
    sortOrder: "descend"
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

function rowClassName(row, index) {
    const rank = parseInt(row.rank_type);
    let style = "";
    switch(rank) {
        case 5:
            style = "yellow"
            break;
        case 4:
            style = "purple"
            break;
        default:
    }

    return style
}

async function query(page, pageSize = 10, order = 'asc', filterValues = []) {
    const offset = (page - 1) * pageSize;
    let where = `gacha_type='${checkedValueRef.value}'`;
    where = (filterValues.length == 0) ? where : `${where} AND rank_type IN (${filterValues.toString()})`;
    
    if(order) {
        where = `${where} ORDER BY id ${order.split('end')[0]}`
    }
    

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
    if (!sorter || sorter.columnKey === 'id') {
        if (!loadingRef.value) {
            loadingRef.value = true
            console.log(sorter)
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

        paginationReactive.page = 1;
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

<style scoped>


.age {
    color: rgba(0, 128, 0, 0.75)
}

:deep(.yellow td) {
    color: rgb(194, 191, 0) !important;
}

:deep(.purple td) {
    color: purple !important;
}
</style>
