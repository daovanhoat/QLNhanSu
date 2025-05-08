import { ref } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/workingInfo/working-info'
const APIFIL = 'https://localhost:44330/api/workingInfo'

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
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(`${APIFIL}/filter`, {
        params: {
          userId: selectedUserId.value,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
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
