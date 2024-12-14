<template>
  <form action=""></form>
  <div class="row g-3 align-items-center">
      <div class="col-auto">
          <label for="inputPassword6" class="col-form-label">Password</label>
      </div>
      <div class="col-auto">
          <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
      </div>
      <div class="col-auto">
          <span id="passwordHelpInline" class="form-text">
          Must be 8-20 characters long.
          </span>
      </div>
  </div>
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
          bomList: [],
          rowData: '',
          colDefs: '',
      };
  },
  created() {
      this.getbomList();
      this.colDefs = ref([
          { field: "bom_code", headerName:"BOM코드" },
          { field: "prdlst_code" },
          { field: "prdist_name" },
          { field: "prdctn_qy" }
      ]);
  },
  name: "App",
  components: {
      AgGridVue, // Add Vue Data Grid component
  },
  methods: {
      async getbomList() {
          let result = await axios.get(`${ajaxUrl}/bom`)
              .catch(err => console.log(err));
              console.log(result.data);
          this.bomList = result.data;
          this.rowData = ref(this.bomList);
          console.log(this.result);
      }
  }
};
</script>