
import bomList from "@/views/standardInfo/bomList.vue";
import bomInsert from "@/views/standardInfo/bomInsert.vue";
import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import qiList from "@/views/standardInfo/qiList.vue"

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
        path: 'qiList',
        name: 'qiList',
        component: qiList
    }
];

export default standardInfoRoute;