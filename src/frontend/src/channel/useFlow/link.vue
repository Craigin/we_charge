<template>
  <a v-if="href" class="xc-cell-link" :href="href" target="_blank">
    {{text}}
  </a>
  <span v-else>
    {{text}}
  </span>
</template>

<script>
export default {
  name: 'xc-cell-link',
  components: {
  },
  props: {
    scope: Object,
    column: Object,
    schema: Object,
    options: Object
  },
  data () {
    return {
    }
  },
  computed: {
    value () {
      let {
        scope: {
          row
        },
        column: {
          field
        }
      } = this
      return row[field]
    },
    text () {
      let {
        value,
        scope: {
          row
        },
        column: {
          text
        }
      } = this
      let text1
      if (typeof text === 'string') {
        text1 = row[text]
      } else if (typeof text === 'function') {
        text1 = text(value, row)
      } else {
        text1 = value
      }
      return text1 || value
    },
    href () {
      let {
        value,
        scope: {
          row
        },
        column: {
          href
        }
      } = this
      if (href) {
        return href(value, row)
      }
      return '#'
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-cell-link {

}
</style>
