<template>
  <div class="childPage">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24" v-if="user !== null">
        <el-card class="box-card">
          <div class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center" style="padding: 20px 0;">
              <img @click="headTc" class="head" :src="headUrl"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属组织机构
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo" v-if="user !== null">
              <userInfo @customSonComponent_close="customSonComponent_close" :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd @customSonComponent_close="customSonComponent_close" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改头像 -->
    <el-dialog
      :title="tc.title"
      v-model="tc.open"
      width="500px" append-to-body>
      <el-form ref="form" :model="form.data" :rules="form.rules" label-width="80px">
        <el-form-item label="您的头像" prop="type">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="getHeadFile"
          >
            <img v-if="tc.imageUrl" :src="tc.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <ButtonThrottle v-model="form.butLoading" style="margin-right: 12px;">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </ButtonThrottle>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import userAvatar from "./userAvatar.vue";
import userInfo from "./userInfo.vue";
import resetPwd from "./resetPwd.vue";
import { getUserProfile, uploadAvatar } from "@/api/systemManage/system/user";
import errorHead from '@/assets/images/common/head.png';

export default {
  name: "Profile",
  components: { userInfo, resetPwd },
  data() {
    return {
      user: null,
      headUrl: null,
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      // 弹窗
      tc: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        imageUrl: undefined,
        avatarfile: undefined,
      },
      // 表单
      form: {
        // 校验
        rules: {
          avatar: [
            { required: true, message: '请选择图片', trigger: 'change' }
          ]
        },
        // 数据
        data: {},
        // 节流阀
        butLoading: false,
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    customSonComponent_close(index, choose) {
      this.$emit('customSonComponent_close', index, choose);
    },

    getUser() {
      getUserProfile().then(res => {
        if (res.code === 200) {
          this.user = res.data;
          const BASEURL = import.meta.env.PUBLIC_API_URL;
          this.headUrl = this.user.avatar && this.user.avatar !== '' && this.user.avatar !== null ? BASEURL + this.user.avatar : errorHead;
          const userinfo = this.$store.getters.userinfo;
          userinfo.avatar = this.headUrl;
          this.$store.commit('SET_userinfo', userinfo);
          this.tc.imageUrl = this.headUrl;
          this.roleGroup = res.roleGroup;
          this.postGroup = res.postGroup;
        }
      });
    },
    // 上传预处理
    getHeadFile(file) {
      if (file.type.indexOf("image/") == -1) {
        this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.tc.imageUrl = reader.result;
          this.tc.avatarfile = file;
        };
      }
      return false;
    },
    // 头像弹窗
    headTc() {
      this.tc.open = true;
      this.tc.title = '修改头像';
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.butLoading = true;
          uploadAvatar({
            avatarfile: this.tc.avatarfile
          }).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.form.butLoading = false;
            this.cancel();
            this.getUser();
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.tc.open = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/rouyi.scss";
  .head{
    width: 120px;
    height: 120px;
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
  }
  .avatar-uploader{
    width: 200px;
    height: 200px;
    border: 1px dashed #eee;
    background-color: #CCC;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .avatar{
      width: 200px;
      height: 200px;
    }
    .avatar-uploader-icon{
      width: 200px;
      height: 200px;
      font-size: 20px;
    }
  }
</style>