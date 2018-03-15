<template>
  <div class="log-detail-container">
    <el-select v-model="fileName" v-if="fileList.length > 0">
      <el-option v-for="item in fileList"
       v-if="item"
       :value="item"
       :key="item"
       :label="item">
      </el-option>
    </el-select>
    &nbsp&nbsp
    <el-button v-if="fileList.length > 0" @click="newTab()">单独查看</el-button>
    <el-button @click="restart()">重新连接</el-button>
    <el-button @click="clearData">清空数据</el-button>
    <el-button @click="scrollToEnd">回到底部</el-button>
    <div class="show-area">
      <pre>{{logMsg}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xc-log-fixed',
  props: {
    data: Object
  },
  data () {
    return {
      logMsg: '',
      ws: '',
      fileList: [],
      fileName: ''
    }
  },
  created () {
    this.startWebSocket()
  },
  watch: {
    fileName (data) {
      this.sendWebsocketMsg(data)
    }
  },
  destroyed () {
    console.log('destroyed')
    this.ws.close()
  },
  methods: {
    startWebSocket () {
      let _this = this
      let {
        href,
        hostname
      } = window.location
      let isHttps = href.indexOf('https') > -1
      if (isHttps) {
        this.ws = new WebSocket(`wss://${hostname}:2670/log`)
      } else {
        this.ws = new WebSocket(`ws://${hostname}:2670/log`)
      }

      this.ws.onmessage = (msg) => {
        this.ComputedLogMsg(msg.data)
      }
      this.ws.onerror = (msg) => {
        _this.ws.close()
      }
    },
    closeWebSocket () {
      this.ws.close()
    },
    ComputedLogMsg (data) {
      data = JSON.parse(data)
      switch (data.type) {
        case 'file_list':
          this.calcuFileList(data.data)
          break
        case 'query_log':
          this.calcuLogFile(data)
          // let container = this.$el.querySelector('.show-area')
          // let scrollTag = container.scrollHeight - container.scrollTop <= 600
          // this.logMsg = this.logMsg + data.data
          // if (scrollTag) {
          //   setTimeout(() => {
          //     container.scrollTop = container.scrollHeight
          //   }, 0)
          // }
          break
        case 'success_connect':
          this.sendWebsocketMsg(this.fileName)
      }
    },
    calcuFileList (data) {
      this.fileList = data.split('\n')
    },
    sendWebsocketMsg (fileName) {
      this.ws.send(JSON.stringify({type: 'query_log', data: {id: this.$route.query._id, filename: fileName}}))
    },
    clearData () {
      this.logMsg = ''
    },
    restart (data) {
      let _this = this
      this.ws.onclose = (msg) => {
        _this.startWebSocket()
      }
      this.ws.close()
    },
    scrollToEnd () {
      let container = this.$el.querySelector('.show-area')
      container.scrollTop = container.scrollHeight
    },
    newTab () {
      // this.$emit('',)
    },
    calcuLogFile (data) {
      let fileLog = (this.logMsg + data.data).split('\n')
      if (fileLog.length > 3000) {
        this.logMsg = fileLog.slice(fileLog.length - 3000, fileLog.length).join('\n')
        return
      }
      this.logMsg = this.logMsg + data.data
    }
  }
}
</script>

<style lang="scss">
.log-detail-container {
  .show-area {
    height: 600px;
    overflow: scroll;
  }
  .el-select {
    width: 300px;
  }
}
</style>
