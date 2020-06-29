<template>
  <div class="app-wrapper">
    <div class="app-left">
      <siderbar />
    </div>
    <div class="app-right" v-if="isRouterAlive">
      <app-main />
    </div>
  </div>
</template>

<script>
import Siderbar from './SiderBar'
import AppMain from './AppMain'

export default {
  name: 'Layout',
  components: {
    Siderbar,
    AppMain
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper{
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
  }
  .app-left{
    width: 320px;
    height: 100%;
  }
  .app-right{
    flex: 1;
  }
</style>
