import bomList from "@/views/standardInfo/bomList.vue";
import bomListInfo from "@/views/standardInfo/bomListInfo.vue";
import bomInsert from "@/views/standardInfo/bomInsert.vue";


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
    },
    {
        path: 'bomInsert',
        name: 'bomInsert',
        component: bomInsert
    }

];

export default standardInfoRoute;