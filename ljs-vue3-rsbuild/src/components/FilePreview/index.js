// 在线预览PDF的插件打包为2.45Mb，占用资源。非必要不引入
// import VuePdfEmbed, { useVuePdfEmbed } from 'vue-pdf-embed';
export default {
  components: {
    // VuePdfEmbed
  },
  props: {
    // 文件数组
    files: {
      type: Array
    },
    // 文件名称字数
    fileNameNumber: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      tc: {
        title: '',
        open: false,
        fileType: 'other', // 文件类型
        // pdf
        pdf: {
          data: null,
          page: 0,
          pageSize: 1,
          total: 0
        },
      }
    };
  },
  methods: {
    initPdf() {
      this.tc.pdf.total = this.tc.pdf.data.numPages;
      if (this.tc.pdf.total > 0) {
        this.tc.pdf.page = 1;
      }
      this.$store.commit('loadingStore', {
        tag: false,
        text: '加载中....'
      });
    },
    pdfNext(obj) {
      this.tc.pdf.page = obj.page;
    },

    tcOpen(item) {
      this.tc.title = `预览 - ${item.name}`;
      this.tc.row = item;
      this.tc.fileType = this.getType(this.$LJSurl.getFileType(item.url));
      if (this.tc.fileType === 'pdf') {
        this.$store.commit('loadingStore', {
          tag: true,
          text: '加载中....'
        });
        const { doc } = useVuePdfEmbed({ source: item.url });
        this.tc.pdf.data = doc;
      }
      this.tc.open = true;
    },
    getType(type) {
      switch (type) {
        case '.png':
        case '.jpg':
        case '.jpeg ':
        case '.gif':
        case '.jpg':
          return 'image';
        case '.pdf':
          return 'pdf';
        case '.mp4':
          return 'video';
        case '.doc':
        case '.docx':
          return 'word';
      }
      return 'other';
    },
  }
};