<template>
  <div class="searchbar-container">
    <div class="search-input">
      <el-input placeholder="搜索" v-model="filter.value"
        @blur="selectBlur" @keyup.native="getItems($event)" @keyup.enter.native="searchEmail"
        @keydown.down.native="selectDown" @keyup.up.native="selectUp" @keyup.esc.native="cancelSearch" style="width:100%;">
      </el-input>
      <div class="search-select">
        <!-- transition-group也是vue2.0中的新特性,tag='ul'表示用ul包裹v-for出来的li -->
        <transition-group name="itemfade" tag="ul" mode="out-in" v-cloak :class="{'hasborder': items.length > 0}">
          <li v-for="(item, i) in items" :class="{selectback: i == now}" @mouseover="selectHover(i)" @click="selectClick(i)" :key="item.id" class="option">
            <div class="label">{{ item.text }}</div><div class="text">{{ item.value }}</div>
          </li>
        </transition-group>
      </div>
      <!-- 更多搜索，先屏蔽暂时不实现 -->
      <!-- <el-popover placement="bottom" width="600" trigger="click">
        <el-form ref="form" :inline="true" :model="form" label-width="70px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="发件人">
                <el-input clearable v-model="form.sender"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件人">
                <el-input clearable v-model="form.recipient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主题">
                <el-input clearable v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全文">
                <el-input clearable v-model="form.content"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="优先级">
                <el-select v-model="form.level" placeholder="优先级">
                  <el-option label="不限" value="-1"></el-option>
                  <el-option label="一般" value="3"></el-option>
                  <el-option label="重要" value="2"></el-option>
                  <el-option label="非常重要" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件">
                <el-input clearable v-model="form.annex"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="时间">
                <el-date-picker style="width:487px;" v-model="form.date" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="search-more-btn">
              <el-button plain @click="resetSearchForm">重置</el-button>
              <el-button type="primary" @click="searchMoreEmail">查询</el-button>
            </el-col>
            </el-row>
        </el-form>
        <div slot="reference" class="search-more" @click="showSearchMore"><i :class="searchmore ? 'fa fa-angle-double-up': 'fa fa-angle-double-down'"></i></div>
      </el-popover> -->
      <!-- 更多搜索，先屏蔽暂时不实现 -->
    </div>
    <div class="search-btn">
      <el-button :class="{clickStyle:sendBtn}" type="" icon="el-icon-edit" @click.native="sendEmail"></el-button>
    </div>
  </div>
</template>

<script>
import Utils from '../js/util.js'

export default {
  name: 'SearchBar',
  inject: ['reload'],
  data () {
    return {
      filter: {
        id: -1,
        text: '',
        value: ''
      },
      sendBtn: false,
      searchmore: false,
      form: {
        sender: '',
        recipient: '',
        title: '',
        content: '',
        level: '-1',
        annex: '',
        date: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      now: -1,
      items: [],
      searchs: [
        {
          id: 0,
          text: '发件人',
          value: ''
        },
        {
          id: 1,
          text: '收件人',
          value: ''
        },
        {
          id: 2,
          text: '主题',
          value: ''
        }
        // 先屏蔽暂时不实现
        // ,
        // {
        //   id: 3,
        //   text: '全文',
        //   value: ''
        // },
        // {
        //   id: 4,
        //   text: '附件名',
        //   value: ''
        // }
      ]
    }
  },
  mounted () {
    Utils.$on('resetSendStyle', (data) => {
      this.resetSendStyle(data)
    })
  },
  methods: {
    getItems (event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        return
      }
      if (this.filter.value === '') {
        this.items = []
      } else {
        this.searchs.forEach(t => {
          t.text = t.text
          t.value = this.filter.value
        })
        this.items = this.searchs
      }
    },
    selectBlur () {
      // this.items = []
    },
    // 下移
    selectDown () {
      this.now++
      if (this.now === this.items.length) {
        this.now = 0
      }
      let filterItem = this.items.filter(t => t.id === this.now)
      if (filterItem.length > 0) {
        this.filter = filterItem[0]
      }
    },
    // 上移
    selectUp () {
      this.now--
      if (this.now === -1) {
        this.now = this.items.length - 1
      }
      let filterItem = this.items.filter(t => t.id === this.now)
      if (filterItem.length > 0) {
        this.filter = filterItem[0]
      }
    },
    // 鼠标移动
    selectHover (index) {
      this.now = index
    },
    // 选择事件
    selectClick (index) {
      let filterItem = this.items.filter(t => t.id === index)
      if (filterItem.length > 0) {
        this.filter = filterItem[0]
        this.searchEmail()
      }
      this.items = []
    },
    cancelSearch () {
      this.items = []
    },
    searchEmail () {
      if (this.filter.id === -1) {
        this.filter.id = 0
        this.filter.text = '发件人'
      }
      this.$emit('searchEmail', JSON.stringify(this.filter))
      this.items = []
    },
    clearSearchText () {
      // this.filter.id = -1
      // this.filter.text = ''
      // this.filter.value = ''
    },
    showSearchMore () {
      this.searchmore = !this.searchmore
    },
    searchMoreEmail () {
      let data = this.form
      this.$emit('searchMoreEmail', JSON.stringify(data))
    },
    resetSearchForm () {
      this.form.sender = ''
      this.form.recipient = ''
      this.form.title = ''
      this.form.content = ''
      this.form.level = '-1'
      this.form.annex = ''
      this.form.date = ''
    },
    sendEmail () {
      this.sendBtn = true
      this.reload()
      this.$global.IsShowEdit = true
      this.$router.push({ name: 'send', query: {id: 0, barName: 'add'} })
    },
    resetSendStyle (data) {
      this.sendBtn = data
    }
  }
}
</script>

<style lang="scss" scoped>
  .searchbar-container {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    margin: 0px 20px 0 20px;
    height: 60px;
    .search-input {
      width: 100%;
      margin-right: 10px;
      position: relative;
      .search-more {
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 3px;
        height: 100%;
        width: 25px;
        padding-top: 10px;
        padding-left: 5px;
      }
      .search-select {
        position: absolute;
        top: 36px;
        width: 228px;
        box-sizing: border-box;
        z-index: 1001;
        border-radius: 3px;
        background-color: #fff;
        ul {
          margin: 0;
          padding: 0;
          text-align: left;
          list-style: none;
          font-size: 12px;
          &.hasborder {
            border: 1px solid #DCDFE6;
            box-shadow: 0px 2px 5px 1px rgba(220,223,230,0.5);
            border-radius: 3px;
          }
        }
        li {
          background-color: #fff;
          width: 100%;
          &:hover {
            background-color: rgba(187,205,218,0.2);
            cursor: pointer
          }
        }
        .option {
          transition: all 0.5s;
          box-sizing: border-box;
          padding: 10px 15px;
          display: flex;
          .label {
            width: 60px;
            text-align: right;
          }
          .text {
            margin-left: 20px;
            width: 116px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .selectback {
        background-color: rgba(187,205,218,0.2) !important;
        cursor: pointer
      }
      .itemfade-enter,
      .itemfade-leave-active {
          opacity: 0;
      }
      .itemfade-leave-active {
          position: absolute;
      }
    }
    .search-btn {
      .el-button--medium {
        padding: 10px 12px;
        background-color: #fff;
        color: #3B5D95;
      }
      .clickStyle {
        background-color: #3B5D95;
        border-color: #3B5D95;
        color: #fff;
      }
    }
  }
  .search-more-btn {
    text-align: right;
    padding-right: 18px;
  }
</style>
