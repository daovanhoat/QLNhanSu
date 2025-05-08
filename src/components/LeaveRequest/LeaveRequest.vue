<template>
  <div class="container-department">
    <h2 class="title">Quản Lý Nghỉ phép</h2>

    <div class="handleClick">
      <div style="display: flex; gap: 5px">
        <select
          v-model="filters.userId"
          style="height: 40px; border-radius: 4px"
          v-if="role === '1'"
        >
          <option disabled value="">Tất cả nhân viên</option>
          <option v-for="user in users" :key="user.userId" :value="user.userId">
            {{ user.name }}
          </option>
        </select>
        <button class="button-TimeKeep" @click="searchLeaveRequests" v-if="role === '1'">
          Lọc
        </button>
        <input
          v-model="filters.keyword"
          placeholder="Tìm tên, ca, loại nghỉ..."
          class="input-search"
        />
        <button class="button-search" @click="searchLeaveRequests">Tìm kiếm</button>
        <div class="Filter-date">
          <div>
            <label style="font-weight: bold">Từ ngày:</label>
            <input type="date" v-model="filters.fromDate" class="ipn-Date" />
          </div>
          <div>
            <label style="font-weight: bold">Đến ngày:</label>
            <input type="date" v-model="filters.toDate" class="ipn-Date" />
          </div>
          <button @click="searchLeaveRequests" class="btn-time">Lọc</button>
        </div>
        <button class="button-TimeKeep2" @click="deleteFilter">Tải lại trang</button>
      </div>
      <form @submit.prevent="AddDepartment" class="form-submit">
        <button @click="showModal = true" class="button">Đăng ký xin nghỉ</button>
      </form>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <button class="modal-close" @click="showModal = false">&times;</button>
        <h2>Đăng ký nghỉ phép</h2>

        <label>Nhân viên:</label>
        <select v-model="form.userId">
          <option value="">-- Chọn --</option>
          <option v-for="user in filteredUsers" :value="user.userId">
            {{ role === '1' ? user.name : user.userName }}
          </option>
        </select>

        <label>Loại nghỉ:</label>
        <select v-model="form.leaveType">
          <option value="FullDay">Cả ngày</option>
          <option value="HalfDay">Nửa ngày</option>
          <option value="Hourly">Theo giờ</option>
        </select>

        <!-- Nếu là FullDay: chọn từ ngày đến ngày -->
        <div v-if="form.leaveType === 'FullDay'">
          <label>Ngày bắt đầu nghỉ:</label>
          <input type="date" v-model="form.startDate" />

          <label>Ngày kết thúc nghỉ:</label>
          <input type="date" v-model="form.endDate" />
        </div>

        <!-- Nếu là HalfDay hoặc Hourly: chọn một ngày duy nhất -->
        <div v-else>
          <label>Ngày nghỉ:</label>
          <input type="date" v-model="form.date" />
        </div>

        <div v-if="form.leaveType === 'Hourly'" class="hourly-inputs">
          <label>Giờ bắt đầu:</label>
          <input type="time" v-model="form.startTime" />
          <label>Giờ kết thúc:</label>
          <input type="time" v-model="form.endTime" />
        </div>

        <div v-if="form.leaveType === 'HalfDay'" class="hourly-inputs">
          <label>Chọn ca:</label>
          <select v-model="form.shift">
            <option value="morning">Ca sáng</option>
            <option value="afternoon">Ca chiều</option>
          </select>
        </div>
        <label>Lý do:</label>
        <select v-model="form.reason">
          <option value="Paid">Có tính công</option>
          <option value="Unpaid">Không tính công</option>
          <option value="Annual">Phép năm</option>
        </select>

        <label>Ghi chú:</label>
        <textarea v-model="form.description"></textarea>

        <!-- <p v-if="isDuplicate" class="error">Đã đăng ký nghỉ ngày này!</p> -->

        <div class="modal-actions">
          <button @click="submitLeave" class="btn">Gửi</button>
          <button @click="showModal = false" class="btn cancel">Hủy</button>
        </div>
      </div>
    </div>
    <!-- Danh sách đơn nghỉ -->
    <table class="table">
      <thead>
        <tr class="tr1">
          <th class="th">STT</th>
          <th class="th">Nhân viên</th>
          <th class="th">Ngày</th>
          <th class="th">Loại nghỉ</th>
          <th class="th">Ca nghỉ</th>
          <th class="th">Giờ nghỉ</th>
          <th class="th">Lý do</th>
          <th class="th">Ghi chú</th>
          <th class="th" v-if="role === '1'">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(leave, index) in leaveList" :key="leave.id" class="tr2">
          <td style="padding: 10px">{{ index + 1 }}</td>
          <td style="padding: 10px">{{ leave.userName }}</td>
          <td style="padding: 10px">
            {{ new Date(leave.fromDate).toLocaleDateString('vi-VN') }} -
            {{ new Date(leave.toDate).toLocaleDateString('vi-VN') }}
          </td>
          <td style="padding: 10px">{{ convertType(leave.type) }}</td>
          <td style="padding: 10px">
            <span v-if="typeof leave.shift === 'number'">
              {{ convertShift(leave.shift) }}
            </span>
            <span v-else>-</span>
          </td>
          <td style="padding: 10px">
            <span v-if="leave.fromTime && leave.toTime">
              {{
                new Date('1970-01-01T' + leave.fromTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
              -
              {{
                new Date('1970-01-01T' + leave.toTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
            <span v-else>-</span>
          </td>
          <td style="padding: 10px">{{ convertReason(leave.reason) }}</td>
          <td style="padding: 10px">{{ leave.description }}</td>
          <td style="display: flex; gap: 4px; justify-content: center" v-if="role === '1'">
            <button class="button" @click="deleteLeave(leave.id)">Từ chối</button>

            <!-- Nút duyệt -->
            <button class="button-Approve" @click="approveLeave(leave.id)" v-if="!leave.isApproved">
              Duyệt
            </button>

            <span v-else style="color: green">Đã duyệt</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script src="./LeaveRequestService.js"></script>

<style src="./LeaveRequestStyle.css"></style>
