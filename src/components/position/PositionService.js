import { ref } from 'vue'
import axios from 'axios'

const API = 'https://localhost:44330/api/position'

export const usePositionService = () => {
  const positions = ref([])
  const newPosition = ref({ name: '', heSo: 0 })
  const editPosition = ref(null)

  const getPosition = async () => {
    var res = await axios.get(API)
    positions.value = res.data
  }

  const addPosition = async () => {
    try {
      await axios.post(API, newPosition.value)
      newPosition.value = {
        name: '',
        heSo: 0,
      }

      await getPosition()
    } catch (error) {
      alert('Loi khong them duoc')
    }
  }
  //xóa position
  const deletePosition = async (id) => {
    alert('Ban co chac muon xoa')
    await axios.delete(`${API}/${id}`)
    await getPosition()
  }

  //map thong tin can sua vao modal
  const startEdit = (positions) => {
    editPosition.value = { ...positions }
  }
  //Ham sua
  const updatePosition = async () => {
    const confirm = window.confirm('Ban co chac muon sua')
    if (!confirm) return
    await axios.put(`${API}/${editPosition.value.positionId}`, editPosition.value)
    editPosition.value = null
    await getPosition()
  }

  return {
    positions,
    newPosition,
    editPosition,
    getPosition,
    addPosition,
    deletePosition,
    startEdit,
    updatePosition,
  }
}
