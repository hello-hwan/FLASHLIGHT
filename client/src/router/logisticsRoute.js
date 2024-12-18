//물류 라우터
import prductNList from "@/views/logistics/prductNList.vue";

const logisticsRoute = [
  {
    path: '',
    redirect: { name : 'prductNList'}
  },
  {
    path: 'prductNList',
    name: 'prductNList',
    component: prductNList
  }
];

export default logisticsRoute;