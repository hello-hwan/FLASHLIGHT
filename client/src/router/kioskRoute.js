//키오스크 라우터입니다.

import kioskMain from '@/views/kiosk/kioskMain.vue';
import kioskStart from '@/views/kiosk/kioskStart.vue';
import kioskState from '@/views/kiosk/kioskState.vue';

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
    {
        path: 'kioskState',
        name: 'kioskState',
        component : kioskState
    }
];

export default kioskRoute;