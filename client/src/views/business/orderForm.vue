<template>
    <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
                주문 요청
            </span>
        </template>
    </v-card>

    <v-container fluid style="position:relative; z-index: 1;">
        <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
                <div class="row g-3 align-items-center">
                    <!-- <div class="col-2">
                        <label for="orderFormMtltyCode" class="col-form-label" >업체코드</label>
                    </div>
                    <div class="col-auto">
                        <bfSearchCompanyModal @companySelectedData="getBFCompanyInfo"  />
                    </div> -->
                    <bfSearchCompanyModal @companySelectedData="getBFCompanyInfo" style="margin:0px; padding: 0px;" />
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormOrderDate" class="col-form-label">주문일자</label>
                    </div>
                    <div class="col-auto">
                        <input type="date" id="orderFormOrderDate" class="form-control" v-model="this.requst.order_date" placeholder="2024-12-28">
                    </div>
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormDete" class="col-form-label">납품일자</label>
                    </div>
                    <div class="col-auto">
                        <input type="date" id="orderFormDete" class="form-control" v-model="this.requst.dete" placeholder="2025-08-17">
                    </div>
                    <div class="col-auto">
                        <span class="form-text">
                        2024-00-00
                        </span>
                    </div>
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormOrderNo" class="col-form-label">주문번호</label>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="orderFormOrderNo" class="form-control" v-model="this.requst.order_no" disabled>
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <button type="button" class="btn btn-success" @click="orderInsert()" style="color:white;">주문등록</button>
                    <button type="button" class="btn btn-warning" @click="onInsertInit()" >초기화</button>
                    <button type="button" class="btn btn-danger orderRowInsert" @click="deleteBtn()" style="color:white;">선택행삭제</button>
                    <button type="button" class="btn btn-success orderRowInsert" @click="modalOpen2()" style="color:white;">행추가</button>
                </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
    <v-card-text class="bg-surface-light pt-4" style="position: relative; z-index:0;">
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 519px; position:relative; z-index:0;" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady" rowSelection="multiple" >
        </ag-grid-vue>
    </div>
    </v-card-text>

    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>제품 코드</span>
                        <InputText type="text" v-model="this.searchProductCode" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductCode }}</p></InputText>
                        <span>제품 명</span>
                        <InputText type="text" v-model="this.searchProductName" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductName }}</p></InputText>
                    </div>
                    <button @click="searchProduct"class="btn btn-primary search-btn" >조회</button>
                </div>
    
                <AgGridVue 
                    :rowData="rowData2"
                    :gridOptions="GridOptions2"
                    class="ag-theme-alpine"
                    style="height: 500px"
                    @grid-ready="onGridReady2"
                    rowSelection="multiple"
                >
                </AgGridVue>
    
                <div class="modal-btn">
                    <button @click="modalOpen2"class="btn btn-secondary">닫기</button>
                    <button @click="selectOrder2" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import userDateUtils from '@/utils/useDates.js';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import bfSearchCompanyModal from '@/components/business/businessSearchCompanyModal.vue';

import store from '@/store'
import { useStore } from 'vuex';

import { useToast } from 'primevue/usetoast';

