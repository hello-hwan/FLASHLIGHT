const standardInfoRoute = [
    {
        path: '',
        redirect: { name : 'bom' }
    },
    {
        path: 'bom',
        name: 'bom',
        component: bomselect
    }
];

export default standardInfoRoute;