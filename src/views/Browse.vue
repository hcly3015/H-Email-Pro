<template>
  <div class="browse-container">
    <div class="page-header">
      <tool-bar ref="toolbar" :title="mailItem.Subject" :toolbars="toolbars" @toolBarClick="toolBarClick" @deleteEmail="deleteEmail"></tool-bar>
    </div>
    <div class="page-content">
      <div class="header">
        <div class="img">
          <el-avatar :src="mailItem.HeaderImg" fit="fit" shape="square"></el-avatar>
          <!-- <div class="name" v-if="mailItem.SenderName">{{mailItem.SenderName.substring(0, 1)}}</div> -->
        </div>
        <div class="content">
          <div class="top">
            <div class="left">发自: <div class="name">{{ mailItem.SenderName }}</div></div>
            <div class="right">{{ $moment(mailDate).format('YYYY-MM-DD HH:mm') }}</div>
          </div>
          <div class="bottom">
            <div class="left" :class="showReceive?'isSelected':'unSelected'" @click="openReceive">
              <div class="title">收发明细</div>
              <div class="arrow"><i :class="showReceive?'fa fa-angle-up':'fa fa-angle-down'"></i></div>
            </div>
            <div class="right" @click="openReadState">
              <div class="title">查看阅读状态</div>
            </div>
          </div>
        </div>
      </div>
      <div class="receive" v-if="showReceive">
        <div class="receive-group">
          <div class="accept">
            <div class="title">收件人:</div>
            <div class="content">
              <div class="item" v-for="(data, i) in mailItem.recipients" :key="i">
                <div v-if="Isdraft" class="item" scope="scope">
                    <el-popover ref="popover" placement="bottom" width="280" trigger="click">
                      <div class="popover-container" :class="data.Header.IsUnread?'unread':'isread'" >
                        <div class="popover-container-avatar">
                          <el-avatar shape="square" :size="40" :src="data.Employee.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                        </div>
                        <div class="popover-container-info">
                          <div class="text">{{ data.Employee.Name }}({{ data.Employee.JobNo }})</div>
                          <div class="text">
                            <div class="label">职&nbsp;位:</div>
                            <div class="value">{{ data.Employee.PositionName }}</div>
                          </div>
                          <div class="text">
                            <div class="label">部&nbsp;门:</div>
                            <div class="value">{{ data.Employee.DepartmentName }}</div>
                          </div>
                          <div class="text">
                            <div class="label">电&nbsp;话:</div>
                            <div class="value">{{ data.Employee.TelePhone }}</div>
                          </div>
                          <div class="text" v-if="!data.Header.IsUnread">
                            <div class="label">阅读时间:</div>
                            <div class="value">{{ $moment(data.Header.UpdateDate).format('YYYY-MM-DD HH:mm') }}</div>
                          </div>
                        </div>
                      </div>
                      <el-button type="text" slot="reference" @mouseleave.native="closePopover(i)">{{ data.Employee.Name }}</el-button>
                    </el-popover>
                    <div class="img" :class="data.Header.IsUnread?'noRead':'isRead'"><i :class="data.Header.IsUnread?'fa fa-envelope':'fa fa-envelope-open'"></i></div>
                </div>
                <div v-else class="item">
                    <el-button type="text" slot="reference">{{ data.Employee.Name }}</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="accept">
            <div class="title">抄送人:</div>
            <div class="content">
              <div class="item" v-for="(data, i) in mailItem.ccusers" :key="i">
                <div v-if="Isdraft" class="item">
                    <el-popover placement="bottom" width="280" trigger="click">
                    <div class="popover-container" :class="data.Header.IsUnread?'unread':'isread'">
                      <div class="popover-container-avatar">
                        <el-avatar shape="square" :size="40" :src="data.Employee.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                      </div>
                      <div class="popover-container-info">
                        <div class="text">{{ data.Employee.Name }}({{ data.Employee.JobNo }})</div>
                        <div class="text">
                          <div class="label">职&nbsp;位:</div>
                          <div class="value">{{ data.Employee.PositionName }}</div>
                        </div>
                        <div class="text">
                          <div class="label">部&nbsp;门:</div>
                          <div class="value">{{ data.Employee.DepartmentName }}</div>
                        </div>
                        <div class="text">
                          <div class="label">电&nbsp;话:</div>
                          <div class="value">{{ data.Employee.TelePhone }}</div>
                        </div>
                        <div class="text" v-if="!data.Header.IsUnread">
                          <div class="label">阅读时间:</div>
                          <div class="value">{{ $moment(data.Header.UpdateDate).format('YYYY-MM-DD HH:mm') }}</div>
                        </div>
                      </div>
                    </div>
                    <el-button type="text" slot="reference">{{ data.Employee.Name }}</el-button>
                  </el-popover>
                  <div class="img" :class="data.Header.IsUnread?'noRead':'isRead'" ><i :class="data.Header.IsUnread?'fa fa-envelope':'fa fa-envelope-open'"></i></div>
                </div>
                <div v-else class="item">
                    <el-button type="text" slot="reference">{{ data.Employee.Name }}</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="accept" v-if="emailFolder.FolderType === 6 || emailFolder.FolderType === 3">
            <div class="title">密送人:</div>
            <div class="content">
              <div class="item" v-for="(data, i) in mailItem.sdusers" :key="i">
                <div v-if="Isdraft" class="item">
                    <el-popover placement="bottom" width="280" trigger="click">
                      <div class="popover-container" :class="data.Header.IsUnread?'unread':'isread'" >
                        <div class="popover-container-avatar">
                          <el-avatar shape="square" :size="40" :src="data.Employee.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                        </div>
                        <div class="popover-container-info">
                          <div class="text">{{ data.Employee.Name }}({{ data.Employee.JobNo }})</div>
                          <div class="text">
                            <div class="label">职&nbsp;位:</div>
                            <div class="value">{{ data.Employee.PositionName }}</div>
                          </div>
                          <div class="text">
                            <div class="label">部&nbsp;门:</div>
                            <div class="value">{{ data.Employee.DepartmentName }}</div>
                          </div>
                          <div class="text">
                            <div class="label">电&nbsp;话:</div>
                            <div class="value">{{ data.Employee.TelePhone }}</div>
                          </div>
                          <div class="text" v-if="!data.Header.IsUnread">
                            <div class="label">阅读时间:</div>
                            <div class="value">{{ $moment(data.Header.UpdateDate).format('YYYY-MM-DD HH:mm') }}</div>
                          </div>
                        </div>
                      </div>
                      <el-button type="text" slot="reference">{{ data.Employee.Name }}</el-button>
                    </el-popover>
                    <div class="img" :class="data.Header.IsUnread?'noRead':'isRead'"><i :class="data.Header.IsUnread?'fa fa-envelope':'fa fa-envelope-open'"></i></div>
                </div>
                <div v-else class="item">
                    <el-button type="text" slot="reference">{{ data.Employee.Name }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="annexs">
        <div class="files-group" v-for="(annex, i) in mailItem.annexs" :key="i" @dblclick = "openfile(annex.Id)">
          <div class="file-left" >
            <div class="annex"><i class="el-icon-paperclip"></i></div>
            <div class="file-id" hidden>{{ annex.Id }}</div>
            <div class="file-title" ><span class="titles" :title="annex.Name">{{ annex.title }}</span>{{annex.tip}}</div>
          </div>
          <div class="file-right">
            <div class="file-img" @click="downfile(annex.Id)"><i class="fa fa-download"></i></div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="content" v-html="mailItem.Body"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { lqGetMail, MailSetDel, MailSetReaded, Lqdownfile, Lqopenfile } from '@/api/lq.email.js'
import ToolBar from '@/components/ToolBar'
import Utils from '../js/util.js'

export default {
  name: 'Browse',
  components: {
    ToolBar
  },
  watch: {
    '$route': {
      handler (newVal, oldVal) {
        this.initFolder()
        this.loadEmails(newVal.query.id)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      emailFolder: {},
      mailId: 0,
      mailItem: {},
      mailDate: '',
      mailids: 0,
      toolbars: [],
      showReceive: false,
      Isdraft: true // 是否是草稿箱，如果是就不显示已读还是未读
    }
  },
  created () {
    this.initFolder()
  },
  mounted () {},
  methods: {
    initFolder () {
      let mailId = this.$route.query.id
      this.mailId = mailId
      this.mailids = Number(this.$route.query.HeadId)
      let mailList = this.$store.state.emaillist
      if (mailList) {
        let mailData = JSON.parse(mailList)
        let mail = mailData.filter(t => t.MailId === Number(this.mailId))
        if (mail.length > 0) {
          let item = mail[0]
          this.mailDate = item.CreateDate
        }
      }
      let folder = this.$store.state.emailfolder
      if (folder) {
        let eFolder = JSON.parse(folder)
        this.emailFolder = eFolder
        // 0:发件箱, 1:收件箱, 2:存档, 3:草稿箱, 4:垃圾邮件, 5:, 6:已发送邮件, 7:已删除邮件
        if (eFolder.FolderType === 1) {
          this.toolbars = ['reply', 'replyall', 'forward', 'backward', 'unread', 'delete']
        } else if (eFolder.FolderType === 3) {
          this.Isdraft = false
          this.toolbars = ['edit', 'delete']
        } else if (eFolder.FolderType === 6) {
          this.toolbars = ['reply', 'replyall', 'forward', 'backward', 'delete']
        }
      }
      this.unread(true)
    },
    // 加载邮件
    async loadEmails (mailId) {
      let data = await lqGetMail(mailId)
      if (data.Success) {
        let result = data.Result
        let recipients = JSON.parse(result.RecipientIds)
        let ccusers = JSON.parse(result.CCUserIds)
        let sdusers = JSON.parse(result.SDUserIds)
        let annexs = JSON.parse(result.Attachments)
        this.mailItem = result
        this.mailItem.HeaderImg = require('@/assets/inbox.png')
        this.mailItem.recipients = recipients
        this.mailItem.ccusers = ccusers
        this.mailItem.sdusers = sdusers
        if (annexs) {
          annexs.forEach(v => {
            let Name = v.Name
            let index = Name.lastIndexOf('.')
            v.title = Name.slice(0, index - 1)
            v.tip = Name.substring(index, index.length)
          })
          this.mailItem.annexs = annexs
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    // 切换收发明细
    openReceive () {
      this.showReceive = !this.showReceive
    },
    // 查看阅读状态
    openReadState () {
      this.$router.push({ name: 'readstate', query: { id: this.mailId } })
    },
    // 工具栏点击事件
    toolBarClick (item) {
      if (item.text === '回复') {
        this.reply()
      }
      if (item.text === '标记为未读') {
        this.unread(false)
      }
    },
    // 自定义关闭Popover
    closePopover (data) {
      this.$refs.popover[data].doClose()
    },
    // 回复邮件
    async reply () {
      this.$router.push({ name: 'send' })
    },
    // 标记未读
    async unread (Isunread) {
      let id = this.mailids
      let data = await MailSetReaded(id, Isunread)
      if (data.Success) {
        if (!Isunread) {
          this.$message({
            showClose: true,
            message: '已标记为未读',
            type: 'success'
          })
          Utils.$emit('reloadEmailList', this.emailFolder)
        }
      } else {
        this.$message({
          showClose: true,
          message: '操作失败',
          type: 'error'
        })
      }
    },
    // 删除邮件
    async deleteEmail () {
      let id = this.mailids
      let data = await MailSetDel(id, false)
      if (data.Success) {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        Utils.$emit('reloadEmailList', this.emailFolder)
      } else {
        let err = JSON.parse(data.Msg)
        this.$message({
          showClose: true,
          message: err.Message,
          type: 'error'
        })
      }
    },
    // 下载文件
    async downfile (Id) {
      await Lqdownfile(Id)
    },
    // 双击打开文件
    async openfile (Id) {
      await Lqopenfile(Id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .browse-container {
    height: 100%;
    min-height: 100vh;
    background-color: rgba(187, 205, 218, .2);
    display: flex;
    flex-direction: column;
    .page-header {
      height: 60px;
    }
    .page-content {
      flex: 1;
      padding: 0 20px 0 20px;
      overflow: auto;
      .header {
        display: flex;
        padding-top: 20px;
        .img {
          width: 40px;
          height: 40px;
          position: relative;
          .el-image {
            border-radius: 5px;
          }
          .name {
            position: absolute;
            top: 12px;
            left: 11px;
            color: #fff;
          }
        }
        .content {
          display: flex;
          flex: 1;
          flex-flow: column;
          padding-left: 20px;
          justify-content: space-between;
          .top {
            display: flex;
            justify-content: space-between;
            .left {
              display: flex;
              align-items: center;
              color: #333333;
              font-size: 15px;
              .name {
                padding-left: 15px;
              }
            }
            .right {
              display: flex;
              align-items: center;
              color: #808080;
              font-size: 13px;
            }
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            color: #666666;
            font-size: 12px;
            .left {
              display: flex;
              cursor: pointer;
              &.isSelected {
                color: #3B5D95;
              }
              .title {
                margin-right: 5px;
              }
            }
            .right {
              cursor: pointer;
              color: #3B5D95;
            }
          }
        }
      }
      .receive {
        display: flex;
        padding-top: 15px;
        .receive-group {
          border: solid 1px rgba(135, 144, 149, 0.2);
          background-color: #F8FAFB;
          color: #666;
          font-size: 14px;
          padding: 0px;
          flex: 1;
          .accept {
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            margin-left: 15px;
            margin-top: 8px;
            .title {
              margin-right: 10px;
              margin-top: 9px;
            }
            .content {
              display: flex;
              flex: 1;
              flex-flow: row;
              flex-wrap: wrap;
              max-height: 120px;
              overflow: auto;
              border-bottom: 1px solid rgba(135, 144, 149, 0.2);
              .item {
                display: flex;
                margin: 0;
                padding: 0px 15px 0px 0px;
                .img {
                  font-size: 10px;
                  display: flex;
                  align-items: center;
                  &.isRead {
                    color: #666;
                    padding-left: 6px;
                  }
                  &.noRead {
                    color: #3B5D95;
                    padding-left: 6px;
                  }
                }
              }
            }
          }
          .accept:last-child {
            display: flex;
            padding-top: 6px;
            padding-bottom: 8px;
            border: none;
            .content {
              border: none;
            }
          }
        }
      }
      .annexs {
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        padding-top: 20px;
        .files-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: solid 1px rgba(135, 144, 149, 0.2);
          width: 275px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 4px;
          margin: 10px 10px 10px 0;
          padding: 10px;
          &:hover {
            color: #3B5D95;
            border: 1px solid #3B5D95;
          }
          .file-left {
            display: flex;
            .annex {
              display: flex;
              padding-right: 5px;
              color: #879095;
            }
            .file-name {
              font-size: 14px;
            }
            .file-title{
              font-size: 14px;
              overflow: hidden;
              width: 215px;
              span{
                max-width: 185px;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                float: left;
              }
            }
          }
          .file-right {
            color: #879095;
            cursor: pointer;
            &:hover {
              color: #3B5D95;
            }
          }
        }
      }
      .container {
        padding-top: 30px;
        .content {
          max-width: 1200px;
        }
      }
    }
    .el-button--text {
      color: #666;
    }
  }
  .popover-container {
    display: flex;
    flex-flow: row;
    &.unread {
      height: 108px;
    }
    &.isread {
      height: 122px;
    }
    .popover-container-avatar {
      margin-right: 10px;
      margin-top: 5px;
      display: flex;
      flex-flow: column;
    }
    .popover-container-info {
      flex: 1;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      .text {
        display: flex;
        white-space: nowrap;
        padding: 3px 0px;
        .label {
          width: 75px;
        }
        .value {
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 150px;
          overflow: hidden;
        }
      }
    }
  }
</style>
