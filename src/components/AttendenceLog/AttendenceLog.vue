<template>
  <div class="container1">
    <h2 class="title">Bảng chấm công</h2>

    <!-- Nút mở modal -->
    <div class="content-button">
      <div style="display: flex; gap: 5px">
        <select v-model="selectUserId" style="height: 40px; border-radius: 4px" v-if="role === '1'">
          <option disabled value="">Tất cả nhân viên</option>
          <option v-for="user in users" :key="user.userId" :value="user.userId">
            {{ user.name }}
          </option>
        </select>
        <button class="button-TimeKeep" @click="filterUser" v-if="role === '1'">Lọc</button>
        <button class="button-TimeKeep2" @click="reloadFilter" v-if="role === '1'">
          Tải lại trang
        </button>
      </div>
      <div class="button-right" style="display: flex; gap: 5px">
        <label for="fileInput" class="custom-file-upload-atd" v-if="role === '1'"> Chọn tệp </label>
        <input
          type="file"
          ref="fileInput"
          id="fileInput"
          @change="handleFileChange"
          accept=".xlsx, .xls"
          class="hidden"
        />
        <div v-if="selectedFile" class="file-name">{{ selectedFile.name }}</div>
        <!-- Import sau khi chọn -->
        <button class="import" @click="importExcelFile" v-if="role === '1'">Import</button>
        <button @click="showModal = true" class="button-TimeKeep-Attendence">Chấm công</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" @click="showModal = false">&times;</button>
        <h3>Form chấm công</h3>

        <div class="dropdown-container">
          <div class="dropdown-display" @click="toggleDropdown">
            {{ selectedUserNames.length > 0 ? selectedUserNames.join(', ') : 'Chọn nhân viên' }}
          </div>

          <div v-if="isDropdownOpen" class="dropdown-options">
            <label v-for="user in filteredUsers" :key="user.userId" class="dropdown-option">
              <input type="checkbox" :value="user.userId" v-model="newAttendence.userIds" />
              {{ role === 1 ? user.name : user.userName }}
            </label>
          </div>
        </div>

        <p>
          Nhân viên đã chọn ({{ selectedUserNames.length }}): {{ selectedUserNames.join(', ') }}
        </p>

        <div class="time-inputs">
          <div>
            <label>Từ ngày:</label>
            <input type="date" v-model="newAttendence.fromDate" />
          </div>
          <div>
            <label>Đến ngày:</label>
            <input type="date" v-model="newAttendence.toDate" />
          </div>
        </div>

        <div class="time-inputs">
          <div>
            <label>Giờ vào:</label>
            <input type="time" v-model="newAttendence.checkInTime" />
          </div>
          <div>
            <label>Giờ ra:</label>
            <input type="time" v-model="newAttendence.checkOutTime" />
          </div>
        </div>

        <div class="">
          <label class="block mb-1">Mô tả:</label>
          <textarea
            v-model="newAttendence.description"
            rows="4"
            style="width: 310px"
            placeholder="Nhập mô tả tại đây..."
          ></textarea>
        </div>

        <button @click="submitAttendance" class="chamcong">Chấm công</button>
      </div>
    </div>
    <!-- Bảng danh sách -->
    <table class="table" style="">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <th class="th">Tên nhân viên</th>
          <th class="th">Từ Ngày</th>
          <th class="th">Đến Ngày</th>
          <th class="th">Giờ vào</th>
          <th class="th">Giờ ra</th>
          <th class="th">Tổng công</th>
          <th class="th">Ghi chú</th>
          <th class="th" v-if="role === '1'">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(attendence, index) in attendanceLogs" :key="attendence.id" class="tr2">
          <td style="padding: 10px">{{ index + 1 }}</td>
          <td style="padding: 10px">{{ attendence.userName }}</td>
          <td style="padding: 10px">
            {{ new Date(attendence.fromDate).toLocaleDateString('vi-VN') }}
          </td>
          <td style="padding: 10px">
            {{ new Date(attendence.toDate).toLocaleDateString('vi-VN') }}
          </td>
          <td style="padding: 10px">
            {{
              new Date(attendence.checkInTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </td>
          <td style="padding: 10px">
            {{
              new Date(attendence.checkOutTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </td>
          <td style="padding: 10px">{{ attendence.totalHours }}</td>
          <td style="padding: 10px">{{ attendence.description }}</td>
          <td style="padding: 10px" v-if="role === '1'">
            <button
              @click="deleteAttendence(attendence.id)"
              class="button"
              :disabled="role !== '1'"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useAttendenceLog } from './AttendenceLogService'
// import Multiselect from 'vue-multiselect'
const role = ref('')
const {
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
  filteredUsers,
} = useAttendenceLog()

onMounted(() => {
  role.value = localStorage.getItem('role') || ''
  getAttendanceLogs()
  getUsers()
})
</script>
<style src="./AttendenceLogStyle.css"></style>
