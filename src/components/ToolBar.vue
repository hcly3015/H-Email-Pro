<template>
  <div class="toolbar-container">
    <div class="title">
      <el-tooltip effect="dark" placement="bottom-start" :disabled="titleTooltip">
        <div slot="content" class="tooltip-msg" :title="title">{{ title }}</div>
        <div class="title-content" ref="titlecontent" :title="title">{{ title }}</div>
      </el-tooltip>
    </div>
    <div class="rights">
      <div class="btn-group">
        <div class="left">
          <div class="btn" v-for="(item, i) in btns.filter(t => t.name !== 'delete')" :key="i" @click="toolBarClick(item, $event)">
            <i :class="item.icon" :title="item.text"></i>
          </div>
          <div class="btn" v-if="btns.filter(t => t.name === 'delete').length > 0" title="删除">
            <el-popconfirm @onConfirm="deleteEmail" confirmButtonText='是' cancelButtonText='否' icon="el-icon-info" title="您确定要删除该邮件吗？">
              <i class="fa fa-trash" slot="reference"></i>
            </el-popconfirm>
          </div>
        </div>
        <div class="right">
          <!-- <el-tooltip class="item" effect="dark" content="在独立窗口中打开" placement="bottom-end">
            <div class="btn" @click="openNewWindow">
              <i class="fa fa-window-restore"></i>
            </div>
          </el-tooltip> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolBar',
  data () {
    return {
      titleTooltip: true,
      btns: [],
      allBtns: [
        {
          name: 'reply',
          text: '回复',
          icon: 'fa fa-mail-reply'
        },
        {
          name: 'replyall',
          text: '回复全部',
          icon: 'fa fa-mail-reply-all'
        },
        {
          name: 'forward',
          text: '转发',
          icon: 'fa fa-share-square-o'
        },
        // {
        //   name: 'backward',
        //   text: '撤回',
        //   icon: 'fa fa-backward'
        // },
        {
          name: 'unread',
          text: '标记为未读',
          icon: 'fa fa-bookmark'
        },
        {
          name: 'edit',
          text: '编辑',
          icon: 'fa fa-pencil-square-o'
        },
        {
          name: 'delete',
          text: '删除',
          icon: 'fa fa-trash'
        },
        {
          name: 'close',
          text: '关闭',
          icon: 'el-icon-error'
        }
      ]
    }
  },
  created () {
    this.initBtns()
  },
  props: {
    title: {
      type: String
    },
    toolbars: {
      type: Array
    }
  },
  methods: {
    initBtns () {
      let buttons = this.allBtns.filter(t => this.toolbars.indexOf(t.name) !== -1)
      this.btns.unshift(...buttons)
    },
    toolBarClick (item, event) {
      // 邮件ID
      let mailId = this.$route.query.id
      this.$emit('toolBarClick', item)
      if (item.text === '回复') {
        this.reply(mailId)
      } else if (item.text === '回复全部') {
        this.replyall(mailId)
      } else if (item.text === '转发') {
        this.forward(mailId)
      } else if (item.text === '编辑') {
        this.edit(mailId)
      }
    },
    async reply (mailId) {
      // 回复
      this.$router.push({ name: 'send', query: {id: mailId, barName: 'reply'} })
    },
    async replyall (mailId) {
      // 回复全部
      this.$router.push({ name: 'send', query: {id: mailId, barName: 'replyall'} })
    },
    async forward (mailId) {
      // 转发
      this.$router.push({ name: 'send', query: {id: mailId, barName: 'forward'} })
    },
    // 编辑
    async edit (mailId) {
      this.$router.push({ name: 'send', query: {id: mailId, barName: 'edit'} })
    },
    deleteEmail () {
      this.$emit('deleteEmail')
    },
    openNewWindow () {
      console.log('ToolBar.vue触发工具栏点击事件:在独立窗口中打开')
    }
  }
}
</script>

<style lang="scss" scoped>
  .toolbar-container {
    height: 60px;
    padding: 0 20px 0 20px;
    border-bottom: solid 1px rgba(135, 144, 149, 0.2);
    .title {
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 40%;
      line-height: 60px;
      display: inline-block;
      .title-content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .rights {
      float: right;
      margin-top: 16px;
      font-size: 20px;
      .btn-group {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        .left {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          position: relative;
          margin: 0 10px;
          .btn {
            text-align: center;
            margin: 0px 10px;
            &:hover {
              cursor: pointer;
              color: #FFF;
              background-color: #3B5D95;
              border-radius: 4px;
            }
            i {
              width: 30px;
              height: 30px;
              line-height: 30px;
            }
          }
        }
        .right {
          display: flex;
          .btn {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            &:hover {
              cursor: pointer;
              color: #FFF;
              background-color: #3B5D95;
              border-radius: 4px;
            }
          }
          &::before {
            content: "";
            width: 1px;
            margin-right: 20px;
            background: rgba(135, 144, 149, 0.2);
          }
        }
      }
    }
  }
</style>
