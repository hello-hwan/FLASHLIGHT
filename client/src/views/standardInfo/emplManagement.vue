<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 75%; font-size: 30px;">
                        사원 관리
                    </th>
                </tr>
            </thead>
        </table>
        <div style="width: 30%; float: left;">
            <table class="table table-hover" style="text-align: center;">
                <thead>
                    <tr>
                        <th>
                            구분
                        </th>
                        <th>
                            내용
                        </th>
                    </tr>
                    <tr>
                        <th>
                            *사원번호
                        </th>
                        <th>
                            <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                type="text" v-model="empl_no" size="10">
                        </th>
                    </tr>
                    <tr>
                        <th>
                            *이름
                        </th>
                        <th>
                            <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                type="text" v-model="empl_name" size="10">
                        </th>
                    </tr>
                    <tr>
                        <th>
                            *비밀번호
                        </th>
                        <th>
                            <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                type="password" v-model="password" size="10">
                        </th>
                    </tr>
                    <tr>
                        <th>
                            *부서명
                        </th>
                        <th>
                            <select class="form-select" aria-label="Default select example" v-model="dept_se"
                                style="width: 150px; margin: auto; text-align: center;">
                                <option value="DP01">영업</option>
                                <option value="DP02">품질</option>
                                <option value="DP03">자재</option>
                                <option value="DP04">물류</option>
                                <option value="DP05">생산</option>
                                <option value="DP06">설비</option>
                                <option value="DP00">관리자</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            부서번호
                        </th>
                        <th>
                            {{ this.dept_se }}
                        </th>
                    </tr>
                    <tr>
                        <th>
                            전화번호
                        </th>
                        <th>
                            <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                type="text" v-model="phone" size="10">
                        </th>
                    </tr>
                    <tr>
                        <th>
                            입사일
                        </th>
                        <th>
                            {{ this.encpn }}
                        </th>
                    </tr>
                    <tr>
                        <th>
                            퇴사일
                        </th>
                        <th>
                            {{ this.retire_day }}
                        </th>
                    </tr>
                    <tr>
                        <th>
                            *권한
                        </th>
                        <th>
                            <select class="form-select" aria-label="Default select example" v-model="author"
                                style="width: 150px; margin: auto; text-align: center;">
                                <option value="AZ02">일반사원</option>
                                <option value="AZ01">관리자</option>
                            </select>
                        </th>
                    </tr>
                </thead>
            </table>
            <div>
                <button type="button" class="btn btn-primary" style="color: white; width: 75px; margin: 10px;"
                    @click="add_btn()">등록</button>
                <button type="button" class="btn btn-info" style="color: black; width: 75px; margin: 10px;"
                    @click="reset_btn()">초기화</button>
            </div>
            <div>
                <button type="button" class="btn btn-warning" style="color: black; width: 75px; margin: 10px;"
                    @click="edit_btn()">수정</button>
                <button type="button" class="btn btn-danger" style="color: white; width: 75px; margin: 10px;"
                    @click="delete_btn()">삭제</button>
            </div>
            <div style="height: 60px; background-color: lightgray; margin-left: auto;" v-show="edit_div">
                <p>아래에 현재 비밀번호를 입력하고 버튼을 누르면 변경됩니다.</p>
                <input style="background-color: lightsteelblue;" type="text" v-model="edit_input" size="9">
                <button type="button" class="btn btn-primary" style="color: white; margin: 2px;"
                    @click="edit_cansle_button()">취소</button>
                <button type="button" class="btn btn-danger" style="color: white; margin: 2px;"
                    @click="real_edit_btn()">변경</button>
            </div>
            <div style="height: 60px; background-color: lightgray; margin-left: auto;" v-show="delete_div">
                <p>아래에 퇴사할 사원번호를 입력하고 버튼을 누르면 퇴사합니다.</p>
                <input style="background-color: lightsteelblue;" type="text" v-model="delete_input" size="9">
                <button type="button" class="btn btn-primary" style="color: white; margin: 2px;"
                    @click="delete_cansle_button()">취소</button>
                <button type="button" class="btn btn-danger" style="color: white; margin: 2px;"
                    @click="real_delete_btn()">퇴사</button>
            </div>
        </div>

        <div style="width: 70%; float: left;">
            <div>
                <table class="table table-hover" style="text-align: center;">
                    <thead>
                        <tr>
                            <th style="width: 16%;">
                                사원번호
                            </th>
                            <th style="width: 16%;">
                                사원명
                            </th>
                            <th style="width: 16%;">
                                전화번호
                            </th>
                            <th style="width: 16%;">
                                직책
                            </th>
                            <th style="width: 16%;">
                            </th>
                            <th style="width: 16%;">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                    type="text" v-model="empl_no_search" size="10">
                            </th>
                            <th>
                                <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                    type="text" v-model="empl_name_search" size="10">
                            </th>
                            <th>
                                <input style="background-color: lightsteelblue; margin: 5px; text-align: center;"
                                    type="text" v-model="phone_search" size="10">
                            </th>
                            <th>
                                <select class="form-select" aria-label="Default select example" v-model="dept_se_search"
                                    style="width: 150px; margin: auto; text-align: center;">
                                    <option value="" selected></option>
                                    <option value="DP01">영업</option>
                                    <option value="DP02">품질</option>
                                    <option value="DP03">자재</option>
                                    <option value="DP04">물류</option>
                                    <option value="DP05">생산</option>
                                    <option value="DP06">설비</option>
                                    <option value="DP00">관리자</option>
                                </select>
                            </th>
                        </tr>
                    </tbody>
                </table>
                <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 525px"
                    @grid-ready="onGridReady" class="ag-theme-alpine">
                </ag-grid-vue>
            </div>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';

