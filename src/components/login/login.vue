<template>
  <div class="login-container" :style="backgroundStyle">
    <div class="login-box">
      <h2>Đăng Nhập</h2>
      <input v-model="loginUsername" type="text" placeholder="Tên người dùng" />
      <input v-model="loginPassword" type="password" placeholder="Mật khẩu" />
      <!-- <p style="color: red">
        Bạn chưa có tài khoản?
        <router-link to="/register" style="margin-left: 50px">Đăng ký</router-link>
      </p> -->
      <button @click="LoginAccount">Đăng nhập</button>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const API = 'https://localhost:44330/api/account'

const loginUsername = ref('')
const loginPassword = ref('')
const router = useRouter()
const errorMessage = ref('')
const selectedBackground = ref('')

const backgroundImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759',
  'https://images.unsplash.com/photo-1698006150156-3779d5c2306c?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

const LoginAccount = async () => {
  try {
    const res = await axios.post(`${API}/login`, {
      userName: loginUsername.value,
      password: loginPassword.value,
    })
    const { token, username, role } = res.data
    // Lưu token và tên người dùng vào localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    localStorage.setItem('role', role)
    localStorage.setItem('user', JSON.stringify(res.data))
    if (role === 1) {
      router.push('/nhansu')
    } else {
      router.push('/workingInfo')
    }
    console.log('Đăng nhập thành công')
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = 'Đăng nhập thất bại, vui lòng kiểm tra lại'
  }
}
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length)
  selectedBackground.value = backgroundImages[randomIndex]
})
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url('${selectedBackground.value}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
</script>
<style src="./LoginStyle.css"></style>
