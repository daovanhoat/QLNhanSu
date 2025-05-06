import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const showModal = ref(false)
    const users = ref([])
    const leaveList = ref([])
    const filters = ref({
      fromDate: '',
      toDate: '',
      keyword: '',
      userId: '',
    })
    const form = ref({
      userId: '', // gán ID người dùng tương ứng
      date: '',
      leaveType: 'FullDay',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      shift: 0,
      reason: 0,
      description: '',
    })

    const API = 'https://localhost:44330/api/leavequest'

    const convertType = (type) => {
      switch (type) {
        case 0:
          return 'Nghỉ cả ngày'
        case 1:
          return 'Nghỉ nửa ngày'
        case 2:
          return 'Nghỉ theo giờ'
        default:
          return 'Không xác định'
      }
    }

    const convertReason = (type) => {
      switch (type) {
        case 0:
          return 'có tính công'
        case 1:
          return 'không tính công'
        case 2:
          return 'Nghỉ phép nắm'
        default:
          return 'Không xác định'
      }
    }

    const convertShift = (type) => {
      switch (type) {
        case 0:
          return 'Ca sáng'
        case 1:
          return 'Ca chiều'
        default:
          return ''
      }
    }

    onMounted(async () => {
      await getUsers()
      await getLeaves()
    })

    const getUsers = async () => {
      const res = await axios.get('https://localhost:44330/api/user')
      users.value = res.data
    }

    const getLeaves = async () => {
      const res = await axios.get(API)
      leaveList.value = res.data
    }

    const isDuplicateDate = () => {
      const leaveType = form.value.leaveType

      // Ngày cần kiểm tra trùng
      const start = leaveType === 'FullDay' ? form.value.startDate : form.value.date
      const end = leaveType === 'FullDay' ? form.value.endDate : form.value.date

      // Duyệt danh sách nghỉ đã có
      return leaveList.value.some((leave) => {
        const leaveStart = leave.fromDate?.substring(0, 10) // YYYY-MM-DD
        const leaveEnd = leave.toDate?.substring(0, 10)

        const formStart = new Date(start).toISOString().substring(0, 10)
        const formEnd = new Date(end).toISOString().substring(0, 10)

        return (
          leave.userId === form.value.userId &&
          ((formStart >= leaveStart && formStart <= leaveEnd) ||
            (formEnd >= leaveStart && formEnd <= leaveEnd))
        )
      })
    }

    const submitLeave = async () => {
      const leaveType = form.value.leaveType
      const reasonMap = {
        Paid: 0,
        Unpaid: 1,
        Annual: 2,
      }

      const typeMap = {
        FullDay: 0,
        HalfDay: 1,
        Hourly: 2,
      }

      const typeShift = {
        morning: 0,
        afternoon: 1,
      }
      // kiểm tra ngày đã nghỉ nếu đăng ký trùng ngày
      if (isDuplicateDate()) {
        alert('Ngày nghỉ đã được đăng ký trước đó!')
        return
      }

      // Kiểm tra chung
      if (!form.value.userId || !form.value.date || !form.value.leaveType || !form.value.reason) {
        alert('Vui lòng nhập đầy đủ thông tin!')
        return
      }

      if (leaveType === 'FullDay') {
        if (!form.value.startDate || !form.value.endDate) {
          alert('Vui lòng chọn ngày bắt đầu và kết thúc!')
          return
        }
      }
      // Kiểm tra theo loại nghỉ
      if (leaveType === 'Hourly') {
        if (!form.value.startTime || !form.value.endTime) {
          alert('Vui lòng chọn giờ bắt đầu và kết thúc!')
          return
        }
        if (form.value.startTime >= form.value.endTime) {
          alert('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!')
          return
        }
      }

      if (leaveType === 'HalfDay' && !form.value.shift) {
        alert('Vui lòng chọn ca nghỉ!')
        return
      }

      const payload = {
        userId: form.value.userId,
        userName: '',
        fromDate:
          leaveType === 'FullDay'
            ? new Date(form.value.startDate).toISOString()
            : new Date(form.value.date).toISOString(),

        toDate:
          leaveType === 'FullDay'
            ? new Date(form.value.endDate).toISOString()
            : new Date(form.value.date).toISOString(),

        fromTime: leaveType === 'Hourly' ? form.value.startTime : null,
        toTime: leaveType === 'Hourly' ? form.value.endTime : null,
        type: typeMap[leaveType],
        reason: reasonMap[form.value.reason],
        shift: leaveType === 'HalfDay' ? typeShift[form.value.shift] : null,
        description: form.value.description,
        createdAt: new Date().toISOString(),
        isApproved: false,
      }

      console.log('Show payload ' + payload.shift)
      try {
        await axios.post('https://localhost:44330/api/leavequest', payload)
        alert('Đăng ký thành công!')
        showModal.value = false
        await getLeaves()
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu nghỉ phép:', error)
        alert('Đăng ký thất bại, vui lòng thử lại.')
      }
    }

    const deleteLeave = async (id) => {
      const confirmed = window.confirm('Ban co chac muon tu choi yeu cau nay')
      if (!confirmed) return
      try {
        await axios.post(`${API}/${id}`)
        await getLeaves()
        alert('Xoa thanh cong')
      } catch (err) {
        console.error('Lỗi khi xoá leave:', err)
        alert('Đã xảy ra lỗi khi xoá công.')
      }
    }
    const deleteFilter = async () => {
      await getLeaves()
    }

    const approveLeave = async (id) => {
      const confirmed = window.confirm('Bạn có chắc muốn duyệt đơn này không?')
      if (!confirmed) return

      try {
        await axios.post(`${API}/approve/${id}`)
        alert('Đã duyệt đơn nghỉ!')
        await getLeaves() // refresh lại danh sách
      } catch (error) {
        console.error('Lỗi khi duyệt đơn nghỉ:', error)
        alert('Không thể duyệt đơn nghỉ. Vui lòng thử lại.')
      }
    }

    const searchLeaveRequests = async () => {
      try {
        const res = await axios.get(API, {
          params: {
            userId: filters.value.userId || null,
            fromDate: filters.value.fromDate || null,
            toDate: filters.value.toDate || null,
            keyword: filters.value.keyword || null,
          },
        })
        leaveList.value = res.data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nghỉ phép:', error)
      }
    }

    return {
      showModal,
      users,
      leaveList,
      form,
      filters,
      convertShift,
      submitLeave,
      convertType,
      convertReason,
      deleteLeave,
      isDuplicateDate,
      deleteFilter,
      approveLeave,
      searchLeaveRequests,
    }
  },
}
