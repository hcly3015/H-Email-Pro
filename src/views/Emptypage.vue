<template>
  <div class="empty-container">
    <div class="bg-container">
      <div class="bg-img">
        <img :src="require('@/assets/empty.png')" />
      </div>
      <div class="bg-text">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyPage',
  computed: {
    message () {
      return '生命在于折腾，不在折腾中崩溃，就在折腾中涅槃~'
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: rgba(187, 205, 218, .2);
    .bg-container {
      display: flex;
      flex-flow: column;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .bg-img {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        font-size: 100px;
        color: #708fc1;
      }
      .bg-text {
        display: flex;
        justify-content: center;
        color: #999999;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        letter-spacing: 0.73px;
        line-height: 16px;
        white-space: nowrap;
      }
    }
  }
</style>