import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            empl_no: '',
            empl_name: '',
            password: '',
            dept_se: '',
            phone: '',
            encpn: '',
            retire_day: '',
            author: '',
            rowData: [],
            colDefs: [],
            toast: '',
            empl_no_search: '',
            empl_name_search: '',
            phone_search: '',
            dept_se_search: '',
            edit_div: false,
            edit_input: '',
            delete_div: false,
            delete_input: ''
        }
    },
    created() {
        this.toast = useToast();
        this.getEmplList();
        this.colDefs = [
            { field: "empl_no", headerName: "사원번호" },
            { field: "empl_name", headerName: "사원명" },
            { field: "phone", headerName: "전화번호" },
            { field: "cmmn_name", headerName: "직책" },
            { field: "encpn", headerName: "입사일자" },
            { field: "retire_day", headerName: "퇴사일자" }
        ]
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
            onCellClicked: (CellClickedEvent) => this.goToDetail(CellClickedEvent.data.empl_no)
        };
    },
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        async getEmplList() {
            let result = await axios.get(`${ajaxUrl}/select_all_empl`)
                .catch(err => console.log(err));
            this.rowData = result.data;
            for (let i = 0; i < this.rowData.length; i++) {
                if (this.rowData[i].encpn != null) {
                    this.rowData[i].encpn = useDateUtils.dateFormat(this.rowData[i].encpn, "yyyy-MM-dd");
                } else {
                    this.rowData[i].encpn = '';
                }
                if (this.rowData[i].retire_day != null) {
                    this.rowData[i].retire_day = useDateUtils.dateFormat(this.rowData[i].retire_day, "yyyy-MM-dd");
                } else {
                    this.rowData[i].retire_day = '';
                }
            }
        },
        goToDetail(empl_no) {
            for (let i = 0; i < this.rowData.length; i++) {
                if (this.rowData[i].empl_no == empl_no) {
                    this.empl_no = this.rowData[i].empl_no;
                    this.empl_name = this.rowData[i].empl_name;
                    this.password = this.rowData[i].password;
                    this.dept_se = this.rowData[i].dept_se;
                    this.phone = this.rowData[i].phone;
                    this.encpn = this.rowData[i].encpn;
                    this.retire_day = this.rowData[i].retire_day;
                    this.author = this.rowData[i].author;
                }
            }
        },
        async input_change() {
            let result = await axios.get(`${ajaxUrl}/search_empl/?empl_no_search=${this.empl_no_search}&empl_name_search=${this.empl_name_search}&phone_search=${this.phone_search}&author_selected=${this.dept_se_search}`)
                .catch(err => console.log(err));
            this.rowData = result.data;
        },
        async add_btn() {
            if (this.empl_no.length < 1 || this.password.length < 1 || this.dept_se.length < 1 || this.author.length < 1) {
                this.toast.add({ severity: 'error', summary: '등록 실패', detail: '필수 항목들을 입력해주세요', life: 3000 });
            } else {
                let insert_count = 1;
                for (let i = 0; i < this.rowData.length; i++) {
                    if (this.rowData[i].empl_no == this.empl_no) {
                        insert_count = 0;
                        this.toast.add({ severity: 'error', summary: '등록 실패', detail: '사원 번호가 중복입니다.', life: 3000 });
                        break;
                    }
                }
                if (insert_count == 1) {
                    let insert = [
                        parseInt(this.empl_no),
                        this.empl_name,
                        this.password,
                        this.phone,
                        this.dept_se,
                        this.author
                    ]
                    let result = await axios.post(`${ajaxUrl}/insert_empl`, insert)
                        .catch(err => console.log(err));
                    if (result.data.affectedRows == 1) {
                        this.toast.add({ severity: 'success', summary: '등록 성공', detail: '성공적으로 등록 했습니다.', life: 3000 });
                    }
                    this.getEmplList();
                }
            }
        },
        reset_btn() {
            this.empl_no = '';
            this.empl_name = '';
            this.password = '';
            this.dept_se = '';
            this.phone = '';
            this.encpn = '';
            this.retire_day = '';
            this.author = '';
        },
        edit_btn() {
            this.edit_div = true;
        },
        edit_cansle_button() {
            this.edit_input = '';
            this.edit_div = false;
        },
        async real_edit_btn() {
            let result = await axios.get(`${ajaxUrl}/search_pw/${this.empl_no}`)
            if (this.edit_input == result.data.password) {
                let list = [
                    parseInt(this.empl_no),
                    this.empl_name,
                    this.password,
                    this.phone,
                    this.dept_se,
                    this.author,
                    parseInt(this.empl_no)
                ]
                let result = await axios.put(`${ajaxUrl}/update_empl`, list)
                this.toast.add({ severity: 'success', summary: '수정 성공', detail: '성공적으로 수정 했습니다.', life: 3000 });
                this.getEmplList();
            } else {
                this.edit_input = '';
                this.toast.add({ severity: 'error', summary: '수정 실패', detail: '비밀번호가 다릅니다.', life: 3000 });
            }
        },
        delete_btn() {
            this.delete_div = true;
        },
        delete_cansle_button() {
            this.delete_input = '';
            this.delete_div = false;
        },
        async real_delete_btn() {
            let delete_count = 1;
            for (let i = 0; i < this.rowData.length; i++) {
                if (this.rowData[i].empl_no == this.delete_input) {
                    delete_count = 0;
                    break;
                }
                if (i == this.rowData.length - 1) {
                    this.toast.add({ severity: 'error', summary: '실행 실패', detail: '사원번호를 찾을 수 없습니다.', life: 3000 });
                }
            }
            if (delete_count == 0) {
                let result = await axios.put(`${ajaxUrl}/delete_empl/${this.empl_no}`)
                this.toast.add({ severity: 'success', summary: '퇴사 완료', detail: '성공적으로 퇴사 처리 했습니다.', life: 3000 });
            }
        }
    },
    watch: {
        empl_no_search: function () {
            this.input_change()
        },
        empl_name_search: function () {
            this.input_change()
        },
        phone_search: function () {
            this.input_change()
        },
        dept_se_search: function () {
            this.input_change()
        }
    }
}
</script>