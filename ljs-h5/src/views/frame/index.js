export default {
  name: "Index",
  data() {
    return {
      win_w: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.win_w = document.body.offsetWidth;
    },
    
  }
};