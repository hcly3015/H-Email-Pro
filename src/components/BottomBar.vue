<template>
  <div class="bottombar-container">
    <div class="left">
      <el-button plain @click.native="btnClear">清空</el-button>
    </div>
    <div class="right">
      <el-button plain @click.native="btnSave">保存</el-button>
      <el-button type="primary" @click.native="btnSend">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomBar',
  methods: {
    btnClear () {
      this.$emit('btnClear')
    },
    btnSave () {
      this.$emit('btnSave')
    },
    btnSend () {
      this.$emit('btnSend')
    }
  }
}
</script>

<style lang="scss" scoped>
  .bottombar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px 0 20px;
    height: 60px;
    border-top: solid 1px rgba(135, 144, 149, 0.2);
    .right {
      display: flex;
    }
  }
</style>
