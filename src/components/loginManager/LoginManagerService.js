import { ref } from "vue";
import axios from "axios";

const API = "https://localhost:44330/api/account";

export const useLoginManager = () => {
    const accounts = ref([])

    const getAccount = async () => {
        var res = await axios.get(API)
        accounts.value = res.data
    }

    //Xóa tài khoản
    const deleteAccount = async (id) => {
        alert("Ban co chac muon xoa");
        await axios.delete(`${API}/${id}`)
        await getAccount()
    }

    return {
        accounts,
        getAccount,
        deleteAccount
    }

}