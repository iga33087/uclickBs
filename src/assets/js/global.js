import { Promise } from "core-js"
import moment from "moment"

export default {
  delay(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, x);
    });
  },
  YYYYMMDD(x) {
    return moment(x).format("YYYY/MM/DD")
  },
  YYYYMMDDHHmm(x) {
    return moment(x).format("YYYY/MM/DD HH:mm")
  },
  getProjectTitle(list,x) {
    let arr=list.filter(res=> res.id==x)
    let res=arr[0] ? arr[0].title : "專案不存在"
    return res
  },
  fileToBase64(x) {
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = (e)=> {
        resolve(e.target.result)
      };
      fr.readAsDataURL(x);
    });
  }
}