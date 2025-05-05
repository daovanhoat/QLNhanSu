<template>
  <div class="container-department">
    <h2 class="title">Quản Lý Hệ Phòng Ban</h2>

    <!-- Form thêm người dùng -->
    <form @submit.prevent="AddDepartment" class="form-submit">
      <input v-model="newDepartment.name" placeholder="Tên phòng ban" class="input" />
      <button type="submit" class="button">Thêm</button>
    </form>
    <!-- Bảng danh sách -->
    <table class="table" style="">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <th class="th">Tên phòng ban</th>
          <th class="th">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(department, index) in departments" :key="department.departmentId" class="tr2">
          <td style="padding: 10px">{{ index + 1 }}</td>
          <td style="padding: 10px">{{ department.name }}</td>
          <td>
            <button @click="deleteDepartment(department.departmentId)" class="button">Xóa</button>
            <button @click="startEdit(department)" class="button-update">Sửa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="editDepartment" class="modal-overlay">
    <div class="modal-content">
      <h2 class="h2-modal">Cập nhật thông tin</h2>

      <input v-model="editDepartment.name" placeholder="Ten" class="styleObject" />
      <div class="button-modal">
        <button @click="editDepartment = null" class="styleObjectButtin">Hủy</button>
        <button @click="UpdateDepartment" class="styleObjectButtin">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDepartmentService } from './DepartmentService'

const {
  departments,
  newDepartment,
  editDepartment,
  getAll,
  AddDepartment,
  deleteDepartment,
  startEdit,
  UpdateDepartment,
} = useDepartmentService()

onMounted(() => {
  getAll()
})
</script>

<style src="./DepartmentStyle.css"></style>
