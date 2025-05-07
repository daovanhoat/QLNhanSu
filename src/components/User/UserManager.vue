<template>
  <div class="content">
    <h2 class="h2">Quản Lý Nhân Sự</h2>

    <!-- Form thêm người dùng -->
    <form class="form" @submit.prevent="addUser">
      <input
        type="text"
        v-model="newUser.userId"
        placeholder="Mã NV (VD: NV01)"
        class="input"
        style="width: 30px"
      />
      <input v-model="newUser.name" placeholder="Tên" class="input" />
      <select v-model="newUser.gener" class="input">
        <option disabled value="">Chọn giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>
      <label for="fileInput" class="custom-file-button">Chọn ảnh đại diện</label>
      <input type="file" id="fileInput" @change="handleFileChangeAvatar" />
      <!-- <div v-if="users" class="file-name">{{ users.values.avatar }}</div> -->
      <input v-model="newUser.age" placeholder="Tuổi" type="number" class="input" />
      <input v-model="newUser.cong" placeholder="Công" type="number" class="input" />
      <select v-model="newUser.positionId" class="input">
        <option disabled value="">Chọn vị trí</option>
        <option v-for="pos in position" :key="pos.positionId" :value="pos.positionId">
          {{ pos.name }}
        </option>
      </select>
      <select v-model="newUser.departmentId" class="input">
        <option disabled value="">Chọn phòng ban</option>
        <option
          v-for="depart in departments"
          :key="depart.departmentId"
          :value="depart.departmentId"
        >
          {{ depart.name }}
        </option>
      </select>
      <button class="button" type="submit">Thêm</button>
    </form>

    <!-- Ô tìm kiếm -->
    <div class="search">
      <input v-model="searchKeyWord" placeholder="Tìm kiếm tên người dùng..." class="input" />
      <button class="button" @click="userSearch">Tìm kiếm</button>
    </div>
    <div class="search">
      <select v-model="selectedDepartmentId">
        <option disabled value="">Tất cả phòng ban</option>
        <option v-for="dep in departments" :key="dep.departmentId" :value="dep.departmentId">
          {{ dep.name }}
        </option>
      </select>
      <button class="button" @click="filterDep">Lọc</button>
      <label for="fileInput" class="custom-file-upload"> Chọn tệp </label>
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
      <button class="button bg-green-500 text-white px-4 py-2 rounded" @click="importExcelFile">
        Import
      </button>
    </div>

    <!-- Bảng danh sách -->
    <table class="table">
      <thead>
        <tr class="tr1">
          <th class="th">ID</th>
          <th class="th">Tên</th>
          <th class="th">Hình ảnh</th>
          <th class="th">Phòng ban</th>
          <th class="th">Chức vụ</th>
          <th class="th">Tuổi</th>
          <th class="th">Giới tính</th>
          <th class="th">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId" class="tr2">
          <td class="td">{{ user.userId }}</td>
          <td class="td">{{ user.name }}</td>
          <td>
            <img
              :src="'https://localhost:44330' + user.avatar"
              alt="Avatar"
              width="60"
              height="60"
              style="border-radius: 30px"
            />
          </td>
          <td class="td">{{ user.departmentName }}</td>
          <td class="td">{{ user.positionName }}</td>
          <td class="td">{{ user.age }}</td>
          <td class="td">{{ user.gener }}</td>
          <td class="td">
            <button class="button-delete" @click="deleteUser(user.userId)">Xóa</button>
            <button class="button-edit" @click="startEdit(user)">Sửa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal  -->
  <div v-if="editUser" class="modal-overlay">
    <div class="modal-content">
      <h2 class="h2-modal">Cập nhật thông tin</h2>

      <input v-model="editUser.name" placeholder="Ten" class="styleObject1" />
      <input v-model="editUser.gener" placeholder="Gioi tinh" class="styleObject1" />
      <input v-model="editUser.age" placeholder="Tuoi" type="number" class="styleObject1" />
      <input v-model="editUser.cong" placeholder="cong" type="number" class="styleObject1" />
      <input type="file" @change="handleFileChangeAvatar" />
      <img
        v-if="avatarBase64"
        :src="
          avatarBase64.startsWith('data:') ? avatarBase64 : 'https://localhost:44330' + avatarBase64
        "
        alt="Avatar"
        style="width: 100px; height: 100px; border-radius: 50px"
      />

      <!-- Nếu chưa chọn ảnh mới, hiển thị ảnh cũ từ server -->
      <select v-model="selectedPositionId" class="styleObject1">
        <option disabled value="">Chọn Vị trí</option>
        <option v-for="pos in position" :key="pos.positionId" :value="pos.positionId">
          {{ pos.name }}
        </option>
      </select>
      <select v-model="selectedDepartmentId" class="styleObject1">
        <option disabled value="">Chọn phòng ban</option>
        <option
          v-for="partment in departments"
          :key="partment.departmentId"
          :value="partment.departmentId"
        >
          {{ partment.name }}
        </option>
      </select>
      <div class="div-button">
        <button @click="editUser = null" class="styleObjectButtin">Hủy</button>
        <button @click="updateUser" class="styleObjectButtin">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { userService } from './UserService'

const {
  users,
  position,
  departments,
  newUser,
  searchKeyWord,
  editUser,
  selectedPositionId,
  selectedDepartmentId,
  selectedFile,
  avatarBase64,
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
  importExcelFile,
  handleFileChangeAvatar,
} = userService()

onMounted(() => {
  getUsers()
  getPosition()
  getDepartment()
})
</script>

<style src="./UserStyle.css"></style>
