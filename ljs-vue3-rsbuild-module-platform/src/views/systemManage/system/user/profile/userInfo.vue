<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" maxlength="30" />
    </el-form-item> 
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio value="0">男</el-radio>
        <el-radio value="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <ButtonThrottle v-model="user.butLoading" style="margin-right: 12px;">
        <el-button type="primary" @click="submit">保存</el-button>
      </ButtonThrottle>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile, getUserProfile } from "@/api/systemManage/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.user.butLoading = false;
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.user.butLoading = true;
          updateUserProfile(this.user).then(res => {
            if (res.code === 200) {
              this.$modal.msgSuccess("修改成功");
              this.getUser();
            }
            this.user.butLoading = false;
          });
        }
      });
    },
    getUser() {
      getUserProfile().then(res => {
        if (res.code === 200) {
          const user = res.data;
          const userinfo = this.$store.getters.userinfo;
          userinfo.nickName = user.nickName;
          userinfo.phonenumber = user.phonenumber;
          userinfo.email = user.email;
          userinfo.sex = user.sex;
          this.$store.commit('SET_userinfo', userinfo);
        }
      });
    },
    close() {
      const menuOpenList = this.$store.getters.menuOpenList;
      const menuNowOpen = this.$store.getters.menuNowOpen;
      let index = undefined;
      const nums = menuOpenList.length;
      for (let i = 0; i < nums; i++) {
        const item = menuOpenList[i];
        if (item.url === menuNowOpen.url) {
          index = i;
          break;
        }
      }
      if (index) {
        this.$emit('customSonComponent_close', index, true);
      }
    }
  }
};
</script>
