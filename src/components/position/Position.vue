<template>
  <div class="container-position">
    <h2 class="title">Quản Lý Chức Vụ</h2>

    <!-- Form thêm người dùng -->
    <form @submit.prevent="addPosition" class="form-submit">
      <input v-model="newPosition.name" placeholder="Vi tri" class="input" />
      <input v-model="newPosition.heSo" placeholder="He so luong" class="input" />
      <button type="submit" class="button">Thêm</button>
    </form>
    <!-- Bảng danh sách -->
    <table class="table" style="">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <!-- <th style="padding: 10px; border: 1px solid #dee2e6;">ID</th> -->
          <th class="th">Vị trí</th>
          <th class="th">Hệ số</th>
          <th class="th">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(position, index) in positions" :key="position.positionId" class="tr2">
          <td style="padding: 10px">{{ index + 1 }}</td>
          <!-- <td style="padding: 10px;">{{ position.positionId }}</td> -->
          <td style="padding: 10px">{{ position.name }}</td>
          <td style="padding: 10px">{{ position.heSo }}</td>
          <td style="padding: 10px">
            <button @click="deletePosition(position.positionId)" class="button">Xóa</button>
            <button @click="startEdit(position)" class="button-update">Sửa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal  -->
  <div v-if="editPosition" class="modal-overlay">
    <div class="modal-content">
      <h2 class="h2-modal">Cập nhật thông tin</h2>

      <input v-model="editPosition.name" placeholder="Ten" class="styleObject" />
      <input v-model="editPosition.heSo" placeholder="He So" class="styleObject" type="number" />
      <div class="button-modal">
        <button @click="editPosition = null" class="styleObjectButtin">Hủy</button>
        <button @click="updatePosition" class="styleObjectButtin">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePositionService } from './PositionService'

const {
  positions,
  newPosition,
  editPosition,
  getPosition,
  addPosition,
  deletePosition,
  startEdit,
  updatePosition,
} = usePositionService()

onMounted(() => {
  getPosition()
})
</script>

<style src="./PositionStyle.css"></style>
