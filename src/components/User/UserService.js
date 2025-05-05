import { ref } from 'vue'
import axios from 'axios'
import { nextTick } from 'vue'
// import API from '@/service/axiosToken';

const APIURL = 'https://localhost:44330/api/user'
const API_POSITION = 'https://localhost:44330/api/position'
const API_DEPARTMENT = 'https://localhost:44330/api/department'

export const userService = () => {
  const users = ref([])
  const position = ref([])
  const departments = ref([])
  const newUser = ref({
    userId: '',
    name: '',
    gener: '',
    age: 0,
    cong: 0,
    positionId: '',
    departmentId: '',
  })
  const searchKeyWord = ref('')
  const editUser = ref(null)
  const selectedPositionId = ref(null)
  const selectedDepartmentId = ref('')
  const selectedFile = ref(null)
  const fileInput = ref(null)

  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
  }

  const importExcelFile = async () => {
    if (!selectedFile.value) return
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    try {
      const res = await axios.post(`${APIURL}/import`, formData, {
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
        await getUsers() // Cập nhật lại danh sách nếu cần
      }
    } catch (error) {
      console.error('Import thất bại:', error)
      alert('Lỗi hệ thống khi import!')
    } finally {
      selectedFile.value = null
    }
  }

  const vali = () => {
    if (newUser.value.userId.trim() === '') {
      alert('Mã nhân viên không được để trống')
      return false
    }
    const isUserIdExists = users.value.some((user) => user.userId === newUser.value.userId.trim())

    if (isUserIdExists) {
      alert('Mã nhân viên đã tồn tại')
      return false
    }
    if (newUser.value.name.trim() === '') {
      alert('Tên không được để trống')
      return false
    }
    if (newUser.value.gener.trim() === '') {
      alert('Giới tính không được để trống')
      return false
    }
    if (newUser.value.gener !== 'Nam' && newUser.value.gener != 'Nữ') {
      alert('Giới tính phải là Nam hoặc Nữ')
      return false
    }
    if (isNaN(newUser.value.age)) {
      alert('Tuổi không được để trống')
      return false
    }
    if (newUser.value.age < 18 || newUser.value.age > 65) {
      alert('Tuổi phải từ 18 đến 65')
      return false
    }
    if (newUser.value.cong === '') {
      alert('Ngày công không được để trống')
      return false
    }
    if (newUser.value.cong < 25 || newUser.value.cong > 30) {
      alert('Công phải từ 25 đến 30')
      return false
    }
    return true
  }

  //Get
  const getUsers = async () => {
    const res = await axios.get(APIURL)
    users.value = res.data
    console.log(res.data)
  }

  // Get
  const getPosition = async () => {
    const res = await axios.get(API_POSITION)
    position.value = res.data
  }

  const getDepartment = async () => {
    const res = await axios.get(API_DEPARTMENT)
    departments.value = res.data
  }

  // Them
  const addUser = async () => {
    if (vali()) {
      console.log('Validation passed, preparing to add user:', newUser.value)
      try {
        await axios.post(APIURL, newUser.value)
        newUser.value = {
          userId: '',
          name: '',
          gener: '',
          age: 0,
          cong: 0,
          positionId: '',
          departmentId: '',
        }

        await getUsers() // Cập nhật danh sách người dùng
        await nextTick() // Chờ DOM cập nhật xong sau khi render lại

        alert('Thêm thành công') // Hiển thị thông báo sau khi UI đã cập nhật
      } catch (error) {
        console.error('Lỗi khi thêm người dùng:', error)
        alert('Đã xảy ra lỗi khi thêm.')
      }
    }
  }

  // sua
  const startEdit = (users) => {
    editUser.value = { ...users }
    selectedPositionId.value = users.positionId
    selectedDepartmentId.value = users.departmentId
  }

  const updateUser = async () => {
    const confirm = window.confirm('Bạn có chắc muốn sửa?')
    if (!confirm) return

    // Tạo đối tượng cập nhật với PositionId
    const updatedUser = {
      ...editUser.value,
      positionId: selectedPositionId.value, // Gửi ID của vị trí đã chọn
      departmentId: selectedDepartmentId.value,
    }

    try {
      await axios.put(`${APIURL}/${updatedUser.userId}`, updatedUser)
      editUser.value = null // Đặt lại giá trị editUser
      selectedPositionId.value = null // Đặt lại giá trị ID vị trí đã chọn
      selectedDepartmentId.value = null
      await getUsers() // Cập nhật danh sách người dùng
    } catch (error) {
      alert('Lỗi khi cập nhật người dùng: ' + error.message)
    }
  }

  // //Xoa
  const deleteUser = async (id) => {
    const confirmed = window.confirm('Bạn có chắc muốn xoá không?')
    if (!confirmed) return

    try {
      await axios.delete(`${APIURL}/${id}`)
      await getUsers()
      alert('Xoá thành công!')
    } catch (error) {
      console.error('Lỗi khi xoá user:', error)
      alert('Đã xảy ra lỗi khi xoá người dùng.')
    }
  }
  // Tim kiem
  const userSearch = async () => {
    if (searchKeyWord.value.trim() === '') {
      // Nếu không có từ khóa thì gọi lại danh sách tất cả người dùng
      await getUsers()
    } else {
      const res = await axios.get(`${APIURL}/search`, {
        params: {
          keyword: searchKeyWord.value,
        },
      })
      users.value = res.data
    }
  }

  const filterDep = async () => {
    console.log('Lọc được nhấn')
    try {
      const res = await axios.get(`${APIURL}/filter`, {
        params: {
          departmentId: selectedDepartmentId.value,
        },
      })
      users.value = res.data
    } catch (error) {
      console.error('Lỗi khi lọc theo phòng ban:', error)
      alert('Không thể lọc dữ liệu')
    }
  }

  return {
    users,
    position,
    departments,
    newUser,
    searchKeyWord,
    editUser,
    selectedPositionId,
    selectedDepartmentId,
    selectedFile,
    vali,
    getUsers,
    getPosition,
    getDepartment,
    addUser,
    startEdit,
    updateUser,
    deleteUser,
    userSearch,
    filterDep,
    fileInput,
    handleFileChange,
    // triggerFileInput,
    importExcelFile,
  }
}
