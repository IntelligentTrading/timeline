import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'
import moment from 'moment'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        groups: [],
        prices: [],
        filters: [],
        horizons: ['1h', '4h', '24h'],
        sources: ['POLONIEX', 'BITTREX', 'BINANCE'],
        counterCurrencies: ['BTC', 'ETH', 'USDT', 'XMR'],
        signalTypes: ['ANN_Simple', 'RSI', "RSI_Cumulative", 'SMA', 'kumo_breakout', 'ANN_AnomalyPrc', "VBI"],
        telegram_chat_id: ''
    },
    mutations: {
        addGroup(state, group) {
            state.groups.push(group)
        },
        addPrice(state, price) {
            state.prices.push(price)
        },
        setTelegramChatId(state, telegram_chat_id) {
            console.log(telegram_chat_id)
            state.telegram_chat_id = telegram_chat_id
        }
    },
    getters: {
        telegramChatId(state) {
            return state.telegram_chat_id
        },
        signalTypes(state) {
            return state.signalTypes
        },
        counterCurrencies(state) {
            return state.counterCurrencies
        },
        sources(state) {
            return state.sources
        },
        horizons(state) {
            return state.horizons
        },
        groups(state) {
            return state.groups
        },
        prices(state) {
            return state.prices
        },
        timelineGroups(state) {
            return state.groups.map(g => {
                return {
                    id: `${g.id}-${g.h}-${g.s}-${g.cc}`,
                    content: g.id + `<br/><span style='font-size:12px;color:grey'>${g.h},${g.s},${g.cc}</span>`
                };
            });
        },
        timelineItems(state) {

            var items = state.groups.map(g => {
                return g.items.map(item => {
                    return {
                        id: item.id,
                        group: `${g.id}-${g.h}-${g.s}-${g.cc}`,
                        start: moment.parseZone(item.timestamp).local().format(),
                        signalType: item.signal,
                        value: item.rsi,
                        content: item.signal + item.rsi,
                        className: getItemClass(item),
                        price: item.price,
                        counterCurrency: g.cc
                    }
                });
            });

            return _.flatten(items)
        },
        dataSetItems(state) {
            var items = state.prices.map(p => {
                return p.items.map(item => {
                    return {
                        id: item.id,
                        x: moment.parseZone(item.timestamp).local().format(),
                        y: item.price,
                        className: item.trend > 0 ? 'vis-graph-group0 ' : 'vis-graph-group1',
                    }
                })
            });

            return _.flatten(items)
        }
    },
    actions: {
        async getHistory(context, { ticker, horizon, source, counterCurrency }) {
            console.log(`Loading history for ${ticker} ${horizon} ${source} ${counterCurrency}`)
            return api.getHistory(ticker, horizon, source, counterCurrency).then(history => {
                //build group
                var items = history.results.map(result => {
                    return {
                        id: result.id,
                        timestamp: result.timestamp,
                        trend: result.trend,
                        price: result.price,
                        signal: result.signal,
                        rsi: result.rsi_value ? `<span style='font-size:10px'> (${Math.round(result.rsi_value)})</span>` : ''
                    }
                })
                //var group = { ticker: ticker, items:}
                return context.commit('addGroup', { id: ticker, h: horizon, s: source, cc: counterCurrency, items: items })
            })
        },
        async getHistoryPrice(context, { ticker, source, counterCurrency }) {
            /*{
                "source": 2,
                "transaction_currency": "EOS",
                "counter_currency": 0,
                "timestamp": "2018-11-02T08:23:24.174000",
                "open_p": 82270,
                "high": 83090,
                "low": 81870,
                "close": 82780,
                "volume": 989443.81
            }*/
            console.log(`Loading history prices for ${ticker} ${source} ${counterCurrency}`)
            return api.getHistoryPrices(ticker, source, counterCurrency).then(history => {
                console.log(history)
                var items = history.results.map(result => {
                    return {
                        timestamp: result.timestamp,
                        price: result.close,
                    }
                })
                return context.commit('addPrice', { id: ticker, s: source, cc: counterCurrency, items: items })
            })
        },
        removeGroup(context, groupId) {
            return context.commit('removeGroup', groupId)
        }
    }
})

function getContent(item) {
    switch (item.signal) {
        case 'kumo_breakout': return 'Ichimoku';
        case 'ANN_Simple': return 'ANN_Simple';
    }
    return item.signal
}

function getItemClass(item) {
    var itemsWithoutMeaningFulTrendArray = ['ANN_AnomalyPrc']

    if (itemsWithoutMeaningFulTrendArray.includes(item.signal))
        return 'grey'
    else {
        return item.trend > 0 ? 'green' : 'red'
    }
}