import { LJSbase } from 'ljs-tools';
export default {
  props: {
    modelValue: [String, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示（未使用）
    isShowTip: {
      type: Boolean,
      default: true
    },
    // api接口
    uploadUrl: {
      type: String,
      default: import.meta.env.PUBLIC_API_URL + '/common/upload'
    },
    // 数据格式。若依格式：true；列表格式：false;
    dataType: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: import.meta.env.PUBLIC_API_URL,
      // uploadImgUrl: import.meta.env.PUBLIC_API_URL + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + this.$store.state.token,
      },
      fileList: [],
      apiNumber: 0, // 待执行的请求数
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.modelValue.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {
      const fileName = file.name;
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }

      if (!isImg) {
        this.$modal.msgError(`文件“${fileName}”的格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
        this.$modal.closeLoading();
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传图片“${fileName}”的大小不能超过 ${this.fileSize >= 1 ? `${this.fileSize}MB` : `${this.fileSize * 1024}KB`}!`);
          this.$modal.closeLoading();
          return false;
        }
      }
      this.$modal.loading("正在上传图片，请稍候...");
      this.number++;
      this.apiNumber = this.number;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      this.apiNumber--;
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.fileName });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file) {
      this.updateData();
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.updateData();
        this.$modal.closeLoading();
      }
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, '') + separator;
        }
      }
      return strs != '' ? strs.substring(0, strs.length - 1) : '';
    },
    updateData() {
      // dataType为false时，返回一个子组件监听
      if (!this.dataType) {
        const fileList = [];
        this.fileList.forEach((item) => {
          fileList.push({ name: item.name.replace(this.baseUrl, ''), url: item.url.replace(this.baseUrl, '') });
        });
        this.$emit('getFileList', fileList);
      }
      if (this.apiNumber === 0) {
        this.$emit('update:modelValue', this.listToString(this.fileList));
      }
    },
  }
};