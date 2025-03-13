
export default {
  props: {
    // 距离底部的距离
    bottom: {
      type: String,
      default: '1.75rem'
    },
  },
  data() {
    return {
      copyrightName: import.meta.env.PUBLIC_COMPANY_OWNER,
      copyright: import.meta.env.PUBLIC_RECORD_NUMBER,
    };
  },
  methods: {
  }
};