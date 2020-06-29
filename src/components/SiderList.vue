<template>
  <div class="siderlist-container">
    <div class="infinite-list-wrapper">
      <div class="list-wrapper" v-infinite-scroll="scrollLoad" infinite-scroll-disabled="disabled">
        <div v-for="(item, i) in emaillist" class="item" :key="i" :class="[{isSelected: item.isSelected}, isToday(item) ? 'isToday':'isEarly']">
          <div class="item-container" :class="item.Priority === 1 ? '' : 'isPriority'" @click="goBrowse(item)">
            <div class="item-priority" v-if="item.Priority === 1">
              <i class="fa fa-exclamation" aria-hidden="true"></i>
            </div>
            <div class="item-img" :class="{isUnRead: item.IsUnread}">
                <!-- <div class="headerimg" :style="'background:' + item.bgColor"></div> -->
                <!-- <div class="name" v-if="item.SenderName">{{ item.SenderName.substring(0, 1) }}</div> -->
                <el-avatar :src="item.HeaderImg" fit="fit" shape="square"></el-avatar>
            </div>
            <div class="item-content">
              <div class="top">
                <div class="left">
                  <div class="name">
                    <span>{{ emailFolder.FolderType === 6 ? item.Subject : item.SenderName }}</span>
                  </div>
                  <div class="annex" v-show="item.isAnnex"><i class="el-icon-paperclip"></i></div>
                </div>
                <div class="right">
                  <div class="datetime"><span>{{ isToday(item) ? $moment(item.CreateDate).format('HH:mm') : $moment(item.CreateDate).format('MM月DD日') }}</span></div>
                  <div class="star" @click="setStar(item)"><i :class="item.IsStar ? 'fa fa-star' : 'fa fa-star-o'"></i></div>
                </div>
              </div>
              <div class="bottom">
                <div class="title" v-show="emailFolder.FolderType !== 6">{{ item.Subject }}</div>
                <div class="content">{{ item.Subject }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="bottom-wrapper">
        <div class="line-text">加载中...</div>
      </div>
      <div v-if="!hasMore" class="bottom-wrapper">
        <div class="line"></div>
        <div class="line-text">我是有底线的</div>
        <div class="line"></div>
      </div>
      <el-backtop target=".listitem" style="left: 250px"></el-backtop>
    </div>
  </div>
</template>

<script>
import { lqGetMailList, lqSetStar, HRGetEmployees } from '@/api/lq.email.js'
import Utils from '../js/util.js'

export default {
  name: 'SiderList',
  data () {
    return {
      emailFolder: {},
      pageIndex: -1,
      pageSize: 50,
      hasMoreing: false,
      loading: false,
      emaillist: [],
      employeelist: [],
      filterParams: ''
    }
  },
  computed: {
    hasMore () {
      return this.hasMoreing
    },
    disabled () {
      return this.loading || !this.hasMore
    }
  },
  created () {
    this.loadEmployees()
  },
  mounted () {
    Utils.$on('reloadEmailList', (data) => {
      this.changeEmail(data)
    })
  },
  methods: {
    // 远程获取收件人
    async loadEmployees () {
      let data = await HRGetEmployees()
      if (data.Success) {
        let result = data.Result
        this.employeelist = result
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    // 初始化加载
    async loadEmails () {
      let folderId = this.emailFolder.Id
      if (folderId) {
        // let headers = await lqGetHeadersByMailId()
        let filter = this.filterParams
        if (filter) filter = JSON.stringify(filter)
        let result = await lqGetMailList(folderId, this.pageSize, this.pageIndex, filter)
        if (result.Success) {
          this.hasMoreing = result.Result.HasMore
          let datas = result.Result.Result
          if (datas.length > 0) {
            let newlist = []
            let list = datas
            for (let i = 0; i < list.length; i++) {
              let item = list[i]
              let annex = JSON.parse(item.Attachments)
              // item.bgColor = `rgb(${~~(Math.random()*255)},${~~(Math.random()*255)},${~~(Math.random()*255)})`
              let allRead = item.AllReaded
              if (this.emailFolder.FolderType === 6) {
                if (allRead) {
                  item.HeaderImg = require('@/assets/isread.png')
                } else {
                  item.HeaderImg = require('@/assets/unread.png')
                }
              } else {
                item.HeaderImg = require('@/assets/inbox.png')
              }
              item.isSelected = false
              item.isAnnex = annex.length !== 0
              newlist.push(item)
            }
            this.emaillist.push(...newlist)
            this.loading = false
          }
        } else {
          this.emaillist = []
          this.hasMore = false
          this.loading = false
          this.$message({
            showClose: true,
            message: result.Msg,
            type: 'error'
          })
        }
      } else {
        this.loading = false
      }
    },
    // 滚动加载
    async scrollLoad () {
      this.loading = true
      this.pageIndex++
      await this.loadEmails()
    },
    // 加载邮件(下拉选择邮件类型是触发)
    async changeEmail (item) {
      this.$router.push({ path: '/' })
      this.emailFolder = item
      this.emaillist = []
      this.pageIndex = 0
      await this.loadEmails()
      // if (this.emaillist.length > 0) {
      //   // let firstItem = this.emaillist[0]
      //   // this.goBrowse(firstItem)
      //   this.$router.push({ path: '/' })
      // } else {
      //   this.$router.push({ path: '/' })
      // }
    },
    // 搜索邮件
    async searchEmail (filter) {
      if (this.emailFolder) {
        let params = {
          Sender: [],
          Recipients: [],
          Title: '',
          Body: '',
          Level: -1,
          Attachment: '',
          Date: []
        }
        let data = JSON.parse(filter)
        if (data.value) {
          if (data.id === 0) {
            let emps = this.employeelist.filter(t => t.ItemData.Name.indexOf(data.value) > -1 && t.ItemData.State !== 3)
            let empIds = emps.map(t => t.ItemData.UserId)
            params.Sender = empIds
            params.Recipients = []
          }
          if (data.id === 1) {
            let emps = this.employeelist.filter(t => t.ItemData.Name.indexOf(data.value) > -1 && t.ItemData.State !== 3)
            let empIds = emps.map(t => t.ItemData.UserId)
            params.Recipients = empIds
            params.Sender = []
          }
          if (data.id === 2) {
            params.Title = data.value
          }
          if (data.id === 3) {
            params.Body = data.value
          }
          if (data.id === 4) {
            params.Attachment = data.value
          }
          console.log('searchParams:' + JSON.stringify(params))
          this.filterParams = params
          this.emaillist = []
          await this.loadEmails()
        } else {
          this.filterParams = ''
          this.emaillist = []
          await this.loadEmails()
        }
      }
    },
    // 搜索邮件(更多)
    async searchMoreEmail (filter) {
      if (this.emailFolder) {
        let data = JSON.parse(filter)
        let params = {
          FolderType: this.emailFolder.FolderType,
          Sender: data.sender,
          Recipients: data.recipient,
          Title: data.title,
          Body: data.content,
          Level: data.level,
          Attachment: data.annex,
          Date: data.date
        }
        this.filterParams = params
        // this.loadEmails()
      }
    },
    // 设置星标
    async setStar (item) {
      let star = item.IsStar
      if (star == null) star = false
      let headId = item.HeadId
      let data = await lqSetStar(headId, !star)
      if (data.Success) {
        item.IsStar = !star
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    // 点击邮件项跳转详情
    goBrowse (item) {
      let IsShowEdit = this.$global.IsShowEdit
      if (IsShowEdit) {
        Utils.$emit('CloseEdit')
        let Isshowtwo = this.$global.IsShowEdit
        if (Isshowtwo) {
          this.$confirm('退出后将不保存当前数据，是否确定退出?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.goBrowseSpeack(item)
          }).catch(() => {
            console.log('取消')
          })
        } else {
          this.goBrowseSpeack(item)
        }
      } else {
        this.goBrowseSpeack(item)
      }
    },
    // 跳转
    goBrowseSpeack (item) {
      this.$emit('resetSendStyle', false)
      this.$global.IsShowEdit = false
      this.emaillist.forEach(element => {
        element.isSelected = false
      })
      item.isSelected = true
      item.IsUnread = false
      let maillist = []
      maillist.push(item)
      this.$store.dispatch('EmailList', JSON.stringify(maillist))
      this.$router.push({ name: 'browse', query: { id: item.MailId, HeadId: item.HeadId, r: Math.random() } })
    },
    // 是否今天
    isToday (item) {
      let createDate = this.$moment(item.CreateDate).format('YYYY-MM-DD HH:mm')
      let date = new Date(createDate)
      let now = new Date()
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
  .siderlist-container {
    .list-wrapper {
      display: flex;
      flex-flow: column;
      .item {
        position: relative;
        &:hover {
          background-color:rgba(187,205,218,0.2);
        }
        &.isSelected {
          background-color:rgba(187,205,218,0.2);
        }
        .item-container {
          display: flex;
          flex: 1;
          padding: 15px 20px 0px 8px;
          cursor: pointer;
          &.isPriority {
            padding: 15px 20px;
          }
          .item-priority {
            color: #F58A6C;
            margin-right: 5px;
            margin-top: 2px;
          }
          .item-img {
            width: 40px;
            height: 40px;
            position: relative;
            .headerimg {
              width: 40px;
              height: 40px;
            }
            &.isUnRead:before {
              content: " ";
              border: 4px solid red;
              border-radius: 5px;
              position: absolute;
              z-index: 1000;
              left: 0%;
              margin-left: 36px;
              margin-top: -3px;
            }
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
          .item-content {
            display: flex;
            flex: 1;
            flex-flow: column;
            margin-left: 10px;
            .top {
              display: flex;
              justify-content: space-between;
              .left {
                display: flex;
                width: 125px;
                white-space: nowrap;
                overflow: hidden;
                .name {
                  color: #333333;
                  margin-right: 10px;
                  width: 100px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: 14px;
                }
                .annex {
                  color: #879095;
                }
              }
              .right {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100px;
                .datetime {
                  color: #808080;
                  font-size: 12px;
                }
                .star {
                  color: #879095;
                  margin-left: 10px;
                  .fa-star {
                    font-size: 16px;
                    color: #F58A6C;
                  }
                  .fa-star-o {
                    font-size: 16px;
                  }
                }
              }
            }
            .bottom {
              font-size: 12px;
              margin-top: 10px;
              .title {
                color: #333333;
                max-width: 208px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .content {
                color: #808080;
                margin-top: 10px;
                max-width: 208px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        &.isToday:first-child {
          margin-top: 35px;
          &::before {
            content: '今日';
            font-size: 12px;
            position: absolute;
            top: -25px;
            left: 19px;
          }
        }
        &.isEarly {
          margin-top: 35px;
          &::before {
            content: '更早';
            font-size: 12px;
            position: absolute;
            top: -25px;
            left: 19px;
          }
        }
        &.isEarly~.isEarly {
          margin-top: 0;
          &::before {
            content: '';
          }
        }
      }
    }
    .bottom-wrapper {
      padding-top: 20px;
      padding-bottom: 20px;
      color: #808080;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      .line {
        width: 20%;
        height: 1px;
        border-top: solid 1px rgba(135, 144, 149, 0.2);
      }
      .line-text {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
</style>