export default {
    data() { 
        return { 
            orderList: [], 
            rowData: ref([]), 
            rowData2 : ref([]),
            colDefs: '',
            colDefs2:'', 
            requst:{}, 
            companyCode: '', 
            searchProductCode:'', 
            searchProductName:'', 
            modalCheck2 : false, 
            index : 0,
            empName : store.state.empInfo[store.state.empInfo.length - 1].name,
            toast : useToast()
        }; 
    }, 
    created() { 
        
        console.log('------------', useStore());
        this.getOrderListNo();
        // this.onAddRow(); 
        this.colDefs = ref([ 
            { field: "index", hide: true, suppressToolPanel: true},
            { field: "prd_code", headerName:"품목코드", checkboxSelection: true /*, onCellClicked:() => {
                this.modalOpen2();
                //this.$refs.bsProduct.modalCheck=ref(true);
            } */}, 
            { field: "prd_name", headerName:"품목이름" /*, onCellClicked:() => {
                this.modalOpen2();
                //this.$refs.bsProduct.modalCheck=ref(true);
            } */}, 
            { field: "untpc", headerName:"주문단가", editable: true }, 
            { field: "order_qy", headerName:"주문수량", editable: true }, 
            { field: "wrter", headerName:"작성자", editable: true } 
        ]);
        this.gridOptionsOrder = { 
                columnDefs: this.colDefs, 
                pagination: true, 
                paginationPageSize: 10, 
                paginationPageSizeSelector: [10, 20, 50, 100], 
                paginateChildRows: true, 
                animateRows: false, 
                filter: 'agTextColumnFilter', 
                defaultColDef: { 
                    filter: true, 
                    flex: 1, 
                    minWidth: 10 
                } 
        }; 
        this.colDefs2 = [
            { field: "prdlst_code", headerName: "제품코드"},
            { field: "prdlst_name", headerName: " 제품이름"},
            { headerName : "선택",  checkboxSelection: true, flex:0.3}];
        this.GridOptions2 = {
            columnDefs: this.colDefs2,
            animateRows: false,
            pagination: true,
            paginationPageSize: 10,
            paginationPageSizeSelector: [10, 20, 50, 100],
        };
    }, 
    name: "App", 
    components: { 
        AgGridVue, // Add Vue Data Grid component
        bfSearchCompanyModal
    }, 
    methods: { 
        onGridReady(params) { 
            this.gridApi = params.api; 
            this.columnApi = params.columnApi; 
        }, 
        onGridReady2(params) { 
            this.gridApi2 = params.api; 
            this.columnApi2 = params.columnApi; 
        }, 
        async orderInsert() { 
            for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                console.log("합친결과는"); 
                console.log(orderRegister); 
                let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                             .catch(err=>console.log(err)); 
                console.log("결과는", result); 
            } 
            this.toast.add({ severity: 'success', summary: '등록', detail: '등록성공', life: 3000 });
        }, 
        customDateFormat1(params){
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd');
        },
        customDateFormat2(params){
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd');
        },
        selectOrder2 () {
            console.log(this.$store.empInfo);
            //console.log('오더폼 데이터',this.gridApi.getSelectedNodes());
            this.modalOpen2();
            //console.log('선택된 제품 값',this.gridApi2.getSelectedNodes());
            const selectedNodes = this.gridApi2.getSelectedNodes();
            const productSelectedData = selectedNodes.map((node) => node.data);
            if(productSelectedData[0] != null){
                console.log('모달에서 선택된 행 데이터:', productSelectedData[0].prdlst_code);
                let rowCount = this.rowData.find(data => data.prd_code == productSelectedData[0].prdlst_code);
                if(rowCount == null && productSelectedData[0].prdlst_code != null){
                    let newData = {
                        index: this.index,
                        prd_code:productSelectedData[0].prdlst_code, 
                        prd_name:productSelectedData[0].prdlst_name, 
                        untpc: 0, 
                        order_qy: 0,
                        wrter: this.empName
                    };
                    this.index = this.index + 1;
                    console.log('뉴데이터값은',newData);
                    this.rowData = [...this.rowData, newData];
                    console.log(this.rowData);
                } else {
                    this.toast.add({ severity: 'warn', summary: '실패', detail: '제품코드가 중복입니다.', life: 3000 });
                }
            } else {
                this.toast.add({ severity: 'warn', summary: '실패', detail: '제품이 선택되지 않았습니다.', life: 3000 });
            }
        },
        deleteBtn(){ 
            const selectedNodes = this.gridApi.getSelectedNodes(); 
            console.log(selectedNodes);
            for (let i = 0 ; i < selectedNodes.length ; i ++){ 
                let result_arr = []; 
                console.log(selectedNodes[i].data.index); 
                for(let j = 0 ; j < this.rowData.length; j++){ 
                    if(this.rowData[j].index == selectedNodes[i].data.index){ 
                        continue; 
                    } 
                    result_arr = [...result_arr,this.rowData[j]]; 
                } 
                this.rowData=result_arr; 
            } 
        },
        onInsertInit(){
            this.requst = {
                p_code : "", 
                order_date :"2024-12-28", 
                dete : "2025-08-17", 
                order_no : this.requst.order_no
            };
        }, 
        getBFCompanyInfo(info){
            this.requst.p_code = info[0].bcnc_code;
        },
        async getOrderListNo(){
            let list = await axios.get(`${ajaxUrl}/business/orderArray`)
                                      .catch(err=>console.log(err));
            console.log(list.data);
            let orderNoArray = list.data.map(x => x.order_no.substr(6));
            orderNoArray.sort((a,b) => b-a);
            this.requst.order_no = 'ORDER-' + ( orderNoArray[0] - 1 + 2 );
            console.log(this.requst.order_no);
        },
        modalOpen2 () {
            this.modalCheck2 = !this.modalCheck2;
            console.log(this.modalCheck2);
                //행 데이터 초기화
                this.rowData2 = [];
    
                //검색조건 초기화
                this.searchProductCode = null;
                this.searchProductName = null;
        },
        //모달 발주건을 선택하고 확인버튼 클릭
        async searchProduct ()  {
            //서버로 보낼 검색 데이터
            let obj = {product_code: this.searchProductCode,
                    product_name: this.searchProductName
            };
            //console.log("새로만든 객체: ",obj);
            let result = await axios.post(`${ajaxUrl}/business/searchProduct`, obj)
                                    .catch(err=>console.log(err));

            //console.log("통신결과: ",result);
            //행 데이터 담기
            this.rowData2 = result.data;   
        }
    }
};
</script>

<style scoped>
/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3;
}
/* modal or popup */
.modal-container {
    position: relative;
    top: 53%;
    left: 61%;
    transform: translate(-50%, -50%);
    width: 60%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.modal-btn button {
    line-height: 1.1;
    margin: 10px 0;
}
.align-left{
    margin: 10px 0;
}
.align-left>span {
    margin-left: 20px;
}
.search-btn {
    margin: 10px;
    line-height: 1.1;
}
#search-bar {
    padding: 27px;
    padding-bottom: 0px;
    background-color: #e3e3e3;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}
.orderRowInsert{
     float: right;
}
input {
    width: 220px;
}
button{
    margin-left : 5px;
    margin-right: 5px;
    line-height: 15px;
}
</style>