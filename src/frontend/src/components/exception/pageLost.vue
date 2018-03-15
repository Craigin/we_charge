<template>
  <div class="xc-page-lost">
    <div class="exception-img-wrapper">
      <img class="search-exception-png" src="~assets/images/page_lost.png">
    </div>
    <div class="exception-text">
      <div class="exception-title">
        {{text}}
      </div>
      <xc-action-button style="margin-top: 20px"></xc-action-button>
    </div>
  </div>
</template>

<script>
import ActionButton from './actionButton'

export default {
  name: 'xc-page-lost',
  components: {
    'xc-action-button': ActionButton
  },
  data () {
    return {
      text: '页面不存在'
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-page-lost {
  padding-top: 60px;
  background: white;
  // height: 100%;
  position: absolute;
  width: 100%;
  // min-height: 100%;
  top: 0px;
  .exception-img-wrapper {
    display: flex;
    justify-content: center;
    .search-exception-png {
      display: block;
    }
  }
  .exception-text {
    text-align: center;
    margin-top: 36px;
    color: $exc_title;
    font-size: 18px;
    .exception-sub-title {
      font-size: $font_small;
      margin-top: 18px;
    }
  }
}

</style>
