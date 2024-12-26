//키오스크 라우터입니다.

import kioskMain from '@/views/kiosk/kioskMain.vue';
import kioskStart from '@/views/kiosk/kioskStart.vue';

const kioskRoute = [
    {
        path: '',
        redirect : { name : 'kioskMain'}
    },
    {
        path: 'kioskMain',
        name: 'kioskMain',
        component: kioskMain
    },
    {
        path: 'kioskStart',
        name: 'kioskStart',
        component : kioskStart
    },

];

export default kioskRoute;