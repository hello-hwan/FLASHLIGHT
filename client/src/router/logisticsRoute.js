import prductNList from "@/views/logistics/prductNList.vue";
import prductNDlivy from "@/views/logistics/prduct_n_dlivy.vue"
import prductNListwrhousng from "@/views/logistics/prductNListwrhousng.vue"

const logisticsRoute = [
  {
    path: '',
    redirect: { name: 'prductNList' } 
  }, 
  {
    path: 'prductNList',   
    name: 'prductNList',  
    component: prductNList  
  },
  {
    path: 'prductNDlivy',
    name: 'prductNDlivy',
    component: prductNDlivy
  },
  {
    path: 'prductNListwrhousng',
    name: 'prductNListwrhousng',
    component: prductNListwrhousng
  }
];

export default logisticsRoute;
