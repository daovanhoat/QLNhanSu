import { ref } from "vue";
import axios from "axios";

const API = "https://localhost:44330/api/workingInfo"

export const useWorkingInfoService = () => {
    const workingInfos = ref([]);
    const filterUser = ref({
        userId: ''
    })
    const selectedUserId = ref('')

    const getWorkingInfo = async () => {
        const res = await axios.get(API);
        workingInfos.value = res.data;
    }

    const filterUserWorkingInfo = async () => {
        console.log("Lọc được nhấn")
        try {
          const res = await axios.get(`${API}/filter`, {
            params: {
                userId: selectedUserId.value
            }
          });
          workingInfos.value = res.data;
        } catch (error) {
          console.error("Lỗi khi lọc theo nhan vien:", error);
          alert("Không thể lọc dữ liệu");
        }
      }

    return {
        workingInfos,
        filterUser,
        selectedUserId,
        getWorkingInfo,
        filterUserWorkingInfo
    }
}