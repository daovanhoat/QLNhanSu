<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Đăng Ký</h2>
      <input v-model="userId" type="text" placeholder="Mã nhân viên" />
      <input v-model="password" type="password" placeholder="Mật khẩu" />
      <input v-model="email" type="email" placeholder="Email" />

      <button @click="register">Đăng ký</button>

      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'

const API = 'https://localhost:44330/api/account/register'

const userId = ref('')
const password = ref('')
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const vali = () => {
  if (userId.value.trim() === '') {
    alert('Mã nhân viên không được để trống')
    return false
  }
  if (password.value.trim() === '') {
    alert('Mật khẩu không được để trống')
    return false
  }
  if (email.value.trim() === '') {
    alert('Email không được để trống')
    return false
  }
  if (!emailPattern.test(email.value.trim())) {
    alert('Email không hợp lệ')
    return false
  }
  return true
}

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  if (vali()) {
    try {
      const res = await axios.post(API, {
        userId: userId.value, // Gửi mã nhân viên
        password: password.value,
        email: email.value,
      })
      successMessage.value = res.data.message || 'Đăng ký thành công!'
      router.push('/login')
    } catch (err) {
      if (err.response && err.response.data) {
        errorMessage.value = err.response.data.message || 'Đăng ký thất bại!'
      } else {
        errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.'
      }
    }
  }
}

onMounted(resetFields)
onBeforeRouteUpdate((to, from, next) => {
  resetFields()
  next()
})

function resetFields() {
  userId.value = ''
  password.value = ''
  email.value = ''
}
</script>

<style src="./RegisterStyle.css">
/* Thêm CSS cho form đăng ký nếu cần */
</style>
