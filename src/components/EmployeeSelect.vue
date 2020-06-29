<template>
  <div class="employee-select-container">
    <el-dialog v-dialog-drag class="abow-dialog" :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" :append-to-body="true">
      <div class="select-content">
        <div class="top">
          <el-button type="text" :class="[{tabActives:tabActive==item.id}]" @click="tabClick(item)" v-for="(item, i) in tabItems" :key="i">{{item.text}}</el-button>
        </div>
        <div class="content">
          <div class="card">
            <div class="header">
              <el-input clearable placeholder="搜索" v-model="filterEmployee" suffix-icon="el-icon-search" style="width:100%;"></el-input>
            </div>
            <div class="section">
              <div class="top">
                <div class="title">{{tabTitle}}</div>
                <div class="qty"></div>
              </div>
              <div class="list" v-show="tabActive==1">
                <div class="" v-if="recentSearch===false">
                  <div class="item" :class="[{isChecked: item.checked}]" v-for="(item, i) in recentlist" :key="i">
                    <div class="left">
                      <el-avatar shape="square" :size="30" :src="item.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                      <div class="name">{{item.name}}</div>
                    </div>
                    <div class="right">
                      <div class="position">{{item.position}}</div>
                      <div class="addicon" @click="addSelected(item)">
                        <i :class="item.checked ? 'el-icon-success' : 'el-icon-circle-plus-outline'"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="" v-else>
                  <div class="item" :class="[{isChecked: item.checked}]" v-for="(item, i) in recentsearchlist" :key="i">
                    <div class="left">
                      <el-avatar shape="square" :size="30" :src="item.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                      <div class="name">{{item.name}}</div>
                    </div>
                    <div class="right">
                      <div class="position">{{item.position}}</div>
                      <div class="addicon" @click="addSelected(item)"><i v-bind:class=" !item.checked ? 'el-icon-circle-plus-outline' : 'el-icon-circle-check'"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list" v-show="tabActive==2">
                <div class="list" v-if="deptSearch===false">
                  <div class="item" :class="[{isChecked: item.checked}]" v-for="(item, i) in deptlist" :key="i">
                    <div class="left">
                      <el-avatar shape="square" :size="30" :src="item.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                      <div class="name">{{item.Name}}</div>
                    </div>
                    <div class="right">
                      <div class="position">{{item.DepartmentName}}</div>
                      <div class="addicon" @click="addSelected(item)"><i v-bind:class=" !item.checked ? 'el-icon-circle-plus-outline' : 'el-icon-circle-check'" ></i></div>
                    </div>
                  </div>
                </div>
                <div class="list" v-else>
                  <div class="item" :class="[{isChecked: item.checked}]" v-for="(item, i) in deptsearchlist" :key="i">
                    <div class="left">
                      <el-avatar shape="square" :size="30" :src="item.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                      <div class="name">{{item.Name}}</div>
                    </div>
                    <div class="right">
                      <div class="position">{{item.DepartmentName}}</div>
                      <div class="addicon" @click="addSelected(item)"><i v-bind:class=" !item.checked ? 'el-icon-circle-plus-outline' : 'el-icon-circle-check'"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list" v-show="tabActive==3">
                <el-tree show-checkbox ref="tree" :props="employeeTreeProps" :data="orglist" node-key="DataId" @check="nodeClick" :filter-node-method="filterNode" :expand-on-click-node="true" :highlight-current="true">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <!-- <i :class="data.icon"></i> -->
                      {{ data.Name }}
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="header">
              <el-input clearable placeholder="搜索" v-model="filterSelected" suffix-icon="el-icon-search" style="width:100%;"></el-input>
            </div>
            <div class="section">
              <div class="top">
                <div class="title">已选择项</div>
                <div class="qty">{{tabQty}}</div>
              </div>
              <div class="list" v-if="selectedSearch===false">
                <div class="item" v-for="(item, i) in selectedlist" :key="i">
                  <div class="left">
                    <el-avatar shape="square" :size="30" :src="item.ItemData.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                    <div class="name">{{item.Name}}</div>
                  </div>
                  <div class="right">
                    <div class="position">{{item.ItemData.DepartmentName}}</div>
                    <div class="removeicon" @click="removeSelected(item)"><i class="el-icon-error"></i></div>
                  </div>
                </div>
              </div>
              <div class="list" v-else>
                <div class="item" v-for="(item, i) in selectedsearchlist" :key="i">
                  <div class="left">
                    <el-avatar shape="square" :size="30" :src="item.ItemData.Sex === 1 ? require('@/assets/man.png') : require('@/assets/female.png')"></el-avatar>
                    <div class="name">{{item.Name}}</div>
                  </div>
                  <div class="right">
                    <div class="position">{{item.ItemData.DepartmentName}}</div>
                    <div class="removeicon" @click="removeSelected(item)"><i class="el-icon-error"></i></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { OrgMemberTree, OrgdepatTree } from '@/api/lq.email.js'

