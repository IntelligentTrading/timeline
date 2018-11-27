const coreApiUrl = `https://${process.env.ITT_API_HOST}/v2`
const coreApiKey = process.env.ITT_API_KEY
const rp = require('request-promise')

const horizons = ['1h', '4h', '24h']
const sources = ['POLONIEX', 'BITTREX', 'BINANCE']
const counterCurrencies = ['BTC', 'ETH', 'USDT', 'XMR']

export default {
    getHistory: async (ticker, horizon, source, counterCurrency = 0) => {

        var options = {
            uri: `${coreApiUrl}/signals/?source=${sources.indexOf(source.toUpperCase())}&transaction_currency=${ticker}&counter_currency=${counterCurrencies.indexOf(counterCurrency.toUpperCase())}&horizon=${horizons.indexOf(horizon)}`,
            headers: {
                "API-KEY": coreApiKey,
                "Content-Type": "application/json"
            },
            json: true
        }

        return rp(options).then(data => {
            return data;
        }).catch(err => console.log(err));
    },
    getHistoryPrices: async (ticker, source, counterCurrency = 0) => {
        return fetch(`${coreApiUrl}/history-prices/?source=${sources.indexOf(source.toUpperCase())}&transaction_currency=${ticker}&counter_currency=${counterCurrencies.indexOf(counterCurrency.toUpperCase())}`, {
            headers: {
                "API-KEY": coreApiKey,
                "Content-Type": "application/json"
            },
            mode: "cors"
        }).then(result => {
            return result.json().then(data => {
                return data;
            });
        }).catch(err => console.log(err));
    }
}