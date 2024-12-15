import bomList from "@/views/standardInfo/bomList.vue";
import bomListInfo from "@/views/standardInfo/bomListInfo.vue";

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
        path: 'bomListInfo',
        name: 'bomListInfo',
        component: bomListInfo
    }
];

export default standardInfoRoute;