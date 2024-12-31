//품질 라우트
import qualityRequest from "@/views/quality/quailtyRequest.vue";
import qiResult from "@/views/quality/qiResult.vue";


const qualityRoute = [
  {
    path: '',
    redirect: { name : 'qualityRequest' } // 품질 메인 페이지 입력
  },
  {
    path: 'qualityRequest',
    name: 'qualityRequest',
    component: qualityRequest
  },
  {
    path: 'qiResult',
    name: 'qiResult',
    component: qiResult
  }  

];

export default qualityRoute;