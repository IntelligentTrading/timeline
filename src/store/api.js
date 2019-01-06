const coreApiUrl = `https://${process.env.ITT_API_HOST}/v2`;
const coreApiKey = process.env.ITT_API_KEY;
const svcApiUrl = `${process.env.ITT_NODE_SERVICES}/api`;
const svcApiKey = process.env.NODE_SVC_API_KEY;
const rp = require("request-promise");

const horizons = ["1h", "4h", "24h"];
const sources = ["POLONIEX", "BITTREX", "BINANCE"];
const counterCurrencies = ["BTC", "ETH", "USDT", "XMR"];

export default {
  getHistory: async (ticker, horizon, source, counterCurrency) => {
    let filters = "";
    filters += horizon != null ? `&horizon=${horizons.indexOf(horizon)}` : "";
    filters +=
      source != null ? `&source=${sources.indexOf(source.toUpperCase())}` : "";
    filters +=
      counterCurrency != null
        ? `&counter_currency=${counterCurrencies.indexOf(
            counterCurrency.toUpperCase()
          )}`
        : "";

    var options = {
      uri: `${coreApiUrl}/signals/?page_size=100&transaction_currency=${ticker.toUpperCase()}${filters}`,
      headers: {
        Authorization: `Token ${coreApiKey}`,
        "Content-Type": "application/json"
      },
      json: true
    };

    return rp(options).catch(err => console.log(err.message));
  },
  getHistories: async () => {
    var options = {
      uri: `${coreApiUrl}/signals/?page_size=100`,
      headers: {
        Authorization: `Token ${coreApiKey}`,
        "Content-Type": "application/json"
      },
      json: true
    };

    return rp(options)
      .then(data => {
        return data.results;
      })
      .catch(err => console.log(err.message));
  },
  getHistoryPrices: async (
    ticker,
    counterCurrency = "BTC",
    source = "BINANCE"
  ) => {
    var options = {
      uri: `${coreApiUrl}/resampled-prices/?source=${sources.indexOf(
        source.toUpperCase()
      )}&transaction_currency=${ticker.toUpperCase()}&counter_currency=${counterCurrencies.indexOf(
        counterCurrency.toUpperCase()
      )}`,
      headers: {
        Authorization: `Token ${coreApiKey}`,
        "Content-Type": "application/json"
      },
      json: true
    };
    return rp(options).catch(err => console.log(err));
  },
  getPrice: async (ticker, counterCurrency = "BTC") => {
    var options = {
      uri: `${coreApiUrl}/resampled-prices?transaction_currency=${ticker}&source=2&counter_currency=${counterCurrencies.indexOf(
        counterCurrency
      )}&page_size=1`,
      headers: {
        Authorization: `Token ${coreApiKey}`,
        "Content-Type": "application/json"
      },
      json: true
    };

    return rp(options)
      .then(data => {
        return data.results.length > 0 ? data.results[0] : Number.NaN;
      })
      .catch(err => console.log(err));
  },
  topCoins: async () => {
    var options = {
      uri: `${coreApiUrl}/signals/coins-with-most-signals/`,
      headers: {
        Authorization: `Token ${coreApiKey}`
      },
      json: true
    };

    return rp(options)
      .then(data => {
        return data;
      })
      .catch(err => console.log(err.message));
  },
  user: async telegram_chat_id => {
    return rp(`${svcApiUrl}/users/${telegram_chat_id}`, {
      headers: { "NSVC-API-KEY": svcApiKey }
    });
  }
};
