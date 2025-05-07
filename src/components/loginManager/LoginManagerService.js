import { ref } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/account'

export const useLoginManager = () => {
  const accounts = ref([])

  //   const getAccount = async () => {
  //     var res = await axios.get(API)
  //     accounts.value = res.data
  //   }

  const getAccount = async () => {
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) return (window.location.href = '/login')
    try {
      // Gửi yêu cầu API với token trong header Authorization
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      accounts.value = res.data
    } catch (error) {
      // Xử lý lỗi có thể log lỗi hoặc thông báo người dùng
      if (error.response) {
        // Nếu có lỗi từ server, ví dụ 401 Unauthorized
        console.error('API Error:', error.response.status, error.response.data)
        if (error.response.status === 401) {
          alert('Bạn cần đăng nhập lại.')
          // Chuyển hướng tới trang login
          window.location.href = '/login'
        }
      } else {
        // Nếu không phải lỗi từ server (e.g., lỗi mạng)
        console.error('Network Error:', error.message)
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    }
  }

  //Xóa tài khoản
  const deleteAccount = async (id) => {
    alert('Ban co chac muon xoa')
    await axios.delete(`${API}/${id}`)
    await getAccount()
  }

  return {
    accounts,
    getAccount,
    deleteAccount,
  }
}
