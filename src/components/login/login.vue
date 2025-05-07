<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Đăng Nhập</h2>
      <input v-model="loginUsername" type="text" placeholder="Tên người dùng" />
      <input v-model="loginPassword" type="password" placeholder="Mật khẩu" />
      <p style="color: red">
        Bạn chưa có tài khoản?
        <router-link to="/register" style="margin-left: 50px">Đăng ký</router-link>
      </p>
      <button @click="LoginAccount">Đăng nhập</button>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const API = 'https://localhost:44330/api/account'

const loginUsername = ref('')
const loginPassword = ref('')
const router = useRouter()
const errorMessage = ref('')

const LoginAccount = async () => {
  try {
    const res = await axios.post(`${API}/login`, {
      userName: loginUsername.value,
      password: loginPassword.value,
    })
    const { token, username } = res.data

    // Lưu token và tên người dùng vào localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    localStorage.setItem('user', JSON.stringify(res.data))
    router.push('/nhansu')
    console.log('Đăng nhập thành công')
    errorMessage.value = '' // reset thông báo lỗi nếu có
  } catch (err) {
    errorMessage.value = 'Đăng nhập thất bại, vui lòng kiểm tra lại'
  }
}
</script>
<style src="./LoginStyle.css"></style>
