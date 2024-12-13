<template>
    <h1>설비 메인 페이지 (예상)</h1>
    <div class="container">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일자</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="i" v-for="(sample, i) in sample_data">
                    <td>{{ sample.no }}</td>
                    <td>{{ sample.title }}</td>
                    <td>{{ sample.writer }}</td>
                    <td>{{ sample.created_date }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    data() {
        return {
            sample_data : []
        };
    }, 
    created() {
        this.sample_fun();
    }, 
    methods : {
        async sample_fun() {
            let result = await axios.get(`${ajaxUrl}/not_sample`)
                                    .catch(err => console.log(err));
            this.sample_data = result.data;
        }
    }
}

</script>