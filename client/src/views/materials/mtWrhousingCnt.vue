<template>
    <div>
        <!--리턴 리스트-->
        <return-list />
        <!--입고 리스트-->
        <order-list />
    </div>
</template>

<script>
import ReturnList from '@/components/materials/mtWrhousingReturn.vue';
import OrderList from '@/components/materials/mtWrhousingOrder.vue';

export default {
    components: {
        "return-list" : ReturnList,
        "order-list" : OrderList,
    },
};
</script>

<style lang="scss">
    @import "../../../node_modules/ag-grid-community/styles/ag-grid.css";
    @import "../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css";
</style>