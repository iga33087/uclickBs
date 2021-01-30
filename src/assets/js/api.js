import axios from "axios"
import router from '@/router'

let baseUrl=process.env.VUE_APP_OIDC_BASEURL

axios.interceptors.request.use(
  config => {
    config.headers = { // 如果沒有cors的問題則可以都不加
      "token": localStorage.token,
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    if(response.data=="token invalid") {
      alert("認證已過期，請重新登入")
      router.push({name:"login"})
      localStorage.token=""
    }
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 404:
          console.log("找不到該頁面");
          break;
        case 500:
          console.log("伺服器出錯");
          break;
        case 503:
          console.log("服務失效");
          break;
        default:
          console.log(`連接錯誤${err.response.status}`);
      }
    } else {
      console.log("連接到服務器失敗");
    }
    return Promise.resolve(err.response);
  }
);

export default {
  testReq(x) {
    return axios.post(baseUrl+"testReq",x).then(res=>res.data)
  },
  login(x) {
    return axios.post(baseUrl+"login",x).then(res=>res.data)
  },
  getUserInfoByToken() {
    return axios.post(baseUrl+"userInfoByToken").then(res=>res.data)
  },
  getProject() {
    return axios.get(baseUrl+"Project").then(res=>res.data)
  },
  getProjectById(x) {
    return axios.get(baseUrl+"ProjectById?id="+x).then(res=>res.data)
  },
  postProject(x) {
    return axios.post(baseUrl+"Project",x).then(res=>res.data)
  },
  putProject(x) {
    return axios.put(baseUrl+"Project",x).then(res=>res.data)
  },
  deleteProject(x) {
    return axios.delete(baseUrl+"Project?id="+x).then(res=>res.data)
  },
  getMail() {
    return axios.get(baseUrl+"Mail").then(res=>res.data)
  },
  getMailById(x) {
    return axios.get(baseUrl+"MailById?id="+x).then(res=>res.data)
  },
  putMail() {
    return axios.put(baseUrl+"Mail").then(res=>res.data)
  },
  deleteMail(x) {
    return axios.delete(baseUrl+"Mail?id="+x).then(res=>res.data)
  },
  getArticle() {
    return axios.get(baseUrl+"Article").then(res=>res.data)
  },
  getArticleById(x) {
    return axios.get(baseUrl+"ArticleById?id="+x).then(res=>res.data)
  },
  postArticle(x) {
    return axios.post(baseUrl+"Article",x).then(res=>res.data)
  },
  putArticle(x) {
    return axios.put(baseUrl+"Article",x).then(res=>res.data)
  },
  deleteArticle(x) {
    return axios.delete(baseUrl+"Article?id="+x).then(res=>res.data)
  },
  getTag() {
    return axios.get(baseUrl+"Tag").then(res=>res.data)
  },
  getTagById(x) {
    return axios.get(baseUrl+"TagById?id="+x).then(res=>res.data)
  },
  postTag(x) {
    return axios.post(baseUrl+"Tag",x).then(res=>res.data)
  },
  putTag(x) {
    return axios.put(baseUrl+"Tag",x).then(res=>res.data)
  },
  deleteTag(x) {
    return axios.delete(baseUrl+"Tag?id="+x).then(res=>res.data)
  }
}