import { ref } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/workingInfo/working-info'

export const useWorkingInfoService = () => {
  const workingInfos = ref([])
  const filterUser = ref({
    userId: '',
  })
  const selectedUserId = ref('')

  const getWorkingInfo = async () => {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    workingInfos.value = res.data
  }

  const filterUserWorkingInfo = async () => {
    console.log('Lọc được nhấn')
    try {
      const res = await axios.get(`${API}/filter`, {
        params: {
          userId: selectedUserId.value,
        },
      })
      workingInfos.value = res.data
    } catch (error) {
      console.error('Lỗi khi lọc theo nhan vien:', error)
      alert('Không thể lọc dữ liệu')
    }
  }

  const reloadFilter = async () => {
    await getWorkingInfo()
  }

  return {
    workingInfos,
    filterUser,
    selectedUserId,
    getWorkingInfo,
    filterUserWorkingInfo,
    reloadFilter,
  }
}
