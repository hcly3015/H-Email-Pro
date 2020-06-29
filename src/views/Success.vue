<template>
<div class="success-container">
    <div class="page-content">
        <div class="contens">
            <div class="contens-icon">
                <img :src="sendsuccess" v-show="!IsSuccess" class="icons">
                <img :src="sending" v-show="IsSuccess" class="icons">
            </div>
            <p v-show="!IsSuccess">{{title}}成功，{{times}}秒后跳转</p>
            <p v-show="IsSuccess">正在{{title}}中...</p>
            <span class="btn" v-show="!IsSuccess">
                <el-button type="primary" @click="closeDialog">立即关闭</el-button>
            </span>
        </div>
    </div>
    <div class="page-bottom">
        <span v-show="IsSuccess">
            <el-button type="primary" @click="onSave" :disabled="disabled" plain>发送</el-button>
        </span>
     </div>
</div>
</template>

<script>
import sending from '@/assets/sending.png' // import 引入图片
import sendsuccess from '@/assets/sendsuccess.png' // import 引入图片

import { DSendok, MailSetDel } from '@/api/lq.email.js'
import Utils from '../js/util.js'
export default {
  name: 'success',
  data () {
    return {
      IsSuccess: true,
      sendsuccess: sendsuccess,
      sending: sending,
      times: '', // 倒计时
      title: '发送',
      disabled: true,
      emailFolder: {}
    }
  },
  created () {
    let data = this.$route.params.data
    let isTempMail = this.$route.params.isTempMails
    let mailid = this.$route.params.mailid
    if (isTempMail) {
      this.title = '保存'
    }
    this.onSave(data, isTempMail, mailid)
    let folder = this.$store.state.emailfolder
    if (folder) {
      this.emailFolder = JSON.parse(folder)
    }
  },
  methods: {
    closeDialog () {
      Utils.$emit('reloadEmailList', this.emailFolder)
      // this.$router.push({ name: 'success' })
    },
    async onSave (data, isTempMail, mailid) {
      data = JSON.stringify(data)
      let res = await DSendok(data, isTempMail)
      if (res.Success) {
        let emailFolder = this.emailFolder
        if (emailFolder.Name === '草稿箱') {
          if (mailid > 0) {
            let res = await MailSetDel(mailid, true)
            console.log(res)
          }
        }
        this.IsSuccess = false
        this.threeGo()
      }
    },
    // 3秒后进入跳转页面
    threeGo () {
      const COUNT = 3
      this.show = false
      this.$global.IsShowEdit = false
      if (!this.timer) {
        this.times = COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.times > 0 && this.times <= COUNT) {
            this.times--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
            // 跳转的页面写在此处
            Utils.$emit('reloadEmailList', this.emailFolder)
          }
        }, 1000)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contens{
    flex-flow: column;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
        p{
            color: #999;
            font-size: 16px;
        }
        .contens-icon{
            width: 200px;
            .icons{
                width:100%;
            }
        }
}
.page-bottom {
    height: 60px;
    position: absolute;
    border-top: 1px solid #f1f1f1;
    bottom: 0px;
    width: 100%;
    span{
        float: right;
        display: block;
        margin: 10px;

    }
}
</style>
