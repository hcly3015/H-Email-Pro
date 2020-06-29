<template>
  <div class="container">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <!-- <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive> -->
        <router-view :key="key" v-if="routerState" />
      </transition>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  data () {
    return {
      routerState: true
    }
  },
  computed: {
    cachedViews () {
      return ''
    },
    key () {
      return this.$route.path
    }
  },
  provide () {
    return {
      reload: this.reload // this.reload方法注入 到reload参数中，从子组件获取
    }
  },
  methods: {
    reload () {
      this.routerState = false
      this.$nextTick(() => {
        this.routerState = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    min-width: 800px;
  }
  .app-main {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
