'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ITT_API_HOST: `"${process.env.ITT_API_HOST}"`,
  ITT_API_KEY: `"${process.env.ITT_API_KEY}"`,
})
