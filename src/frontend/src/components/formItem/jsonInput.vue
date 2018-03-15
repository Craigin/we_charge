<template>
  <div class="xc-form-jsoninput">
    <xc-json-editor ng-if
      :data="model"
      v-model="model">
    </xc-json-editor>
  </div>
</template>

<script>
import JsonEditor from 'components/jsonEditor'

// const JSON_SITE = 'http://www.kjson.com/jsoneditor/'

export default {
  name: 'xc-form-jsoninput',
  components: {
    'xc-json-editor': JsonEditor
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cacheValue: this.rawModel,
      value: this.getModel()
    }
  },
  computed: {
    rawModel () {
      return this.getRawModel()
    },
    model: {
      get () {
        return this.value
      },
      set (newValue) {
        this.value = newValue
        this.cacheValue = JSON.stringify(newValue)
        this.row[this.schema.name] = this.cacheValue
      }
    }
  },
  watch: {
    rawModel () {
      if (this.rawModel !== this.cacheValue) {
        this.cacheValue = this.rawModel
        this.value = this.getModel()
      }
    }
  },
  methods: {
    getRawModel () {
      return this.row[this.schema.name]
    },
    getModel () {
      try {
        return JSON.parse(this.getRawModel())
      } catch (e) {
        console.warn('failed to parse JSON', this.rawModel)
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-form-jsoninput {
  width: 100%;
}

</style>
