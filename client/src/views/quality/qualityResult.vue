<template>
    <div class="businessOrderListTitle">
            입고품질검사
    </div>     
    <div class="container">
            <div class="row g-3 align-items-center">
                <div class="col-1">
                    <label for="inputPassword6" class="col-form-label">발주번호</label>
                </div>
                <div class="col-auto">
                    <input type="number" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="mt_no">
                </div> 
                <div class="col-auto">
                    <span class="form-text">
                        <button type="button" class="btn btn-xs btn-info" @click="getmt_no()">검색</button>
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
                    <label for="inputPassword6" class="col-form-label">검사일자</label>
                </div>
                <div class="col-auto">
                    <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="inspec_date">
                </div>           
            </div>        

            <div class="row g-3 align-items-center">
                <div class="col-1">
                    <label for="inputPassword6" class="col-form-label">품질검사코드</label>
                </div>
                <div class="col-auto">
                    <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="mtl_code">
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
            
            
    </div>
    <div class="businessOrderListTitle">
            검사상세항목
    </div>     
    
    
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
                @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
    </div>
    
    <div>
    
        <button type="button" class="btn btn-primary" @click="quailtyInsert()">등록</button>
        <button type="button" class="btn btn-warning">초기화</button>
    
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
        name: "App",
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
                { field: "error_amount",headerName : "불량량",editable : true} 

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
        components: {
            AgGridVue, // Add Vue Data Grid component
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
                //console.log(result2);                         
                this.mt_num2 = result2.data;
                //console.log(this.mtr_code);

                //console.log(this.mt_num);
                //let res = result.data;
                //console.lg(reos.bcnc_code);  
                
                                    
            },
            async quailtyInsert(){
                let obj = [
                    this.mtl_code,//품질검사코드
                    this.mtr_code,//자재코드
                    this.mtr_name, //자재명
                    this.ord_num, //발주량=입고수량                   
                    this.bc_name,//거래처명
                    this.empl_no,//사원번호
                    this.pass_num,//합격량                   
                    this.mt_no, //발주번호
                    this.bc_code//거래처코드
                                                      
                ];
                
                console.log(obj);
                let result3 = await axios.post(`${ajaxUrl}/quality/quailtyInsert`, obj)
                                         .catch(err => console.log(err));

                let addRes = result3.data;
                console.log(addRes);
                
                /*
                if(addRes.quailty_no > 0){
                    alert('등록되었습니다.');
                    this.mt_no = addRes.quailty_no;
                }
            */              
            } 
            
        }
    };
    
    </script>
   
    