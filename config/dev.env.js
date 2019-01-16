"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ITT_API_HOST: `"${process.env.ITT_API_HOST}"`,
  ITT_API_KEY: `"${process.env.ITT_API_KEY}"`,
  ITT_NODE_SERVICES: `"${process.env.ITT_NODE_SERVICES}"`,
  NODE_SVC_API_KEY: `"${process.env.NODE_SVC_API_KEY}"`,
  TELEGRAM_BOT_NAME: `"${process.env.TELEGRAM_BOT_NAME.replace('@','')}"`,
  ITT_SOCKET: `"${process.env.ITT_SOCKET}"`
});
