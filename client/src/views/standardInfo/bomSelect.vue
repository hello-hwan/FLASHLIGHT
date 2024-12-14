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
          bomList: [],
          rowData: '',
          colDefs: '',
      };
  },
  created() {
      this.getBomList();
      this.colDefs = ref([
          { field: "bom_code" },
          { field: "prdlst_code" },
          { field: "prdist_name" },
          { field: "prdctn_qy" },
          { field: "" }
      ]);
  },
  name: "App",
  components: {
      AgGridVue, // Add Vue Data Grid component
  },
  methods: {
      async getBoardList() {
          let result = await axios.get(`${ajaxUrl}/bom`)
              .catch(err => console.log(err));
          this.bomList = result.data;
          this.rowData = ref(this.bomList);
          console.log(this.boardList)
      }
  }
};
</script>