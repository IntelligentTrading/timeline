<template>
  <div class="overviewWidget">
    <progress-line v-show="this.loading"></progress-line>
    <div :class="this.loading ? 'disabledComponent' : ''">
      <el-card
        class="info-card-placeholder"
        shadow="never"
        v-show="this.$props.pricesPayload == null"
      ></el-card>
      <el-card
        class="info-card"
        shadow="never"
        :style="this.$props.pricesPayload == null ? 'opacity:0' : 'opacity:1'"
      >
        <div slot="header" class="clearfix">
          <el-row>
            <span>{{this.$props.symbol.toUpperCase()}}</span>
          </el-row>
          <el-row>
            <span
              class="currentPrice"
            >{{this.$props.pricesPayload && this.$props.pricesPayload.current? this.$props.pricesPayload.current.close_price / Math.pow(10,8) : '--'}}</span>
            <el-radio-group
              :value="this.currentCounterCurrency"
              @input="changeCounterCurrency"
              fill="grey"
            >
              <el-radio-button label="BTC"></el-radio-button>
              <el-radio-button label="ETH"></el-radio-button>
              <el-radio-button label="USDT"></el-radio-button>
            </el-radio-group>
            <el-radio-group
              :value="this.currentExchange"
              @input="changeCurrentExchange"
              fill="grey"
            >
              <el-radio-button v-for="exchange in sources" :key="exchange" :label="exchange"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row
            :style="this.$props.pricesPayload && this.$props.pricesPayload.current && this.$props.pricesPayload.current.price_change_24h >=0 ? 'color: green;' : 'color:red'"
          >
            <div></div>
            <label>Price change 24h: {{this.$props.pricesPayload && this.$props.pricesPayload.current && this.$props.pricesPayload.current.price_change_24h >=0? '↑':'↓'}}{{this.$props.pricesPayload && this.$props.pricesPayload.current? (this.$props.pricesPayload.current.price_change_24h * 100).toFixed(2) : '--'}} %</label>
          </el-row>
        </div>
        <div
          class="no-data"
          v-show="!this.$props.pricesPayload || !this.$props.pricesPayload.prices"
        >
          <label>&lt; No data &gt;</label>
        </div>
        <apexchart
          type="area"
          ref="priceChart"
          :options="(this.$props.pricesPayload && this.$props.pricesPayload.chartOptions)|| {}"
          :series="(this.$props.pricesPayload ? this.$props.pricesPayload.prices : [])"
        ></apexchart>
      </el-card>
    </div>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters } from "vuex";
import ProgressLine from "./ProgressLine";

export default {
  name: "Apex",
  props: ["symbol", "pricesPayload", "loading"],
  data: function() {
    return {
      availableCounterCurrencies: []
    };
  },
  computed: {
    ...mapGetters(["currentCounterCurrency", "currentExchange", "sources"])
  },
  methods: {
    changeCounterCurrency(val) {
      this.$store.commit("setCurrentCounterCurrency", val);
    },
    changeCurrentExchange(val) {
      this.$store.commit("setCurrentExchange", val);
    }
  },
  components: { ProgressLine }
};
</script>

<style>
.overviewWidget {
  font-family: "Rubik";
  padding: 20px;
}

.info-card {
  text-align: left;
}

.info-card-placeholder {
  text-align: left;
  width: 100%;
  height: 400px;
}

.currentPrice {
  font-size: 28px;
}

.priceVariation {
  color: red;
}

.roundTag {
  border-radius: 20px;
  margin-left: 10px;
  vertical-align: super;
}

.el-radio-group {
  margin-bottom: 10px;
  margin-left: 10px;
}

.el-radio-button__inner {
  font-size: 10px !important;
  padding: 8px !important;
}

.no-data {
  display: flex;
  width: 600px;
  height: 400px;
  background: rgba(245, 244, 244, 0.9);
  align-items: center;
  position: fixed;
  justify-content: center;
  z-index: 1000;

  font-family: rubik;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>


