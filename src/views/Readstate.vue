<template>
  <div class="readstate-container">
    <div class="page-header">
      <tool-bar ref="toolbar" :title="subject" :toolbars="toolbars" @toolBarClick="toolBarClick"></tool-bar>
    </div>
    <div class="page-content">
      <div class="main-section">
        <div class="section">
          <div class="item">
            <div class="">{{total}}</div>
            <div class="">总人数</div>
          </div>
          <div class="item">
            <div class="isread">{{isReadQty}}</div>
            <div class="">已读人数</div>
          </div>
          <div class="item">
            <div class="">{{unReadQty}}</div>
            <div class="">未读人数</div>
          </div>
        </div>
      </div>
      <div class="tab-section">
        <div class="tab-item">
          <el-button type="text" :class="[{tabActives:tabActive==item.id}]" @click="tabClick(item)" v-for="(item, i) in tabItems" :key="i">{{item.text}}</el-button>
        </div>
      </div>
      <div class="detail-section">
        <div class="section">
          <div class="list-item" v-for="(item, i) in list" :key="i">
            <div class="left">
              <el-avatar shape="square" :size="30" :src="item.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
              <div class="name">{{item.Name}}</div>
              <div class="dept">{{item.DepartmentName + '/' + item.PositionName}}</div>
            </div>
            <div class="right" v-show="!item.IsUnread">{{$moment(item.UpdateDate).format('YYYY-MM-DD HH:mm')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lqGetMail } from '@/api/lq.email.js'
import ToolBar from '@/components/ToolBar'

export default {
  name: 'Readstate',
  components: {
    ToolBar
  },
  data () {
    return {
      subject: '查看阅读状态',
      toolbars: ['close'],
      tabItems: [
        {
          id: 1,
          text: '已读明细'
        },
        {
          id: 2,
          text: '未读明细'
        }
      ],
      mailId: 0,
      tabActive: 1,
      total: 0,
      isReadQty: 0,
      unReadQty: 0,
      list: []
    }
  },
  created () {
    let mailId = this.$route.query.id
    this.mailId = mailId
    this.loadEmail(mailId)
  },
  methods: {
    // 切换
    tabClick (item) {
      this.tabActive = item.id
      this.loadEmail(this.mailId)
    },
    // 工具栏点击事件
    toolBarClick (item) {
      if (item.name === 'close') {
        this.$router.go(-1)
      }
    },
    // 加载邮件
    async loadEmail (mailId) {
      let data = await lqGetMail(mailId)
      if (data.Success) {
        this.list = []
        let result = data.Result
        let recipients = JSON.parse(result.RecipientIds)
        for (let i = 0; i < recipients.length; i++) {
          let item = recipients[i]
          let employee = item.Employee
          let head = item.Header
          let readitem = {
            Name: employee.Name,
            JobNo: employee.JobNo,
            Sex: employee.Sex,
            DepartmentName: employee.DepartmentName,
            PositionName: employee.PositionName,
            IsUnread: head.IsUnread === true,
            UpdateDate: head.UpdateDate
          }
          let exist = this.list.findIndex(t => t.JobNo === readitem.JobNo)
          if (exist <= 0) {
            this.list.push(readitem)
          }
        }
        let CCUserIds = JSON.parse(result.CCUserIds)
        for (let i = 0; i < CCUserIds.length; i++) {
          let items = CCUserIds[i]
          let employee = items.Employee
          let head = items.Header
          let readites = {
            Name: employee.Name,
            JobNo: employee.JobNo,
            Sex: employee.Sex,
            DepartmentName: employee.DepartmentName,
            PositionName: employee.PositionName,
            IsUnread: head.IsUnread === true,
            UpdateDate: head.UpdateDate
          }
          let exist = this.list.findIndex(t => t.JobNo === readites.JobNo)
          if (exist <= 0) {
            this.list.push(readites)
          }
        }
        let emailFolder = this.$store.state.emailfolder
        if (emailFolder) {
          emailFolder = JSON.parse(emailFolder)
          if (emailFolder.Name === '已发送邮件') {
            let SDUserIds = JSON.parse(result.SDUserIds)
            for (let i = 0; i < SDUserIds.length; i++) {
              let items = SDUserIds[i]
              let employee = items.Employee
              let head = items.Header
              let readites = {
                Name: employee.Name,
                JobNo: employee.JobNo,
                Sex: employee.Sex,
                DepartmentName: employee.DepartmentName,
                PositionName: employee.PositionName,
                IsUnread: head.IsUnread === true,
                UpdateDate: head.UpdateDate
              }
              let exist = this.list.findIndex(t => t.JobNo === readites.JobNo)
              if (exist <= 0) {
                this.list.push(readites)
              }
            }
          }
        }
        this.total = this.list.length
        this.unReadQty = this.list.filter(t => t.IsUnread === true).length
        this.isReadQty = this.total - this.unReadQty
        if (this.tabActive === 1) {
          this.list = this.list.filter(t => t.IsUnread === false)
        } else {
          this.list = this.list.filter(t => t.IsUnread === true)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .readstate-container {
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
      .main-section {
        display: flex;
        height: 170px;
        justify-content: space-evenly;
        align-items: center;
        background-color: #fff;
        margin-top: 20px;
        border-radius: 4px;
        .section {
          display: flex;
          flex-flow: row;
          flex: 1;
          justify-content: space-around;
          .item {
            display: flex;
            flex-flow: column;
            align-items: center;
            line-height: 25px;
            .isread {
              color: #49BF97;
            }
          }
        }
      }
      .tab-section {
        display: flex;
        margin-top: 20px;
        .tab-item {
          display: flex;
          .el-button+.el-button {
            margin-left: 35px;
          }
          .el-button--text {
            color: #333;
          }
          .tabActives {
            color: #3B5D95;
          }
        }
      }
      .detail-section {
        display: flex;
        flex-flow: column;
        margin-top: 10px;
        height: calc(100% - 260px);
        background-color: #fff;
        border-radius: 4px;
        font-size: 14px;
        overflow: auto;
        .section {
          display: flex;
          flex-flow: column;
          .list-item {
            height: 60px;
            min-height: 60px;
            display: flex;
            justify-content: space-between;
            padding: 15px;
            align-items: center;
            .left {
              display: flex;
              align-items: center;
              .name {
                margin-left: 20px;
                width: 120px;
              }
              .dept {
                margin-left: 30px;
                color: #808080;
              }
            }
            .right {
              color: #808080;
            }
          }
        }
      }
    }
  }
</style>
