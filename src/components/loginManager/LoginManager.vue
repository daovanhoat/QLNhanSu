<template>
  <div class="container-LoginManager">
    <h2 class="title">Quản Lý Tài Khoản</h2>

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

const { accounts, getAccount, deleteAccount } = useLoginManager()

onMounted(() => {
  getAccount()
})
</script>
<style src="./LonginManagerStyle.css"></style>
