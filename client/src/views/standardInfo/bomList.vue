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
      this.getbomList();
      this.colDefs = ref([
          { field: "bom_code", headerName:"BOM코드" },
          { field: "prdlst_code", headerName:"제품코드" },
          { field: "prdist_name", headerName:"제품명" },
          { field: "prdctn_qy", headerName:"기본생산수량" },
          { field: "상세보기", headerNaem:"상세보기", cellRenderer: () => {
          return `<button>상세보기</button>`;
        }
    }
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
          console.log(this.bomList);
          console.log(this.bomList[0]);
      }
  }
};
</script>