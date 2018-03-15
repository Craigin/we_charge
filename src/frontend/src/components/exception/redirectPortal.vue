<template>
  <div class="xc-auth-exception">
    <div class="exception-img-wrapper">
      <img class="search-exception-png" src="~assets/images/exception.png">
    </div>
    <div class="exception-text">
      <div class="exception-goto" v-if="redirect && countdown > 0">
        {{`正在跳转 "个人中心", ${count} ...`}}
        <a :href="redirect">
          {{redirectTitle}}
        </a>
        ...
      </div>
      <div class="exception-title">
        {{title}}
      </div>
      <div class="exception-sub">
        {{subTitle}}
      </div>
      <xc-action-button
        text="跳转"
        :handleClick="redirectPage"
        style="margin-top: 20px">
      </xc-action-button>
    </div>
    <div v-if="preventAutoRedirect" class="prevent-auto-redirect-hint">
      window.localStorage.__preventAutoRedirect = {{preventAutoRedirect}}
    </div>
  </div>
</template>

<script>
import {HOSTS} from 'config'
import ActionButton from './actionButton'

export default {
  name: 'xc-auth-exception',
  components: {
    'xc-action-button': ActionButton
  },
  props: {
    redirect: {
      type: String,
      default: `${HOSTS.PERSON}/home`
    },
    redirectTitle: {
      type: String,
      default () {
        return '个人中心'
      }
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    countdown: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      count: this.countdown,
      preventAutoRedirect: window.localStorage.__preventAutoRedirect
    }
  },
  created () {
    if (this.redirect && this.countdown > 0 && !this.preventAutoRedirect) {
      let _timer = setInterval(() => {
        this.count === 1 ? (this.redirectPage(), clearInterval(_timer)) : this.count--
      }, 1000)
    }
  },
  methods: {
    redirectPage () {
      window.location.href = this.redirect
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-auth-exception {
  padding-top: 10%;
  background: white;
  height: 100%;
  position: absolute;
  width: 100%;
  min-height: 100%;
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
    margin-top: 20px;
    color: $exc_title;
    font-size: 28px;
    .exception-goto {
      font-size: 20px;
    }
    .exception-title {
      margin-top: 18px;
      margin-bottom: 18px;
    }
    .exception-sub {
      font-size: $font_normal;
    }
  }
  .prevent-auto-redirect-hint {
    color: $error;
  }
}

</style>
