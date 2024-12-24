<!--
 * @Author: ljs
 * @LastEditors: ljs
 * @description: ?
 * @updateInfo: 内容:
 * @Date: 2023-08-01 11:29:02
-->
<template>
  <div class="pagination">
    <!-- <div class="total">共{{ total }}项数据</div> -->
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
  name: 'pagination',
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
      default: 'prev, pager, next, total'
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
  justify-content: center;
  width: 100%;
  :deep(.el-pagination.is-background .btn-next) {
    margin: 0 5px;
    background-color: transparent;
    color: #174E83;
    min-width: 30px;
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #174E83;
    border-radius: 50%;
  }
  :deep(.el-pagination.is-background .btn-prev) {
    margin: 0 5px;
    background-color: transparent;
    color: #174E83;
    min-width: 30px;
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #174E83;
    border-radius: 50%;
  }
  :deep(.el-pager li){
    background-color: transparent;
    color: #1A538E;
    border: 0;
    min-width: 30px;
    height: 28px;
    line-height: 28px;
    border-radius: 5px;
  }
  :deep(li.is-active){
    border: 0;
    background-color: transparent !important;
    box-shadow: none;
  }
  :deep(.el-input){
    width: 100px;
    .el-input__inner{
      color: #fff;
    }
  }
  :deep(.el-pagination__editor.el-input){
    width: 50px;
  }
  :deep(.el-input__wrapper){
    background-color: transparent;
    color: #fff;
    box-shadow: 0 0 0 1px #436790 inset;
    height: 28px;
    line-height: 28px;
  }
  :deep(.el-pagination__jump){
    color: #fff;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
  }
}
</style>
