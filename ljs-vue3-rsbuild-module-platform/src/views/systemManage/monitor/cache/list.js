
import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from "@/api/systemManage/monitor/cache";

export default {
  name: "CacheList",
  data() {
    return {
      h: 0,
      cacheNames: [],
      cacheKeys: [],
      cacheForm: {},
      loading: false,
      subLoading: false,
      nowCacheName: "",
      tableHeight: 0
    };
  },
  created() {
    this.h = document.documentElement.clientHeight - 108 - 24;
    this.tableHeight = this.h - 96;
    this.getCacheNames();
  },
  methods: {
    /** 查询缓存名称列表 */
    getCacheNames() {
      this.loading = true;
      listCacheName().then((res) => {
        if (res.code === 200) {
          this.cacheNames = res.data;
          this.loading = false;
        }
      });
    },
    /** 刷新缓存名称列表 */
    refreshCacheNames() {
      this.getCacheNames();
      this.$modal.msgSuccess("刷新缓存列表成功");
    },
    /** 清理指定名称缓存 */
    handleClearCacheName(row) {
      clearCacheName(row.cacheName).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess("清理缓存名称[" + this.nowCacheName + "]成功");
          this.getCacheKeys();
        }
      });
    },
    /** 查询缓存键名列表 */
    getCacheKeys(row) {
      const cacheName = row !== undefined ? row.cacheName : this.nowCacheName;
      if (cacheName === "") {
        return;
      }
      this.subLoading = true;
      listCacheKey(cacheName).then((res) => {
        if (res.code === 200) {
          this.cacheKeys = res.data;
          this.subLoading = false;
          this.nowCacheName = cacheName;
        }
      });
    },
    /** 刷新缓存键名列表 */
    refreshCacheKeys() {
      this.getCacheKeys();
      this.$modal.msgSuccess("刷新键名列表成功");
    },
    /** 清理指定键名缓存 */
    handleClearCacheKey(cacheKey) {
      clearCacheKey(cacheKey).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess("清理缓存键名[" + cacheKey + "]成功");
          this.getCacheKeys();
        }
      });
    },
    /** 列表前缀去除 */
    nameFormatter(row) {
      return row.cacheName.replace(":", "");
    },
    /** 键名前缀去除 */
    keyFormatter(cacheKey) {
      return cacheKey.replace(this.nowCacheName, "");
    },
    /** 查询缓存内容详细 */
    handleCacheValue(cacheKey) {
      getCacheValue(this.nowCacheName, cacheKey).then((res) => {
        if (res.code === 200) {
          this.cacheForm = res.data;
        }
      });
    },
    /** 清理全部缓存 */
    handleClearCacheAll() {
      clearCacheAll().then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess("清理全部缓存成功");
        }
      });
    }
  },
};