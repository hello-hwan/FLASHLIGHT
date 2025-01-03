//기준정보 라우터
import bomList from "@/views/standardInfo/bomList.vue";

import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import procsFlowchartinsert from "@/views/standardInfo/procsFlowchartinsert.vue";

import emplManagement from "@/views/standardInfo/emplManagement.vue";

import bomManage from "@/views/standardInfo/bomManage.vue";
import qiList from "@/views/standardInfo/qiList.vue";
import mtrilList from "@/views/standardInfo/mtrilList.vue";
import infoprductNList from "@/views/standardInfo/prductNList.vue";
import infoprductList from "@/views/standardInfo/prductList.vue";
import infobcncList from "@/views/standardInfo/bcncList.vue";

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
        path: 'mtrilList',
        name: 'mtrilList',
        component: mtrilList
    },
    {
        path: 'infoprductNList',
        name: 'infoprductNList',
        component: infoprductNList
    },
    {
        path: 'infoprductList',
        name: 'infoprductList',
        component: infoprductList
    },
    {
        path : 'infobcncList',
        name: 'infobcncList',
        component: infobcncList
    }, 
    {
        path : 'emplManagement',
        name: 'emplManagement',
        component: emplManagement
    }
];

export default standardInfoRoute;
