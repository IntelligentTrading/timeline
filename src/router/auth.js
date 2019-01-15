import moment from "moment";
import ItfUser from "../Model/ItfUser";

export default {
  isAuth: () => {
    let itfUser = localStorage["user"];
    if (!itfUser) return false;

    itfUser = JSON.parse(itfUser);
    // ItfUser.isPro(itfUser) 
    return itfUser.eula && itfUser.auth_date && moment(itfUser.auth_date).add(12,'hours').isAfter(Date.now());
  }
};
