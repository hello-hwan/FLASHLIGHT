import prductNList from "@/views/logistics/prductNList.vue";
import prductNDlivy from "@/views/logistics/prduct_n_dlivy.vue"
import prductNWrhousngList from "@/views/logistics/prductNWrhousngList.vue"
import prductNDlivyList from "@/views/logistics/prductNDlivyList.vue"
import prductWrhousngList from "@/views/logistics/prductWrhousngList.vue"
import prductList from "@/views/logistics/prductList.vue"
import prductDlivy from "@/views/logistics/prductDlivy.vue"
import prductDlivyList from "@/views/logistics/prductDlivyList.vue"


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
    path: 'prductNWrhousngList',
    name: 'prductNWrhousngList',
    component: prductNWrhousngList
  },
  {
    path: 'prductNDlivyList',
    name: 'prductNDlivyList',
    component: prductNDlivyList
  },
  {
    path: 'prductWrhousngList',
    name: 'prductWrhousngList',
    component: prductWrhousngList
  },
  {
    path: 'prductList',
    name: 'prductList',
    component: prductList
  },
  {
    path: 'prductDlivy',
    name: 'prductDlivy',
    component: prductDlivy
  },
  {
    path: 'prductDlivyList',
    name: 'prductDlivyList',
    component: prductDlivyList
  }
];

export default logisticsRoute;
