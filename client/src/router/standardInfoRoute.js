//기준정보 라우터
import bomList from "@/views/standardInfo/bomList.vue";
import bomInsert from "@/views/standardInfo/bomInsert.vue";
import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import procsFlowchartinsert from "@/views/standardInfo/procsFlowchartinsert.vue";

import qiList from "@/views/standardInfo/qiList.vue"

import prductNList from "@/views/standardInfo/prductNListwrhousng.vue";
import bomManage from "@/views/standardInfo/bomManage.vue";

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
    {
        path: 'prductNList',
        name: 'prductNList',
        component: prductNList
    },
    {
        path: 'bomManage',
        name: 'bomManage',
        component: bomManage
    },
    {
        path: 'qiList',
        name: 'qiList',
        component: qiList
    },
    {
        path: 'prductNList',
        name: 'prductNList',
        component: prductNList
    },
    {
        path: 'qiList',
        name: 'qiList',
        component: qiList
    }
];

export default standardInfoRoute;
