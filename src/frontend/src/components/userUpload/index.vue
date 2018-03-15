<template>
<!--   <el-input
    v-if="mode === 'input'"
    v-model="row[schema.name]"
    auto-complete="off">
  </el-input> -->
  <div class="upload-container">
    <div class="upload-action">
    上传用户邮箱：
      <el-upload
        action="/api/mail/upload"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <span v-if="path">成功上传，路径：<a :href="path">{{path}}</a></span>
  </div>
</template>

<script>
export default {
  name: 'xc-user-upload',
  components: {
  },
  // props: {
  //   schema: {
  //     type: Object,
  //     required: true
  //   },
  //   value: {
  //   },
  //   row: {
  //     type: Object,
  //     required: true
  //   }
  // },
  // data () {
  //   return {
  //     mode: 'image'
  //   }
  // },
  data () {
    return {
      path: ''
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
      this.path = data
      this.$emit('input', data)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.upload-container {
  // display: flex;
  .upload-action {
    display: flex;
  }
  margin-top: 30px;
  span {
    margin-left: 30px;
  }
  img {
    max-height: 240px;
    max-width: 80%;
  }
  .el-upload {
    text-align: left;
  }
}
</style>
