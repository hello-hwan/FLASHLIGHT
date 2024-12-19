
import bomList from "@/views/standardInfo/bomList.vue";
import bomInsert from "@/views/standardInfo/bomInsert.vue";
import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import procsFlowchartinsert from "@/views/standardInfo/procsFlowchartinsert.vue";

const standardInfoRoute = [
    {
        path: '',
        redirect: { name : 'bomList' }
    },
    {
        path: 'bomList',
        name: 'bomList',
        component: bomList
    },
    {
        path: 'bomInsert',
        name: 'bomInsert',
        component: bomInsert
    }, 
    {
        path: 'procsFlowchartList',
        name: 'procsFlowchartList',
        component: procsFlowchartList
    },
    {
        path: 'procsFlowchartDetail/:prd_code',
        name: 'procsFlowchartDetail',
        component: procsFlowchartDetail
    }, 
    {
        path: 'procsFlowchartinsert',
        name: 'procsFlowchartinsert',
        component: procsFlowchartinsert
    }, 
];

export default standardInfoRoute;