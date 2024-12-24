<template>
  <div class="childPage">
    <div class="comPage">
      <div class="one">
        
        <el-card :style="{
          height: `${h}px`,
        }">
          <template #header>
            <span>缓存列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              text
              @click="refreshCacheNames()"
            ><el-icon><RefreshRight /></el-icon></el-button>
          </template>
          <el-table
            class="comTable"
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            @row-click="getCacheKeys"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>

            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            ></el-table-column>

            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="danger"
                  size="small"
                  text
                  @click="handleClearCacheName(scope.row)"
                ><el-icon><Delete /></el-icon></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="one">
        <el-card :style="{
          height: `${h}px`,
        }">
          <template #header>
            <span>键名列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              text
              @click="refreshCacheKeys()"
            ><el-icon><RefreshRight /></el-icon></el-button>
          </template>
          <el-table
            class="comTable"
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="danger"
                  size="small"
                  text
                  @click="handleClearCacheKey(scope.row)"
                ><el-icon><Delete /></el-icon></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="one">
        <el-card :style="{
          height: `${h}px`,
        }">
          <template #header>
            <span>缓存内容</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              text
              @click="handleClearCacheAll()"
            ><el-icon><RefreshRight /></el-icon>清理全部</el-button>
          </template>
          <el-form :model="cacheForm">
            <el-row :gutter="32">
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存名称:" prop="cacheName">
                  <el-input v-model="cacheForm.cacheName" :readOnly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存键名:" prop="cacheKey">
                  <el-input v-model="cacheForm.cacheKey" :readOnly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存内容:" prop="cacheValue">
                  <el-input
                    v-model="cacheForm.cacheValue"
                    type="textarea"
                    :rows="8"
                    :readOnly="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import list from "./list";
export default list;
</script>

<style lang="scss" scoped>
@import "./list.scss";
</style>
