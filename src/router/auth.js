import moment from "moment";
import ItfUser from "../Model/ItfUser";

export default {
  isAuth: () => {
    let itfUser = localStorage["user"];
    if (!itfUser) return false;

    itfUser = JSON.parse(itfUser);
    return ItfUser.isPro(itfUser) && itfUser.auth_date && moment(itfUser.auth_date).add(12,'hours').isAfter(Date.now());
  }
};
