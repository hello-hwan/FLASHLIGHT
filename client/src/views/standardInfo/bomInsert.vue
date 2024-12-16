<template>
  <div>
    
    <table>
      <h3>BOM등록,수정</h3>
      <tr>
        <th>
          <div class="row g-3 align-items-center">
            <div class="col-auto">
              <label for="inputPassword6" class="col-form-label">품목코드</label>
            </div>
            <div class="col-auto">
              <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
          </div>
        </th>
        <th>
          <div class="row g-3 align-items-center">
            <div class="col-auto">
              <label for="inputPassword6" class="col-form-label">품목명</label>
            </div>
            <div class="col-auto">
              <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
          </div>
        </th>
        <th>
          <div class="row g-1 align-items-center">
            <div class="col-auto">
              <label for="inputPassword6" class="col-form-label">기본생산수량</label>
            </div>
            <div class="col-auto">
              <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
          </div>
        </th>
      </tr>
    </table>

    <table>
      <h3>소요재료</h3>
      <thead>
        <tr>
          <th>소모품목코드</th>
          <th>소모품목명</th>
          <th>규격</th>
          <th>단위</th>
          <th>소모량</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            <div class="row g-1 align-items-center">
              <div class="col-auto">
                <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
              </div>
            </div>
          </th>
          <th>
            <div class="row g-1 align-items-center">
              <div class="col-auto">
                <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
              </div>
            </div>
          </th>
          <th>
            <div class="row g-1 align-items-center">
              <div class="col-auto">
                <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
              </div>
            </div>
          </th>
          <th>
            <div class="row g-1 align-items-center">
              <div class="col-auto">
                <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
              </div>
            </div>
          </th>
          <th>
            <div class="row g-1 align-items-center">
              <div class="col-auto">
                <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
              </div>
            </div>
          </th>
          <th>
            <button type="button" class="btn btn-danger">-</button>
          </th>
          <th>
            <button type="button" class="btn btn-primary">+</button>
          </th>
        </tr>
      </tbody>
    </table>
    

  </div>
</template>

<script>
import { ref } from 'vue';
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
      ]);
  },
  methods: {
      async getbomList() {
          let result = await axios.get(`${ajaxUrl}/bom`)
              .catch(err => console.log(err));
              //console.log(result.data);
          this.bomList = result.data;
          this.rowData = ref(this.bomList);
          console.log(result.data);
          console.log(this.bomList);
      },
    }

};
</script>

<style>
table{
  font-size: 12px;
}
</style>