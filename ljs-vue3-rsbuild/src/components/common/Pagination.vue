<!--
 * @Author: ljs
 * @LastEditors: ljs
 * @description: ?
 * @updateInfo: 内容:
 * @Date: 2023-08-01 11:29:02
-->
<template>
  <div class="pagination">
    <!-- 表格左下角注释文字 -->
    <div class="note">{{ note }}</div>
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    // 移动端页码按钮的数量端默认值5
    pagerCount: {
      type: Number,
      default: document.body.clientWidth < 992 ? 5 : 7
    },
    layout: {
      type: String,
      default: 'prev, pager, next, sizes, total'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    note: {
      type: String,
      default: ''
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleSizeChange(val) {
      if (this.currentPage * val > this.total) {
        this.currentPage = 1
      }
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        // scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        // scrollTo(0, 800)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  :deep(.el-pagination.is-background .btn-next) {
    background-color: #fff;
    border: 1px solid #e6ecf2;
  }
  :deep(.el-pagination.is-background .btn-prev) {
    background-color: #fff;
    border: 1px solid #e6ecf2;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    color: #60769c;
    text-align: left;
    line-height: 22px;
  }
  .note{
    max-width: 400px;
    font-size: 12px;
    color: #A84815;
  }
}
</style>
