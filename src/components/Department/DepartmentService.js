import { ref } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/department'

export const useDepartmentService = () => {
  const departments = ref([])
  const newDepartment = ref({ name: '' })
  const editDepartment = ref(null)

  const getAll = async () => {
    var res = await axios.get(API)
    departments.value = res.data
  }

  const vali = () => {
    if (newDepartment.value.name.trim() === '') {
      alert('Ten khong duoc de trong')
      return false
    }
    return true
  }

  const AddDepartment = async () => {
    if (vali()) {
      try {
        await axios.post(API, newDepartment.value)
        newDepartment.value = {
          name: '',
        }

        await getAll()
      } catch (error) {
        alert('Loi khong them duoc')
      }
    }
  }

  const deleteDepartment = async (id) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa phòng ban không')
    if (!confirmed) return

    try {
      await axios.delete(`${API}/${id}`)
      await getAll()
    } catch (err) {
      console.error('Lỗi khi xóa phòng ban', err)
      alert('Lỗi khi xóa người dùng')
    }
  }

  const startEdit = (departments) => {
    editDepartment.value = { ...departments }
  }

  const UpdateDepartment = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn sửa')
    if (!confirmed) return
    try {
      await axios.put(`${API}/${editDepartment.value.departmentId}`, editDepartment.value)
      editDepartment.value = null
      await getAll()
    } catch (err) {
      console.error('Lỗi khi sửa phòng ban', err)
      alert('Lỗi khi sửa người dùng')
    }
  }

  return {
    departments,
    newDepartment,
    editDepartment,
    getAll,
    AddDepartment,
    deleteDepartment,
    startEdit,
    UpdateDepartment,
  }
}
