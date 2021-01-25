<template>
  <div class="mail">
    <el-dialog :title="isAdd ? '新增':'編輯'" :visible.sync="showEdit" width="50%">
      <div class="formEdit">
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">專案名稱</div>
            <div class="formEditRowContent">
              {{$global.getProjectTitle(projectList,form.projectId)}}
            </div>
          </div>
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">姓名</div>
            <div class="formEditRowContent">
              {{form.name}}
            </div>
          </div>
        </div>
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:100%;">
            <div class="formEditRowTitle">信箱</div>
            <div class="formEditRowContent">
              {{form.email}}
            </div>
          </div>
        </div>
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">手機</div>
            <div class="formEditRowContent">
              {{form.email}}
            </div>
          </div>
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">公司名</div>
            <div class="formEditRowContent">
              {{form.company}}
            </div>
          </div>
        </div>
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:100%;">
            <div class="formEditRowTitle">內容</div>
            <div class="formEditRowContent">
              {{form.content}}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <PageMenu @search="search" @batchDelete="batchDelete">
    </PageMenu>
    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="projectId" label="專案名稱">
        <template slot-scope="scope">
          {{$global.getProjectTitle(projectList,scope.row.projectId)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="手機"></el-table-column>
      <el-table-column prop="email" label="email"></el-table-column>
      <el-table-column prop="time" label="建立時間"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="goRight">
            <el-button type="warning" @click="edit(scope.row.id)">詳細</el-button>
            <el-button type="danger" @click="del(scope.row.id)">刪除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PageMenu from "@/components/PageMenu"

export default {
  components:{PageMenu},
  data() {
    return {
      list:[],
      handleSelectionChangeArr:[],
      isAdd:false,
      showEdit:false,
      projectList:[],
      form: {
        name:"",
        phone:"",
        email:"",
        company:"",
        content:"",
        project:"",
        time:""
      }
    }
  },
  async created() {
    this.$emit("currentRoute",this.$router.currentRoute)
    this.$store.dispatch("loading",true)
    this.projectList=await this.$api.getProject()
    await this.getData()
    this.$store.dispatch("loading",false)
  },
  methods: {
    async getData() {
      this.list=await this.$api.getMail()
    },
    async del(x) {
      let agree=confirm("確定刪除?")
      if(!agree) return 0
      this.$store.dispatch("loading",true)
      let flag=await this.$api.deleteMail(x)
      if(flag=="token invalid") {
        this.$store.dispatch("loading",false)
        return 0
      }
      await this.getData()
      this.$message({
        message: '刪除成功',
        type: 'success'
      });
      this.$store.dispatch("loading",false)
    },
    search(x) {
      alert(x)
    },
    async batchDelete() {
      if(!this.handleSelectionChangeArr.length) return 0
      this.$store.dispatch("loading",true)
      for(let item of this.handleSelectionChangeArr) {
        await this.$api.deleteMail(item.id)
      }
      await this.getData()
      this.$store.dispatch("loading",false)
    },
    handleSelectionChange(x) {
      this.handleSelectionChangeArr=x
      console.log(this.handleSelectionChangeArr)
    },
    async add() {
      this.form=this.blank_form
      this.isAdd=true
      this.showEdit=true
    },
    async edit (x) {
      this.$store.dispatch("loading",true)
      let data=await this.$api.getMailById(x)
      this.form=data
      this.isAdd=false
      this.showEdit=true
      this.$store.dispatch("loading",false)
    },
    async sub() {
      this.$store.dispatch("loading",true)
      if(this.isAdd) {
        await this.$api.postMail(this.form)
      }
      else {
        await this.$api.putMail(this.form)
      }
      await this.getData()
      this.form=this.blank_form
      this.showEdit=false
      this.$store.dispatch("loading",false)
    }
  }
}
</script>