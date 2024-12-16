//생산 라우트
import productionMain from "@/views/production/productionMain.vue";
import productionResult from "@/views/production/productionResult.vue";
const productionRoute = [
  {
    path: '',
    redirect: { name : 'productionMain' } // 생산 메인 페이지 입력
  },
  {
    path: 'productionMain',
    name: 'productionMain',
    component: productionMain
  },
  
  {
    path: 'productionResult',
    name: 'productionResult',
    component: productionResult
  },


];

export default productionRoute;