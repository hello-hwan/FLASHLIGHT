<template>
    <table class="table table-hover">
           <thead>
               <tr>
                   <th style="width: 70%; font-size: 30px;">
                       품질입고검사
                   </th>
               </tr>
           </thead>
       </table>  
       
   <div class="container">
       <v-container fluid>
            <v-row>
               <!-- 검색 필드 -->
                   <v-col cols="12">
                       <v-card class="mx-auto" style="border-radius: 13px;">
                            <v-card-text class="bg-surface-light pt-4">

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">발주번호</label>
               </div>
               <div class="col-auto">
                   <input type="number" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="mt_no">
               </div> 
               <div class="col-auto">
                   <span class="form-text">
                       <search-modal @selectedData="getOrderDetails"/>        
                   </span>                    
               </div>         
           </div>

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">자재코드</label>
               </div>
               <div class="col-auto">
                   <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="mtr_code">
               </div>              
           </div>

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">자재명</label>
               </div>
               <div class="col-auto">
                   <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="mtr_name">
               </div>               
           </div>

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">거래처코드</label>
               </div>
               <div class="col-auto">
                   <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="bc_code">
               </div>           
           </div>    
   
           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">거래처명</label>
               </div>
               <div class="col-auto">
                   <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="bc_name">
               </div>               
           </div>

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">발주량</label>
               </div>
               <div class="col-auto">
                   <input type="number" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="ord_num">
               </div>                
           </div>                     

           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">사원번호</label>
               </div>
               <div class="col-auto">
                   <input type="number" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="empl_no">
               </div>           
           </div>    
           
           <div class="row g-3 align-items-center">
               <div class="col-1">
                   <label for="inputPassword6" class="col-form-label">합격량</label>
               </div>
               <div class="col-auto">
                   <input type="number" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="pass_num">
               </div>           
          </div>          
   
   <div style="margin-top: 30px">
       <ag-grid-vue :rowData="rowData" 
            :columnDefs="colDefs" 
           :gridOptions="gridOptions" style="height: 500px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
       </ag-grid-vue>            
   </div>        

                </v-card-text>
           </v-card>
       </v-col>
   </v-row>
</v-container>
</div>
   
   <div style="margin-top: 30px">    
       <button type="button" class="btn btn-primary" @click="quailtyInsert()">등록</button>
       <button type="button" class="btn btn-warning" @click="onInit()">초기화</button>    
   </div>

   
   </template>
   
   <script>
   import { ref } from 'vue';
   import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
   import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
   import SearchModal from '@/components/materials/orderControlModal.vue';
   ModuleRegistry.registerModules([AllCommunityModule]);    
   import axios from 'axios';
   import { ajaxUrl } from '@/utils/commons.js';
   
   export default {
       name: "App",
       components: {
           SearchModal,
           AgGridVue, // Add Vue Data Grid component
        },
       data() {
           return {            
               rowData: [],
               colDefs: [],
               mt_num :'', //큰그릇
               mt_no: '', // 발주번호
               mtr_code:'', //자재코드
               mtr_name:'', //자재명
               bc_code:'', //거래처코드
               bc_name:'', //거래처명
               ord_num:'', //발주량
               inspec_date:'', //검사일자
               mtl_code:'', //품질검사코드
               empl_no:'',//사원번호
               pass_num:'', //합격량
               mt_num2:''
         
           };
       },
       created() {        
           this.colDefs =ref([
               { field: "inspec_item",headerName: "검사항목"},
               { field: "inspec_standard",headerName : "검사기준"},
               { field: "error_amount",headerName : "불량량",editable : true},
               { field: "p_result",headerName : "제품검사결과",editable : true ,cellEditor: 'agSelectCellEditor', cellEditorParams: {values: ['합격','불합격'],}} 
           ]);
   
           this.gridOptions = {
               columnDefs: this.orderColDefs,
               pagination: true,
               paginationPageSize: 10,
               paginationPageSizeSelector: [10, 20, 50, 100],
               paginateChildRows: true,
               animateRows: false,
               defaultColDef: {
                   filter: true,
                   flex: 1,
                   minWidth: 10
               },
           };
       },    
    
       methods: {
           async getmt_no() {
               let result = await axios.get(`${ajaxUrl}/quality/order_request?mt_info=${this.mt_no}`)
                                       .catch(err => console.log(err));

               this.mt_num = result.data;
               this.bc_name=this.mt_num.mtlty_name; //거래처명
               this.bc_code=this.mt_num.bcnc_code; //거래처코드
               this.mtr_name=this.mt_num.mtril_name; //자재명
               this.mtr_code=this.mt_num.mtril_code; //자재코드=품목코드
               this.ord_num=this.mt_num.order_qy; //발주량=입고수량
               
               
               let result2 = await axios.get(`${ajaxUrl}/quality/inspec_item?in_info=${this.mtr_code}`)
                                        .catch(err => console.log(err)); 
               this.mt_num2 = result2.data;
               this.rowData = ref(this.mt_num2)         
                         
                                   
           },
          
           async quailtyInsert(){
               let inspect = [
                   "",//품질검사코드
                   this.mtr_code,//자재코드
                   this.mtr_name, //자재명
                   this.ord_num, //발주량=입고수량                   
                   this.bc_name,//거래처명
                   this.empl_no,//사원번호
                   this.pass_num,//합격량                   
                   this.mt_no, //발주번호
                   this.bc_code//거래처코드                                                      
               ];
               
               let obj = {
                   inspect : inspect,
                   check : this.rowData

               }
               console.log(obj);
               let result3 = await axios.post(`${ajaxUrl}/quality/quailtyInsert`, obj)
                                        .catch(err => console.log(err));

               let addRes = result3.data;
               console.log(addRes);
                 
           },
           async getOrderDetails (info) {
               this.mt_no = info[0].order_no;
               this.getmt_no();
           },
           onInit(){ //초기화기능
               this.mt_no= "", // 발주번호
               this.mtr_code="", //자재코드
               this.mtr_name="", //자재명
               this.bc_code="", //거래처코드
               this.bc_name="", //거래처명
               this.ord_num="", //발주량               
               this.empl_no="",//사원번호
               this.pass_num="", //합격량 
               this.rowData= [] //내용
           },

           async onGridReady() {}
            }
   };
   
   </script>
  
   