export default {
  name: 'EmployeeSelect',
  data () {
    return {
      tabQty: 0,
      tabTitle: '',
      tabItems: [
        {
          id: 2,
          text: '同部门'
        },
        {
          id: 3,
          text: '组织架构'
        }
      ],
      dialogTitle: '选择人员',
      dialogVisible: false,
      tabActive: 2,
      itemActive: 0,
      filterEmployee: '',
      filterSelected: '',
      recentSearch: false,
      recentlist: [],
      recentsearchlist: [],
      deptSearch: false,
      deptlist: [],
      deptsearchlist: [],
      employeeTreeProps: {
        children: 'Children',
        label: 'Name'
      },
      orglist: [],
      selectedSearch: false,
      selectedlist: [],
      selectedsearchlist: []
    }
  },
  watch: {
    filterEmployee (val) {
      if (this.tabActive === 1) {
        if (val) {
          this.recentSearch = true
          let oldlist = this.recentlist
          let newlist = oldlist.filter(t => t.Name.indexOf(val) > -1 || (t.JobNo && t.JobNo.indexOf(val) > -1) || t.NamePinYin.toLowerCase().indexOf(val.toLowerCase()) > -1)
          if (val) {
            this.recentsearchlist = newlist
          }
        } else {
          this.recentSearch = false
          this.recentsearchlist = []
        }
      }
      if (this.tabActive === 2) {
        if (val) {
          this.deptSearch = true
          let oldlistDept = this.deptlist
          let newlist = oldlistDept.filter(t => t.Name.indexOf(val) > -1 || (t.JobNo && t.JobNo.indexOf(val) > -1) || t.NamePinYin.toLowerCase().indexOf(val.toLowerCase()) > -1)
          if (val) {
            this.deptsearchlist = newlist
          }
        } else {
          this.deptSearch = false
          this.deptsearchlist = []
        }
      }
      if (this.tabActive === 3) {
        this.$refs.tree.filter(val)
      }
    },
    filterSelected (val) {
      if (val) {
        this.selectedSearch = true
        let oldlistOrg = this.selectedlist
        let newlist = oldlistOrg.filter(t => t.Name.toLowerCase().indexOf(val.toLowerCase()) > -1 || (t.JobNo && t.JobNo.indexOf(val) > -1) || t.NamePinYin.toLowerCase().indexOf(val.toLowerCase()) > -1)
        if (val) {
          this.selectedsearchlist = newlist
        }
      } else {
        this.selectedSearch = false
        this.selectedsearchlist = []
      }
    }
  },
  created () {
    // 获取组织架构
    this.loadOrgTree()
    // 获取同部门
    this.departmentList()
  },
  mounted () {
    this.tabTitle = this.tabItems[0].text
  },
  methods: {
    // 获取组织架构
    async loadOrgTree () {
      let data = await OrgMemberTree()
      if (data.Success) {
        let result = data.Result
        this.orglist = result
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    // 获取部门人员
    async departmentList () {
      let data = await OrgdepatTree()
      if (data.Success) {
        let result = data.Result
        result.forEach(t => {
          t.DataId = t.UserId
          t.checked = false
        })
        this.deptlist = result
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    init (dialogTitle) {
      this.dialogVisible = true
      this.dialogTitle = dialogTitle
      this.selectedlist = []
      this.tabQty = 0
      this.loadOrgTree()
      this.departmentList()
    },
    tabClick (item) {
      this.tabActive = item.id
      this.tabTitle = item.text
    },
    addSelected (item) {
      item.checked = true
      item.DataId = item.UserId
      item.ItemData = {}
      item.ItemData.Sex = item.Sex
      item.ItemData.DepartmentName = item.DepartmentName
      item.ItemData.JobNo = item.JobNo
      item.ItemData.UserId = item.UserId
      this.itemActive = item.UserId
      let exist = this.selectedlist.filter(t => t.UserId === item.UserId)
      if (exist.length <= 0) {
        this.selectedlist.push(item)
      }
      this.$refs.tree.setChecked(item.UserId, true)
      this.tabQty = this.selectedlist.length
    },
    removeSelected (item) {
      this.deptlist.forEach(t => {
        if (t.UserId === item.UserId) {
          t.checked = false
        }
      })
      this.selectedlist.splice(this.selectedlist.findIndex(t => t.ItemData.UserId === item.DataId), 1)
      this.$refs.tree.setChecked(item.DataId, false)
      this.tabQty = this.selectedlist.length
    },
    nodeClick (data, checked, node) {
      let parentArr = this.$refs.tree.getHalfCheckedNodes()
      let childArr = this.$refs.tree.getCheckedNodes()
      let datas = parentArr.concat(childArr)
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i]
        item.UserId = item.DataId
        let exist = this.selectedlist.filter(t => t.ItemData.UserId === item.ItemData.UserId)
        if (item.ItemData.JobNo && exist.length <= 0) {
          this.selectedlist.push(item)
          this.deptlist.forEach(t => {
            if (t.UserId === item.UserId) {
              t.checked = true
            }
          })
        }
      }
      let orgselectedlist = this.selectedlist.filter(t => t.ItemData.JobNo)
      let removelist = [...orgselectedlist].filter(x => [...datas].every(y => y.ItemData.UserId !== x.ItemData.UserId))
      for (let i = 0; i < removelist.length; i++) {
        let item = removelist[i]
        this.selectedlist.splice(this.selectedlist.findIndex(t => t.ItemData.UserId === item.ItemData.UserId), 1)
        this.deptlist.forEach(t => {
          if (t.UserId === item.ItemData.UserId) {
            t.checked = false
          }
        })
      }
      this.tabQty = this.selectedlist.length
    },
    filterNode (value, data) {
      if (!value) return true
      return data.Name.indexOf(value) > -1 || (data.ItemData.JobNo && data.ItemData.JobNo.indexOf(value) > -1) || (data.ItemData.NamePinYin && data.ItemData.NamePinYin.toLowerCase().indexOf(value.toLowerCase()) > -1)
    },
    closeDialog () {
      this.dialogVisible = false
      this.$emit('closeDialog', this.selectedlist)
    },
    loadEmployeeNode (node, resolve) {
      if (node.level === 0) {
        this.getRootInfo(resolve)
      } else {
        this.getChildNode(node, resolve)
      }
    },
    getRootInfo (resolve) {
      let root = [{ id: null, label: '深圳凌启电子有限公司' }]
      setTimeout(function () {
        resolve(root)
      }, 500)
    },
    getChildNode (node, resolve) {
      let parentId = node.data.id
      let root = []
      if (parentId == null) {
        root = [{ id: 2, label: '人力行政部', dept: true, leaf: false }, { id: 3, label: '财务部', dept: true, leaf: true }, { id: 500, label: '陈世美', dept: false, leaf: true }]
      }
      if (parentId === 2) {
        root = [{ id: 21, label: '人力资源', dept: true, leaf: false }, { id: 22, label: '行政', dept: true, leaf: true }]
      }
      if (parentId === 21) {
        root = [{ id: 211, label: '江一闻', dept: false, leaf: true }, { id: 212, label: '刘顺丰', dept: false, leaf: true }]
      }
      setTimeout(function () {
        resolve(root)
      }, 500)
    }
  }
}
</script>

<style lang="scss">
  .employee-select-container {
    display: flex;
  }
  .el-dialog__body {
    .select-content {
      display: flex;
      flex: 1;
      flex-flow: column;
      overflow: auto;
      .top {
        margin: 10px 20px 0 20px;
        .el-button--text {
          color: #333;
        }
        .tabActives {
          color: #3B5D95;
        }
      }
      .content {
        display: flex;
        flex: 1;
        flex-flow: row;
        overflow: auto;
        .card {
          overflow: hidden;
          background: #fff;
          display: inline-block;
          vertical-align: middle;
          max-height: 100%;
          box-sizing: border-box;
          position: relative;
          margin: 10px 20px 0 20px;
          display: flex;
          flex-flow: column;
          flex: 1;
          .header {
            margin: 3px;
            box-sizing: border-box;
          }
          .section {
            margin: 3px;
            flex: 1;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            overflow: auto;
            .top {
              height: 40px;
              line-height: 40px;
              background: #f5f7fa;
              margin: 0;
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #ebeef5;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
            }
            .list {
              height: calc(100% - 40px);
              display: flex;
              flex-flow: column;
              flex: 1;
              overflow: auto;
              .item {
                height: 50px;
                min-height: 50px;
                display: flex;
                flex-flow: row;
                justify-content: space-between;
                align-items: center;
                padding: 10px 10px;
                cursor: pointer;
                &:hover {
                  background-color:rgba(187,205,218,0.2);
                }
                .left {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-right: 20px;
                  .name {
                    margin-left: 10px;
                    width: 75px;
                  }
                }
                .right {
                  display: flex;
                  height: 30px;
                  justify-content: space-between;
                  align-items: center;
                  position: relative;
                  width: 70%;
                  float: right;
                  .position {
                    position:absolute;
                    left: 0px;
                    right: 15px;
                    overflow: hidden;
                    line-height: 30px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: right;
                    padding-right: 10px;
                  }
                  .addicon {
                    position:absolute;
                    top: 5px;
                    right: 0px;
                    font-size: 20px;
                    &:hover {
                      color: #3B5D95;
                    }
                  }
                  .removeicon {
                    color: #999;
                    margin-left: 10px;
                    font-size: 20px;
                    position: absolute;
                    right: 0px;
                    &:hover {
                      color: #3B5D95;
                    }
                  }
                }
              }
              .isChecked {
                color: #ccc;
                .right {
                  .addicon {
                    &:hover {
                      color: #ccc;
                    }
                  }
                }
              }
            }
          }
        }
        .btn-group {
          overflow: hidden;
          background: #fff;
          display: inline-block;
          vertical-align: middle;
          max-height: 100%;
          box-sizing: border-box;
          position: relative;
          margin: 20px 0;
          display: flex;
          flex-flow: column;
          .list-item {
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            .btn {
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
  .abow-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /deep/ {
      .el-dialog {
        margin: 0 auto !important;
        height: 75%;
        overflow: hidden;
        position: relative;
        min-width: 700px;
        .el-dialog__header {
          background-color: rgba(187, 205, 218, .2);
        }
        .el-dialog__body {
          position: absolute;
          left: 0;
          top: 54px;
          bottom: 66px;
          right: 0;
          padding: 0;
          z-index: 1;
          overflow: hidden;
          overflow-y: auto;
          display: flex;
          flex: 1;
          min-height: 0;
        }
        .el-dialog__footer {
          height: 66px;
          position: absolute;
          left: 0;
          top: calc(100% - 66px);
          bottom: 66px;
          right: 0;
          background-color: rgba(187, 205, 218, .2);
          padding-top: 17px;
        }
      }
    }
  }
</style>
