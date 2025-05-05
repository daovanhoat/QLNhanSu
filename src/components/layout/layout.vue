<template>
  <div style="display: flex; height: 100vh">
    <!-- Sidebar -->
    <div
      style="
        width: 300px;
        background-color: #f0f0f0;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px">
        <h3 style="font-weight: bold; font-size: 28px; margin: 0">ADMIN</h3>
      </div>
      <div
        style="
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
        "
      >
        <span style="font-size: 18px">👤 {{ username }}</span>
        <button
          @click="logout"
          @mouseover="hover = true"
          @mouseleave="hover = false"
          :style="logoutButtonStyle"
        >
          Đăng xuất
        </button>
      </div>
      <router-link to="/nhansu" class="nav-link" :style="linkStyle('/nhansu')">Nhân Sự</router-link>
      <router-link to="/luong" class="nav-link" :style="linkStyle('/luong')">Lương</router-link>
      <router-link to="/heso" class="nav-link" :style="linkStyle('/heso')">Chức vụ</router-link>
      <router-link to="/department" class="nav-link" :style="linkStyle('/department')"
        >Phòng ban</router-link
      >
      <router-link to="/workingInfo" class="nav-link" :style="linkStyle('/workingInfo')"
        >Lịch sử công việc</router-link
      >
      <router-link to="/attendencelog" class="nav-link" :style="linkStyle('/attendencelog')"
        >Quản lý chấm công</router-link
      >
      <router-link to="/leaverequest" class="nav-link" :style="linkStyle('/leaverequest')"
        >Đăng ký xin nghỉ</router-link
      >
      <router-link to="/account" class="nav-link" :style="linkStyle('/account')"
        >Tài khoản</router-link
      >
    </div>

    <!-- Main Content -->
    <div style="flex: 1; padding-top: 30px; background-color: #f9f9f9; overflow-y: auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const username = ref('')
const hover = ref(false)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.userName) {
    username.value = user.userName
  }
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

// Style khi hover
const logoutButtonStyle = computed(() => ({
  backgroundColor: hover.value ? '#4CAF50' : '#800080', // Xanh nhẹ khi hover, tím mặc định
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  width: '90px',
  height: '35px',
}))

const linkStyle = (path) => {
  const isActive = route.path === path
  return {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: isActive ? '#007bff' : '#e0e0e0',
    color: isActive ? 'white' : 'black',
    textAlign: 'center',
    textDecoration: 'none',
  }
}
</script>
