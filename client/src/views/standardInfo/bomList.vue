<template>
    <h1>BOM조회</h1>
  <div>
    <AgGridVue style="width: 800px; height: 400px;"
            :rowData="rowData"
            :columnDefs="colDefs"
            :rowSelection="rowSelection"
            @cellClicked="onCellClicked"
            class="ag-theme-alpine">
        </AgGridVue>
  </div>

  <h1>BOM상세조회</h1>
  <div>
    <AgGridVue style="width: 1000px; height: 400px;"
            :rowData="rowData2"
            :columnDefs="colDefs2"
            class="ag-theme-alpine">
        </AgGridVue>
  </div>
  
</template>

<script>
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
          bomListInfo: [],
          rowData2: '',
          colDefs2: ''
      };
  },
  created() {
      this.getbomList();
      this.colDefs = ([
          { field: "bom_code", headerName:"BOM코드" },
          { field: "prdlst_code", headerName:"제품코드" },
          { field: "prdist_name", headerName:"제품명" },
          { field: "prdctn_qy", headerName:"기본생산수량" },
      ])
      this.getbomListInfo();
      this.colDefs2 = ([
          { field: "bom_code", headerName:"소모품코드" },
          { field: "cmpds_prdlst_name", headerName:"소모품명" },
          { field: "stndrd_y", headerName:"규격" },
          { field: "unit", headerName:"단위" },
          { field: "cnsum_count", headerName:"소모량" },
      ])
  }, 
  name: "App",
  components: {
      AgGridVue, // Add Vue Data Grid component
  },
  methods: {
    onCellClicked(event) {
        this.selectedBomCode = event.data.bom_code; // 선택된 BOM 코드 저장
        // console.log(`선택된 BOM 코드: ${this.selectedBomCode}`);
        // 필요한 로직을 추가적으로 실행
        this.getbomListInfo(this.selectedBomCode);
    },
      async getbomList() {
          let result = await axios.get(`${ajaxUrl}/bom`)
              .catch(err => console.log(err));
          this.bomList = result.data;
          this.rowData = this.bomList;
      },
      async getbomListInfo(bomCode) {
          let result = await axios.get(`${ajaxUrl}/bom/${bomCode}`)
              .catch(err => console.log(err));
          this.bomListInfo = result.data;
          this.rowData2 = this.bomListInfo;
      },
  }
};
</script>