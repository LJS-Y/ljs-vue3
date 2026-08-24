<template>
  <div class="wangEditor" v-if="!disabled">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{
        height,
        'overflow-y': 'hidden'
      }"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
  <HTMLBox v-else :content="modelValue"></HTMLBox>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { idForFileNo } from '@/tools/base';

const store = useStore()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String],
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 高度
  height: {
    type: String,
    default: '350px',
  },
  // 图片上传
  imageOpts: {
    type: Object,
    default: () => {
      return {
        apiUrl: `${import.meta.env.PUBLIC_API_URL}/api/file/upload`, // 接口
        maxFileSize: 0.5, // 单个文件的最大体积限制，0.5MB
        maxNumberOfFiles: 20, // 最多可上传几个文件
        allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        timeout: 10 * 1000, // 超时时间，默认为 10 秒
      }
    }
  },
  // 视频上传
  videoOpts: {
    type: Object,
    default: () => {
      return {
        apiUrl: `${import.meta.env.PUBLIC_API_URL}/api/file/upload`, // 接口
        maxFileSize: 50, // 单个文件的最大体积限制，0.5MB
        maxNumberOfFiles: 1, // 最多可上传几个文件
        allowedFileTypes: ['video/*'], // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
        timeout: 60 * 1000, // 超时时间，默认为 10 秒
      }
    }
  },
})

const mode = ref('default') // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('');

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    valueHtml.value = props.modelValue;
  },
  { immediate: true },
)

watch(
  () => props.disabled,
  (newValue, oldValue) => {
    if (props.disabled) {
      editorRef.value.disable()
    } else {
      editorRef.value.enable()
    }
  },
)

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
  // }, 1500);
});

const toolbarConfig = {};
const editorConfig = { 
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      // 配置图片上传（如果需要）
      server: props.imageOpts.apiUrl,
      fieldName: 'file',
      // 自定义增加 http header
      headers: {
        Authorization: store.getters.token
      },
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      meta: {
        // fileStoragePath: null, // 文件存储路径，如果是本地，则为相对应用程序路径；如果是远程OSS则为存储的key；如果是远程nas存储，则为nas绝对路径。暂不明确
        fileProtect: false, // 是否为保护文件，保护文件必须登录才能看到，0：不保护（false），1：保护（true）
        // fileProtectSelf: false, // 是否仅自己可见文件，false：
      },
      maxFileSize: props.imageOpts.maxFileSize * 1024 * 1024,
      maxNumberOfFiles: props.imageOpts.maxNumberOfFiles,
      allowedFileTypes: props.imageOpts.allowedFileTypes,
      timeout: props.imageOpts.timeout,
      // 上传之前触发
      onBeforeUpload(file: File) {
        store.commit('loadingStore', {
          tag: true,
        });
        return file
      },
      // 自定义插入图片
      customInsert(res, insertFn) {
        if (res.code === 200) {
          const imageId = res.data.id;
          const imageUrl = idForFileNo(imageId);
          insertFn(imageUrl)
        }
        store.commit('loadingStore', {
          tag: false,
        });
      },
    },
    uploadVideo: {
      // 配置图片上传（如果需要）
      server: props.videoOpts.apiUrl,
      fieldName: 'file',
      // 自定义增加 http header
      headers: {
        Authorization: store.getters.token
      },
      maxFileSize: props.videoOpts.maxFileSize * 1024 * 1024,
      maxNumberOfFiles: props.videoOpts.maxNumberOfFiles,
      allowedFileTypes: props.videoOpts.allowedFileTypes,
      timeout: props.videoOpts.timeout,
      // 上传之前触发
      onBeforeUpload(file: File) {
        store.commit('loadingStore', {
          tag: true,
        });
        return file
      },
      // 自定义插入图片
      customInsert(res, insertFn) {
        if (res.code === 200) {
          const imageId = res.data.id;
          const imageUrl = idForFileNo(imageId);
          insertFn(imageUrl)
        }
        store.commit('loadingStore', {
          tag: false,
        });
      },
    },
  }
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器内容变化时同步到表单
const handleChange = (editorInstance) => {
  emit('update:modelValue', editorInstance.getHtml())
  
  // form.content = editorInstance.getHtml()
  // // 手动触发表单验证
  // formRef.value.validateField('content')
  // modelValue
}

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  
  if (props.disabled) {
    editorRef.value.disable()
  } else {
    editorRef.value.enable()
  }
};
</script>


<style lang="scss" scoped>
@import "./index.scss";
</style>
