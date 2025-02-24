import { LJSbase } from 'ljs-tools';
export default {
  props: {
    modelValue: [Boolean],
    // 弹框title
    title: {
      type: String,
      default: '导入',
    },
    // 下载模板的地址
    downloadUrl: {
      type: String,
    },
    // 下载模板的文件名称
    downloadText: {
      type: String,
      default: '导入模版',
    },
    // 上传的地址
    url: {
      type: String,
    },

    // 上传的地址
    doSomething: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
  },
  data() {
    return {
      // 导入参数
      upload: {
        show: this.modelValue,
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + this.$store.getters.token },
      },
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        this.upload.show = this.modelValue;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      this.download(this.downloadUrl, {
      }, `${this.downloadText}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(res, file, fileList) {
      this.cancel();
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + res.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.doSomething();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    
    cancel() {
      this.upload.show = false;
      this.$emit('update:modelValue', this.upload.show);
    },
  }
};