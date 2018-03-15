<template>
<!--   <el-input
    v-if="mode === 'input'"
    v-model="row[schema.name]"
    auto-complete="off">
  </el-input> -->
  <div class="upload-container">
    <div class="upload-action">
      上传邮件图片：
      <el-upload
        action="/api/aliyun/upload-list"
        :show-file-list="false"
        :multiple="true"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="upload-list">
      <div v-for="item in path" class="response-container"> 
        <img :src="item"> 
        <p>成功上传，路径：{{item}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xc-image-upload',
  components: {
  },
  data () {
    return {
      path: []
    }
  },
  created () {
  },
  computed: {
    url () {
      return this.calcProp('url')
    }
  },
  methods: {
    beforeUpload (file) {
    },
    handleUploadSuccess (res, file) {
      let {
        data
      } = res
      this.path.push(data)
      console.log(this.path)
      this.$emit('input', this.path)
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-list {
    margin: 10px 110px 0;
    .response-container {
      display: flex;
      margin: 0 0 10px;
    }    
    img {
      width: 70px;
      height: 70px;
      margin-right: 15px;
      // height: 50px;
    }
  }
</style>
