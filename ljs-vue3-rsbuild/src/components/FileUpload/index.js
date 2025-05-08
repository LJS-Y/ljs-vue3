
export default {
  props: {
    modelValue: [String, Array],
    // 文件数量限制
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
      default: () => ['doc', 'docx', 'xlsx', 'rar', 'zip', 'pdf', 'png', 'jpg', 'jpeg'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 上传调用的接口
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
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      baseUrl: import.meta.env.PUBLIC_API_URL,
      // uploadImgUrl: import.meta.env.PUBLIC_API_URL + '/common/upload', // 上传的文件服务器地址
      headers: {
        Authorization: 'Bearer ' + this.$store.state.token,
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
            if (typeof item === 'string') {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.$LJSurl.getFileName(item), url: this.baseUrl + item };
              } else {
                item = { name: this.$LJSurl.getFileName(item), url: item };
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
        let fileExtension = '';
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf('image') > -1;
      }
      if (!isImg) {
        this.$modal.msgError(`文件“${fileName}”的格式不正确, 请上传${this.fileType.join('/')}文件格式文件!`);
        this.$modal.closeLoading();
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`文件“${fileName}”的大小不能超过 ${this.fileSize} MB!`);
          this.$modal.closeLoading();
          return false;
        }
      }
      this.$modal.loading('正在上传文件，请稍候...');
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
        const resFile = { name: res.originalFilename, url: res.fileName , fullUrl: res.url };
        this.uploadList.push(resFile);
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDelete(file) {
      const nums = this.fileList.length;
      for (let i = 0; i < nums; i++) {
        const item = this.fileList[i];
        if (file.url === item.url) {
          this.fileList.splice(i, 1);
          break;
        }
      }
      this.updateData();
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError('上传文件失败，请重试');
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
      const type = this.$LJSbase.getFileType(file.url);
      if (type === '.png' || type === '.jpg' || type === '.jpeg') {
        this.dialogImageUrl = import.meta.env.PUBLIC_API_URL + file.url;
        this.dialogVisible = true;
      } else {
        this.$run.goExternalUrl(file.url)
      }
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
          fileList.push({
            name: item.name.replace(this.baseUrl, ''),
            url: item.url.replace(this.baseUrl, ''),
            fullUrl: item.fullUrl
          });
        });
        this.$emit('getFileList', fileList);
      }
      if (this.apiNumber === 0) {
        this.$emit('update:modelValue', this.listToString(this.fileList));
      }
    },
  }
};