import moment from "moment";

class ItfUser {
  constructor(itfUserDto) {
    console.log(itfUserDto);
    this.telegram_chat_id = itfUserDto.telegram_chat_id;
    this.is_ITT_team = itfUserDto.is_ITT_team;
    this.isPro =
      itfUserDto.is_ITT_team ||
      (itfUserDto.settings.staking && itfUserDto.settings.staking.diecimila) ||
      moment().isBefore(itfUserDto.settings.subscriptions.paid);
  }
}

export default ItfUser;
