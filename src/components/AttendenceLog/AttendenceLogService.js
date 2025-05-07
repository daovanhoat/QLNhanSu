import { ref, computed } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/attendenceLog'
const APIURL = 'https://localhost:44330/api/user'

export const useAttendenceLog = () => {
  const users = ref([])
  const attendanceLogs = ref([])
  const showModal = ref(false)
  const newAttendence = ref({
    userIds: [],
    fromDate: '',
    toDate: '',
    checkInTime: '08:00',
    checkOutTime: '17:30',
    description: '',
  })
  const selectUserId = ref('')
  const selectedFile = ref(null)

  const isDropdownOpen = ref(false)

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  const selectedUserNames = computed(() => {
    return users.value
      .filter((user) => newAttendence.value.userIds.includes(user.userId))
      .map((user) => user.name)
  })

  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
  }

  const importExcelFile = async () => {
    if (!selectedFile.value) return
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    try {
      const res = await axios.post(`${API}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Cần để nhận về file lỗi (nếu có)
      })

      const contentType = res.headers['content-type']

      if (
        contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      ) {
        // Có lỗi, trả về file lỗi từ backend
        const blob = new Blob([res.data], { type: contentType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Import_Errors.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()

        alert('Import thất bại! Vui lòng kiểm tra file lỗi được tải về.')
      } else {
        // Không có lỗi, import thành công
        alert('Import thành công!')
        await getAttendanceLogs() // Cập nhật lại danh sách nếu cần
      }
    } catch (error) {
      console.error('Import thất bại:', error)
      alert('Lỗi hệ thống khi import!')
    } finally {
      selectedFile.value = null
    }
  }
  const getUsers = async () => {
    const res = await axios.get(APIURL)
    users.value = res.data
    // console.log(res.data)
  }
  const getAttendanceLogs = async () => {
    try {
      const res = await axios.get(API)
      attendanceLogs.value = res.data
      console.log(attendanceLogs)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chấm công:', error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-CA') // '2025-05-02'
  }

  const submitAttendance = async () => {
    const selectedDateFormatted = formatDate(newAttendence.value.fromDate)

    // Kiểm tra trùng ngày
    const duplicateUsers = users.value.filter((user) => {
      return (
        newAttendence.value.userIds.includes(user.userId) &&
        attendanceLogs.value.some((log) => {
          const logDate = formatDate(log.fromDate)
          return (
            log.userId.toString() === user.userId.toString() && logDate === selectedDateFormatted
          )
        })
      )
    })

    if (duplicateUsers.length > 0) {
      const names = duplicateUsers.map((u) => u.name).join(', ')
      alert(`${names} đã chấm công ngày ${selectedDateFormatted}. Vui lòng kiểm tra lại.`)
      return
    }
    // Nếu không trùng thì tiếp tục gửi
    try {
      await axios.post(API, newAttendence.value)
      alert('Chấm công thành công!')
      showModal.value = false
      await getAttendanceLogs()
    } catch (error) {
      console.error('Lỗi khi chấm công:', error)
      alert('Chấm công thất bại, vui lòng thử lại.')
    }
  }

  const deleteAttendence = async (id) => {
    const confirmed = window.confirm('Ban co chac muon xoa')
    if (!confirmed) return

    try {
      await axios.delete(`${API}/${id}`)
      await getAttendanceLogs()
      alert('Xoa thanh cong')
    } catch (err) {
      console.error('Lỗi khi xoá attendence:', err)
      alert('Đã xảy ra lỗi khi xoá công.')
    }
  }

  const filterUser = async () => {
    console.log('Loc duoc nhan')
    console.log('User ID được chọn:', selectUserId.value)
    try {
      const res = await axios.get(`${API}/filter`, {
        params: {
          userId: selectUserId.value,
        },
      })
      console.log(res)
      attendanceLogs.value = res.data
      console.log(attendanceLogs)
    } catch (error) {
      console.error('Lỗi khi lọc theo nhân viên:', error)
      alert('Không thể lọc dữ liệu')
    }
  }

  const reloadFilter = async () => {
    await getAttendanceLogs()
  }

  return {
    attendanceLogs,
    users,
    newAttendence,
    selectUserId,
    selectedFile,
    getAttendanceLogs,
    submitAttendance,
    getUsers,
    showModal,
    deleteAttendence,
    filterUser,
    handleFileChange,
    importExcelFile,
    selectedUserNames,
    toggleDropdown,
    isDropdownOpen,
    reloadFilter,
  }
}
