import { ref } from 'vue';
import axios from 'axios';

const APIURL = 'https://localhost:44330/api/user'
const SALARYAPI = 'https://localhost:44330/api/salary'
const API_POSITION = 'https://localhost:44330/api/position'

export const useSalaryService = () => {
    const users = ref([])
    const selectedUserId = ref('')
    const selectedUser = ref(null)
    // const selectedHeSo = ref(null)
    const salaryBasic = ref('')
    const salaryResult = ref(null)
    const salaries = ref([])
    const position = ref([]);

    const getUsers = async() => {
        const res = await axios.get(APIURL)
        users.value = res.data
    }
    
    const getPosition = async () => {
        const res = await axios.get(API_POSITION)
        position.value = res.data
    }
    //Laytat ca user co luong
    const getSalaries = async() => {
        const res = await axios.get(SALARYAPI)
        salaries.value = res.data
    }
    //Lay cong cua user duoc chon
    const getCongUser = () => {
        selectedUser.value = users.value.find(u => u.userId === selectedUserId.value)
    }
    
    //Tinh luong cua user
    const tinhLuong = async() => {
        const salaryGrading = salaries.value.some(item => {
            const sameUser = item.userId === selectedUserId.value;
            const ngayCham = new Date(item.createDate);
            const toDay = new Date();
            const dateNumber = (toDay - ngayCham) / (1000 * 60 * 60 * 24)
            return sameUser && dateNumber <= 30;
        });
        if(salaryGrading) {
            alert("Nhân viên này đã chấm công trong 30 ngày");
            return;
        }
        try {
            const res = await axios.post(`${SALARYAPI}/Calculate`, {
                userId: selectedUserId.value,
                salaryBasic: salaryBasic.value
                
            })
    
            salaryResult.value = res.data
            alert("Tính lương thành công")
            getSalaries();
        } catch (error) {
            alert("Lỗi tính lương")
        }
    }
    //Xoa cong user
    const deleteSalary = async(id) => {
        alert('Ban co chac la muon xoa');
        await axios.delete(`${SALARYAPI}/${id}`)
        await getSalaries();
    }

    return {
        users,
        selectedUserId,
        selectedUser,
        salaryBasic,
        salaryResult,
        salaries,
        position,
        getUsers,
        getPosition,
        getSalaries,
        getCongUser,
        tinhLuong,
        deleteSalary
    }
}