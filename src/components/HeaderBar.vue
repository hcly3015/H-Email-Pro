<template>
  <div class="headerbar-container">
    <div class="header-title" ><span>邮 件</span></div>
    <div class="header-select">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">{{ emailFolder.Name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changeEmail(item)" v-for="(item, i) in emailFolders" :key="i">{{ item.Name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { lqGetFolders } from '@/api/lq.email.js'

export default {
  name: 'HeaderBar',
  data () {
    return {
      emailFolder: '',
      emailFolders: [],
      CommonInbox: []
    }
  },
  async created () {
    await this.initFolders()
  },
  async mounted () {
    window.GetCommonInbox = () => {
      let item = this.CommonInbox
      this.changeEmail(item)
    }
  },
  methods: {
    async initFolders () {
      let data = await lqGetFolders()
      if (data.Success) {
        let result = data.Result
        if (result.length > 0) {
          result.splice(result.findIndex(t => t.FolderType === 0), 1) // 移除发件箱
          let folder = this.$store.state.emailfolder
          if (folder) {
            this.emailFolder = JSON.parse(folder)
          } else {
            let firsts = result.filter(t => t.FolderType === 1)
            if (firsts.length > 0) {
              this.emailFolder = Object.assign(firsts[0])
            } else {
              this.emailFolder = result[0]
            }
          }
          this.emailFolders = result
          this.$store.dispatch('EmailFolder', JSON.stringify(this.emailFolder))
          this.$emit('changeEmail', this.emailFolder)
          // 收件箱保存起来，点击新邮件时调用
          result.forEach(v => {
            if (v.Name === '收件箱') {
              this.CommonInbox = v
            }
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    changeEmail (item) {
      this.emailFolder = item
      this.$store.dispatch('EmailFolder', JSON.stringify(item))
      this.$emit('changeEmail', item)
    },
    goSignature () {
      this.$router.push({ name: 'signature' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .headerbar-container {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin: 0px 20px 0 20px;
    height: 60px;
    align-items: center;
    .header-select {
      .el-dropdown {
        cursor: pointer;
        color: #3B5D95;
      }
    }
  }
</style>
