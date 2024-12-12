//키오스크 라우터입니다.

import kioskMain from '@/views/kiosk/kioskMain.vue';

const kioskRoute = [
    {
        path: '',
        redirect : { name : 'kioskMain'}
    },
    {
        path: 'kioskMain',
        name: 'kioskMain',
        component: kioskMain
    }
];

export default kioskRoute;