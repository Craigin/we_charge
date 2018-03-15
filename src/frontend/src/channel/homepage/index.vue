<template>
  <div class="channel-homepage">
    <div class="channel-body">
      <div class="title">
        Welcome Compass
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xc-homepage',
  components: {
  },
  data () {
    return {

    }
  },
  created () {
    // this.$router.replace({name: 'Diagnose'})
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.channel-homepage {
  .channel-body {
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 44px;
      font-weight: 400;
    }
  }
}

</style>
