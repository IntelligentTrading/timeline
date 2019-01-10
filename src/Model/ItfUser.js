import moment from "moment";

class ItfUser {
  constructor(itfUserDto, telegramAuth) {
    this.telegram_chat_id = itfUserDto.telegram_chat_id;
    this.settings = itfUserDto.settings;
    this.eula = itfUserDto.eula;
    this.auth_date = telegramAuth.auth_date * 1000;
  }

  static isPro(obj) {
    return (
      obj.settings.is_ITT_team ||
      (obj.settings.staking && obj.settings.staking.diecimila) ||
      moment().isBefore(obj.settings.subscriptions.paid)
    );
  }
}

export default ItfUser;
