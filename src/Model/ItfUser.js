import moment from "moment";

class ItfUser {
  constructor(itfUserDto) {
    this.telegram_chat_id = itfUserDto.telegram_chat_id;
    this.is_ITT_team = itfUserDto.settings.is_ITT_team;
    this.isPro =
      itfUserDto.settings.is_ITT_team ||
      (itfUserDto.settings.staking && itfUserDto.settings.staking.diecimila) ||
      moment().isBefore(itfUserDto.settings.subscriptions.paid);
  }
}

export default ItfUser;
