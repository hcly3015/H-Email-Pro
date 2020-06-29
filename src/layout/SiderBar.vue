<template>
  <div class="siderbar-container">
    <div class="header">
      <header-bar ref="headerbar" @changeEmail="changeEmail"></header-bar>
    </div>
    <div class="search">
      <search-bar ref="searchbar" @searchEmail="searchEmail" @searchMoreEmail="searchMoreEmail"></search-bar>
    </div>
    <div class="listitem">
      <sider-list ref="siderlist" @resetSendStyle="resetSendStyle"></sider-list>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar'
import SearchBar from '@/components/SearchBar'
import SiderList from '@/components/SiderList'

export default {
  name: 'SiderBar',
  components: {
    HeaderBar,
    SearchBar,
    SiderList
  },
  methods: {
    changeEmail (item) {
      this.$refs.searchbar.clearSearchText()
      this.$refs.searchbar.resetSearchForm()
      this.$refs.searchbar.sendBtn = false
      this.$refs.siderlist.changeEmail(item)
    },
    searchEmail (filter) {
      this.$refs.siderlist.searchEmail(filter)
    },
    searchMoreEmail (filter) {
      this.$refs.siderlist.searchMoreEmail(filter)
    },
    resetSendStyle (isSend) {
      this.$refs.searchbar.sendBtn = isSend
    }
  }
}
</script>

<style lang="scss" scoped>
  .siderbar-container {
    background-color: #ffffff;
    border-right: 1px solid rgba(135, 144, 149, .4);
    z-index: 1001;
    overflow: hidden;
    height: 100%;
    width: 320px;
    .header {
      height: 60px;
    }
    .search {
      height: 60px;
    }
    .listitem {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 120px);
    }
  }
</style>
