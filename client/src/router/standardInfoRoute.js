//기준정보 라우트
import processFlowInput from '@/views/standardInfo/processFlowInput.vue';
//import processFlowView from '@/views/standardInfo/processFlowView.vue';

const standardInfoRoutes = [
    {
        path: '',
        redirect: { name : '' } // 기준정보 메인 페이지 입력
    },
    {
        path: 'processFlowInput',
        name: 'processFlowInput',
        component: processFlowInput
    }
];

export default standardInfoRoutes;