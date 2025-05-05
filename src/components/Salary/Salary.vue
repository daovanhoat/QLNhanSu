<template>
        <div class="container-total">
            <h2 class="h2-title">Quản lý Tính Lương</h2>

            <!-- Form tính lương -->
            <div class="form-salary">
                <select class="select" v-model="selectedUserId" @change="getCongUser">
                    <option disabled value="">Chọn nhân viên</option>
                    <option v-for="u in users" :key="u.userId" :value="u.userId">{{ u.name }}</option>
                </select>
                <input class="input" type="number" v-model="salaryBasic" placeholder="Lương ngày"/>
                <button class="button" @click="tinhLuong">Tính Lương</button>
            </div>

            <!-- Hiển thị ngày công -->
            <div v-if="selectedUser" class="div-cong">
                <p><strong>Công:</strong> {{ selectedUser.cong }} ngày</p>
            </div>
            <!-- <div v-if="selectedHeSo !== null" style="text-align: center; margin-bottom: 10px;">
                <p><strong>Hệ số lương:</strong> {{ selectedHeSo }}</p>
            </div> -->

            <!-- Kết quả -->
            <div v-if="salaryResult" class="div-result">
                <h3 style="font-weight: bold;">Kết quả:</h3>
                <p><strong>Tên:</strong> {{ salaryResult.user.name }}</p>
                <p><strong>Tổng lương:</strong> {{ salaryResult.totalSalary.toLocaleString() }} VND</p>
                <p><strong>Ngày tính:</strong> {{ new Date(salaryResult.createDate).toLocaleDateString() }}</p>
            </div>

            <!-- Bảng lương -->
            <table class="table">
                <thead class="thead">
                    <tr class="tr1" style="">
                        <th class="th" >User ID</th>
                        <th class="th">Tên</th>
                        <th class="th">Lương Ngày</th>
                        <th class="th">Ngày công</th>
                        <th class="th">Tổng lương</th>
                        <th class="th">Ngày tính</th>
                        <th class="th">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in salaries" :key="item.id" class="tr2">
                        <td style="padding: 10px;">{{ item.userId }}</td>
                        <td>{{ item.userName }}</td>
                        <td>{{ item.salaryBasic.toLocaleString() }}</td>
                        <td>{{ item.workDay }}</td>
                        <td>{{ item.totalSalary.toLocaleString() }}</td>
                        <td>{{ new Date(item.createDate).toLocaleDateString() }}</td>
                        <td>
                            <button class="button" @click="deleteSalary(item.id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSalaryService } from './SalaryService';

const {
    users,
        selectedUserId,
        selectedUser,
        salaryBasic,
        salaryResult,
        salaries,
        position,
        getUsers,
        getPosition,
        getSalaries,
        getCongUser,
        tinhLuong,
        deleteSalary
    } = useSalaryService();

onMounted(() => {
    getUsers(),
    getSalaries(),
    getPosition()
})
</script>

<style src="./SalaryStyle.css"></style>