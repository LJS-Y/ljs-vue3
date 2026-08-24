
export default {
  data() {
    return {
      // 字典
      // carbon_source_income: [],
      win_h: 0,
      profileUploadList: [],
      files: [],
    };
  },
  created() {
    this.init();
  },
  methods: {

    init() {
      this.win_h = document.body.offsetHeight - 114;
      this.initData();
    },
    // 初始化数据
    async initData() {
      this.files = [
        {
          name: '测试word_20250429090820A003.docx',
          url: 'http://localhost:8080/profile/upload/2025/04/29/测试word_20250429090820A003.docx'
        },
        {
          name: '测试word_20250429090820A001.pdf',
          url: 'http://localhost:8080/profile/upload/2025/04/29/测试word_20250429090820A001.pdf'
        },
        {
          name: '附件资料_20250429090820A002.zip',
          url: 'http://localhost:8080/profile/upload/2025/04/29/附件资料_20250429090820A002.zip'
        },
        {
          name: '头像.jpg',
          url: 'http://localhost:8080/profile/upload/2025/04/29/头像.jpg'
        },
        {
          name: 'ccbf92b490253439f0dff3cc48a8bbab.mp4',
          url: 'http://localhost:8080/profile/upload/2025/04/29/ccbf92b490253439f0dff3cc48a8bbab.mp4'
        },
        {
          name: '银川市人民政府办公室关于印发《银川市加快推进新型工业化若干措施》的通知.pdf',
          url: 'http://36.1.52.13:8314/api/unauthorized/file?id=3dafc179834b4ad0997d8cba5829c6bb.pdf'
        }
      ]
    },
    
  }
};