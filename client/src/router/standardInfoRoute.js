import bomSelect from "@/views/standardInfo/bomSelect.vue";

const standardInfoRoute = [
    {
        path: '',
        redirect: { name : 'bomSelect' }
    },
    {
        path: 'bomSelect',
        name: 'bomSelect',
        component: bomSelect
    }
];

export default standardInfoRoute;