<template>
  <div class="container-LoginManager">
    <h2 class="title">Quản Lý Tài Khoản</h2>
    <div class="content-button-Register">
      <button @click="showModal = true" class="button-TimeKeep-LogInManager">
        Đăng ký tài khoản
      </button>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" @click="showModal = false">&times;</button>
        <h3>Form đăng ký tài khoản</h3>

        <div class="dropdown-container">
          <div class="dropdown-display" @click="toggleDropdown">
            <!-- {{ selectedUserNames.length > 0 ? selectedUserNames.join(', ') : 'Chọn nhân viên' }} -->
          </div>

          <div v-if="isDropdownOpen" class="dropdown-options">
            <label v-for="user in filteredUsers" :key="user.userId" class="dropdown-option">
              <input type="checkbox" :value="user.userId" v-model="newAttendence.userIds" />
              <!-- {{ role === 1 ? user.name : user.userName }} -->
            </label>
          </div>
        </div>
        <button @click="RegisterAccount" class="Register">Đăng ký</button>
      </div>
    </div>
    <!-- Bảng danh sách -->
    <table class="table" style="">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <!-- <th style="padding: 10px; border: 1px solid #dee2e6;">ID</th> -->
          <th class="th">Tên tài khoản</th>
          <th class="th">Password</th>
          <th class="th">Email</th>
          <th class="th">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="account.accountId" class="tr2">
          <td style="padding: 10px">{{ index + 1 }}</td>
          <!-- <td style="padding: 10px;">{{ position.positionId }}</td> -->
          <td style="padding: 10px">{{ account.userName }}</td>
          <td style="padding: 10px">{{ account.password ? '*******' : '' }}</td>
          <td style="padding: 10px">{{ account.email }}</td>
          <td style="padding: 10px">
            <button @click="deleteAccount(account.accountId)" class="button">Xóa</button>
            <button @click="startEdit(position)" class="button-update">Sửa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useLoginManager } from './LoginManagerService'

const {
  accounts,
  isDropdownOpen,
  showModal,
  getAccount,
  deleteAccount,
  toggleDropdown,
  RegisterAccount,
} = useLoginManager()

onMounted(() => {
  getAccount()
})
</script>
<style src="./LonginManagerStyle.css"></style>
