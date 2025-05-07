<template>
  <div class="container-workingInfo">
    <h2 class="title">Lịch sử công việc</h2>

    <div class="searchWorking">
      <select v-model="selectedUserId">
        <option disabled value="">Chọn nhân viên</option>
        <option v-for="working in workingInfos" :key="working.userId" :value="working.userId">
          {{ working.user }}
        </option>
      </select>
      <button class="button" @click="filterUserWorkingInfo">Lọc</button>
      <button class="button-TimeKeep2" @click="reloadFilter">Tải lại trang</button>
    </div>

    <!-- Bảng danh sách -->
    <table class="table" style="">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <!-- <th style="padding: 10px; border: 1px solid #dee2e6;">ID</th> -->
          <th class="th">Tên</th>
          <th class="th">Chức vụ</th>
          <th class="th">Phòng ban</th>
          <th class="th">Thời gian</th>
          <th class="th">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(workingInfo, index) in workingInfos"
          :key="workingInfo.workingInfoId"
          class="tr2"
        >
          <td style="padding: 10px">{{ index + 1 }}</td>
          <td style="padding: 10px">{{ workingInfo.user }}</td>
          <td style="padding: 10px">{{ workingInfo.position }}</td>
          <td style="padding: 10px">{{ workingInfo.department }}</td>
          <td style="padding: 10px">
            {{ new Date(workingInfo.time).toLocaleDateString('vi-VN') }}
            -
            {{
              workingInfo.endDate
                ? new Date(workingInfo.endDate).toLocaleDateString('vi-VN')
                : 'Đang làm'
            }}
          </td>
          <td style="padding: 10px">
            <button @click="deleteAccount(account.accountId)" class="button">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useWorkingInfoService } from './workingInfoService'

const {
  workingInfos,
  filterUser,
  selectedUserId,
  getWorkingInfo,
  filterUserWorkingInfo,
  reloadFilter,
} = useWorkingInfoService()

onMounted(() => {
  getWorkingInfo()
})
</script>
<style src="./workingInfoStyle.css"></style>
