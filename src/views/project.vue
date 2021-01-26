<template>
  <div class="project">
    <el-dialog :title="isAdd ? '新增':'編輯'" :visible.sync="showEdit" width="50%">
      <div class="formEdit">
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">專案名稱</div>
            <div class="formEditRowContent">
              <el-input v-model="form.title"/>
            </div>
          </div>
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">URL</div>
            <div class="formEditRowContent">
              <el-input v-model="form.url"/>
            </div>
          </div>
        </div>
        <div class="boxButtonList">
          <el-button type="danger" @click="showEdit=!showEdit">取消</el-button>
          <el-button type="success" @click="sub">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <PageMenu @search="search" @batchDelete="batchDelete">
      <el-button type="success" @click="add">新增</el-button>
    </PageMenu>
    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="title" label="專案名稱"></el-table-column>
      <el-table-column prop="url" label="URL"></el-table-column>
      <el-table-column prop="time" label="建立時間"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="goRight">
            <el-button type="warning" @click="edit(scope.row.id)">編輯</el-button>
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
      blank_form: {
        title:"",
        url:""
      },
      form: {
        title:"",
        url:""
      }
    }
  },
  async created() {
    this.$emit("currentRoute",this.$router.currentRoute)
    this.$store.dispatch("loading",true)
    await this.getData()
    this.$store.dispatch("loading",false)
  },
  methods: {
    async getData() {
      this.list=await this.$api.getProject()
    },
    async del(x) {
      let agree=confirm("確定刪除?")
      if(!agree) return 0
      this.$store.dispatch("loading",true)
      let flag=await this.$api.deleteProject(x)
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
        await this.$api.deleteProject(item.id)
      }
      await this.getData()
      this.$store.dispatch("loading",false)
    },
    handleSelectionChange(x) {
      this.handleSelectionChangeArr=x
      console.log(this.handleSelectionChangeArr)
    },
    async add() {
      this.form=JSON.parse(JSON.stringify(this.blank_form))
      this.isAdd=true
      this.showEdit=true
    },
    async edit (x) {
      this.$store.dispatch("loading",true)
      let data=await this.$api.getProjectById(x)
      this.form=data
      this.isAdd=false
      this.showEdit=true
      this.$store.dispatch("loading",false)
    },
    async sub() {
      this.$store.dispatch("loading",true)
      if(this.isAdd) {
        await this.$api.postProject(this.form)
      }
      else {
        await this.$api.putProject(this.form)
      }
      await this.getData()
      this.form=JSON.parse(JSON.stringify(this.blank_form))
      this.showEdit=false
      this.$store.dispatch("loading",false)
    }
  }
}
</script>