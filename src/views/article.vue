<template>
  <div class="article">
    <input type="file" ref="uploadImg" @change="uploadImg" v-show="false">
    <el-dialog :title="isAdd ? '新增':'編輯'" :visible.sync="showEdit" width="50%">
      <div class="formEdit">
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">專案名稱</div>
            <div class="formEditRowContent">
              <el-select v-model="form.projectId" placeholder="請選擇">
                <el-option v-for="item in projectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">類型</div>
            <div class="formEditRowContent">
              <el-select v-model="form.tagId" placeholder="請選擇" v-if="form.projectId">
                <el-option v-for="(item,index) in filterTagList" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:100%;">
            <div class="formEditRowTitle">縮圖</div>
            <div class="formEditRowContent">
              <el-button type="primary" @click="$refs.uploadImg.click()">上傳圖片</el-button>
            </div>
          </div>
        </div>
        <img class="formEditImg" :src="form.img" v-if="form.img">
        <div class="formEditRow">
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">標題</div>
            <div class="formEditRowContent">
              <el-input v-model="form.title"/>
            </div>
          </div>
          <div class="formEditRowCell" style="width:50%;">
            <div class="formEditRowTitle">作者</div>
            <div class="formEditRowContent">
              <el-input v-model="form.author"/>
            </div>
          </div>
        </div>
        <quill-editor v-model="form.content"></quill-editor>
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
      <el-table-column prop="projectId" label="專案名稱">
        <template slot-scope="scope">
          {{$global.getProjectTitle(projectList,scope.row.projectId)}}
        </template>
      </el-table-column>
      <el-table-column prop="tagId" label="類型">
        <template slot-scope="scope">
          {{$global.getTagTitle(tagList,scope.row.tagId)}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="標題"></el-table-column>
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
      tagList:[],
      projectList: [],
      handleSelectionChangeArr: [],
      showEdit:false,
      isAdd:false,
      typeList: ["新聞","公告","維修","緊急","活動","其他"],
      blank_form: {
        projectId:"",
        title:"",
        author:"",
        type:"",
        content:"",
        img:"",
        tagId:""
      },
      form: {
        projectId:"",
        title:"",
        author:"",
        type:"",
        content:"",
        img:"",
        tagId:""
      }
    }
  },
  computed: {
    filterTagList() {
      let arr=this.tagList.filter(res=>res.projectId==this.form.projectId)
      return arr
    }
  },
  async created() {
    this.$emit("currentRoute",this.$router.currentRoute)
    this.$store.dispatch("loading",true)
    this.projectList=await this.$api.getProject()
    this.tagList=await this.$api.getTag()
    await this.getData()
    this.$store.dispatch("loading",false)
  },
  methods: {
    async getData() {
      this.list=await this.$api.getArticle()
    },
    async del(x) {
      let agree=confirm("確定刪除?")
      if(!agree) return 0
      this.$store.dispatch("loading",true)
      let flag=await this.$api.deleteArticle(x)
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
        await this.$api.deleteArticle(item.id)
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
      let data=await this.$api.getArticleById(x)
      this.form=data
      this.isAdd=false
      this.showEdit=true
      this.$store.dispatch("loading",false)
    },
    async sub() {
      this.$store.dispatch("loading",true)
      if(this.isAdd) {
        await this.$api.postArticle(this.form)
      }
      else {
        await this.$api.putArticle(this.form)
      }
      await this.getData()
      this.form=JSON.parse(JSON.stringify(this.blank_form))
      this.showEdit=false
      this.$store.dispatch("loading",false)
    },
    async uploadImg(e) {
      let file=e.target.files[0]
      this.form.img=await this.$global.fileToBase64(file)
    }
  }
}
</script>