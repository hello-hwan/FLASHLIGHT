//자재 라우터
import mtrilQy from '@/views/materials/materialQy.vue';

const materialsRoute = [
    {
        path: '',
        redirect : { name : 'mtrilQy' }
    },
    {
        path: 'mtrilQy',
        name: 'mtrilQy',
        component: mtrilQy
    }
];

export default materialsRoute;