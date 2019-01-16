'use strict'
module.exports = {
  NODE_ENV: '"production"',
  ITT_API_HOST: `"${process.env.ITT_API_HOST}"`,
  ITT_API_KEY: `"${process.env.ITT_API_KEY}"`,
  ITT_NODE_SERVICES: `"${process.env.ITT_NODE_SERVICES}"`,
  NODE_SVC_API_KEY: `"${process.env.NODE_SVC_API_KEY}"`,
  TELEGRAM_BOT_NAME: `"${process.env.TELEGRAM_BOT_NAME.replace('@','')}"`,
  ITT_SOCKET: `"${process.env.ITT_SOCKET}"`
}
