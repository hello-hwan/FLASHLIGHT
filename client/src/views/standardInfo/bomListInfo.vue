<template>
  <div>
    <AgGridVue style="width: 1000px; height: 400px;"
            :rowData="rowData"
            :columnDefs="colDefs"
            class="ag-theme-alpine">
        </AgGridVue>
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
          bomListInfo: [],
          rowData: '',
          colDefs: '',
      };
  },
  props: ["params"],
  created() {
      this.getbomListInfo([]);
      this.colDefs = ref([
          { field: "b.prdlst_code", headerName:"제품코드" },
          { field: "b.prdist_name", headerName:"제품명" },
          { field: "b.prdctn_qy" },
          { field: "bc.cmpds_no" },
          { field: "bc.cmpds_prdlst_name" },
          { field: "bc.stndrd_y" },
          { field: "bc.unit" },
          { field: "bc.cnsum_count" }
      ]);
      let bomCode = this.$route.params.bomCode;
      this.getbomListInfo(bomCode);
  }, 
  name: "App",
  components: {
      AgGridVue, // Add Vue Data Grid component
  },
  methods: {
      async getbomListInfo(bomCode) {
          let result = await axios.get(`${ajaxUrl}/bom/${bomCode}`)
              .catch(err => console.log(err));
              console.log(result.data);
          this.bomListInfo = result.data;
          this.rowData = ref(this.bomListInfo);
          console.log(this.params.data.bom_code);
          console.log(this.$route.params);
      }
  }
};
</script>