<template>
  <el-input
    v-if="mode === 'input'"
    v-model="row[schema.name]"
    auto-complete="off">
  </el-input>
  <el-upload
    v-else
    action="/api/aliyun/upload"
    :show-file-list="false"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload">
    <img v-if="url && schema.name === 'image'" :src="url" />
    <p v-else-if="url && schema.name === 'pdf'">{{url}}</p>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>

export default {
  name: 'xc-form-image',
  components: {
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
    },
    row: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      mode: 'image'
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
    calcProp (prop) {
      let {
        schema,
        schema: {
          [prop]: propValue
        },
        value,
        row
      } = this
      switch (typeof propValue) {
        case 'function': {
          propValue = propValue(value, row, schema)
          break
        }
        case 'string': {
          break
        }
        default: {
          propValue = value
        }
      }
      return propValue
    },
    beforeUpload (file) {
    },
    handleUploadSuccess (res, file) {
      let {
        data: {
          url
        }
      } = res
      this.row[this.schema.name] = url
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-form-item {
  img {
    max-height: 240px;
    max-width: 80%;
  }
  .el-upload {
    text-align: left;
  }
}

</style>
