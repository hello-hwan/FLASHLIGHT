<template>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px">
        </ag-grid-vue>
    </div>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    data() {
        return {
            eqpList: [],
            rowData: '',
            colDefs: '',
        };
    },
    created() {
        this.getEqpList();
        this.colDefs = ref([
            { field: "eqp_code", headerName: "설비코드" },
            { field: "model_nm", headerName: "모델명" },
            { field: "eqp_run", headerName: "가동여부" },
            { field: "model_tp", headerName: "온도" }, 
            { field: "procs_time", headerName: "가동시간" }, 
            { field: "procs_nm", headerName: "실행작업" }
        ]);
    },
    components: {
        AgGridVue, // Add Vue Data Grid component
    },
    methods: {
        async getEqpList() {
            let result = await axios.get(`${ajaxUrl}/equip/eqp_list`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            for (let i = 0 ; i < this.eqpList.length ; i++) {
                let eqp_run = await axios.get(`${ajaxUrl}/equip/eqp_list_prod/${this.eqpList[i].eqp_code}`)
                if (eqp_run.data.begin_time != "" && eqp_run.data.end_time == "") {
                    this.eqpList[i].eqp_run = "가동중";
                    this.eqpList[i].procs_nm = eqp_run.data.procs_nm;
                    let start_time = new Date(eqp_run.data.begin_time);
                    let today = new Date();
                    this.eqpList[i].procs_time = ((today - start_time) / 1000 / 60 / 60).toFixed(2)
                } else {
                    this.eqpList[i].eqp_run = "비가동";
                    this.eqpList[i].procs_nm = "-";
                    this.eqpList[i].procs_time = "-";
                }

            }
            this.rowData = ref(this.eqpList);

            let time_sample = await axios.get(`${ajaxUrl}/equip/time_sample`);
            let last_time = new Date(time_sample.data.created_date);
            let today = new Date(); 
            console.log(((today - last_time) / 1000 / 60 / 60).toFixed(2));
        }
    }
};
</script>

