<template>
<el-container>
  <el-main>
    <el-row :gutter=5 style='margin-bottom: 10px;'>
      <el-col :span=5>
         <el-select v-model="counterCurrency" placeholder="Quota Currency">
    <el-option v-for="item in counterCurrencies" :key="counterCurrencies.indexOf(item)" :label="item" :value="item">
    </el-option>
  </el-select>
       </el-col>
       <el-col :span=5>
         <el-select v-model="horizon" placeholder="Alert Validity">
    <el-option v-for="item in horizons" :key="horizons.indexOf(item)" :label="item" :value="item">
    </el-option>
  </el-select>
       </el-col>
          <el-col :span=5>
         <el-select v-model="source" placeholder="Exchange">
    <el-option v-for="item in sources" :key="sources.indexOf(item)" :label="item" :value="item">
    </el-option>
  </el-select>
       </el-col>
      <el-col :span=5>
      <el-input class='tickerInput' placeholder="Add ticker to the timeline" v-model='ticker' @keyup.enter.native="addTicker"></el-input>
      </el-col>
      <el-col :span=4>
      <el-button :loading=loading :disabled="ticker == ''" type="success" icon="el-icon-check" @click="addTicker">Add</el-button>
      </el-col>
    </el-row>
    <el-row style='text-align:left;margin-top:20px' :gutter=24>
      <el-col :span=2><span style="margin: 10px;vertical-align:sub">Ignore:</span></el-col>
      <el-col :span=22>
      <el-checkbox-group v-model="signalsToHide" size="mini">
          <el-checkbox-button v-for="signalType in signalTypes" :label="signalType" :key="signalType">{{signalType}}</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row style='margin-top:20px'>
    <el-tabs v-model="activeName" style='padding:10px'>
      <el-tab-pane label="Signals" name="signals">
        <timeline ref='tl' v-show="timelineGroups.length > 0" name='timeline' :items="filteredTimelineItems" :groups="timelineGroups" :options="opts"></timeline>
     <label style='color:lightgrey;font-size:10px' v-show="timelineGroups.length <= 0">Start adding tickers to see the signals timelines</label>
      </el-tab-pane>
      <el-tab-pane label="Trends" name="trends">
        <timeline v-on:click='check' ref='tltrend' v-show="timelineGroups.length > 0" name='timelineTrend' :items="trendTimeline" :groups="timelineGroups" :options="opts"></timeline>
        <label style='color:lightgrey;font-size:10px' v-show="timelineGroups.length <= 0">Start adding tickers to see the trend timelines</label>
      </el-tab-pane>
    </el-tabs>  
    </el-row>
  </el-main>
  <el-aside>
    <label style='font-size:10px'>{{contextualItems[0] != null ? contextualItems[0].group.replace('-',' ') : 'Click on a range (hour) to see the aggregated signals.'}}</label>
    <el-row v-for="contextualItem in contextualItems" v-bind:key="contextualItem.id">
      <el-card style='text-align:left;font-family: sans-serif; margin-top:5px' shadow=never>
      <div>
        <span style='font-weight: 100;'>{{contextualItem.signalType}}</span>
        <i v-show="contextualItem.className == 'green'" class="fas fa-arrow-up" style='color:green'></i>
        <i v-show="contextualItem.className == 'red'" class="fas fa-arrow-down" style='color:red'></i>
        <i v-show="contextualItem.className == 'grey'" class="fas fa-minus" style='color:grey'></i>

      </div>
        <div>
          <span class='price'>{{contextualItem.counterCurrency == 'BTC' ? contextualItem.price / Math.pow(10,8) : contextualItem.price/ Math.pow(10,8)}}</span>
          <span class='price'>{{contextualItem.counterCurrency}}</span>
          </div>
        <div class="bottom clearfix">
          <time class="time">{{contextualItem.start }}</time>
        </div>
        </el-card>
    </el-row>
  </el-aside>
  </el-container>
</template>

<script>
import { Timeline, Graph2d } from "vue2vis";
import moment from "moment";
import "vue2vis/dist/vue2vis.css";
import { mapActions, mapGetters } from "vuex";
import _ from "lodash";

var timelineStart = moment()
  .startOf("hour")
  .add(-5, "days")
  .local();
var timelineEnd = moment()
  .startOf("hour")
  .add(4, "hours")
  .local();

export default {
  name: "SignalLine",
  components: { Timeline, Graph2d },
  data() {
    return {
      chat_id: "",
      activeName: "signals",
      ticker: "",
      horizon: "1h",
      source: "Binance",
      counterCurrency: "BTC",
      signalsToHide: [],
      loading: false,
      opts: {
        editable: false,
        start: timelineStart,
        end: timelineEnd
      },
      barOpts: {
        start: timelineStart,
        end: timelineEnd,
        style: "bar"
      },
      selectedRange: null,
      contextualItems: []
    };
  },
  computed: {
    ...mapGetters([
      "groups",
      "timelineGroups",
      "timelineItems",
      "horizons",
      "sources",
      "counterCurrencies",
      "dataSetItems",
      "signalTypes"
    ]),
    filteredTimelineItems: function() {
      return this.timelineItems.filter(
        item => !this.signalsToHide.includes(item.content.split("<")[0])
      );
    },
    trendTimeline: function() {
      var timelineItems = [];

      var timelineItemsGroups = _.groupBy(this.filteredTimelineItems, ti => {
        return ti.group;
      });

      console.log(timelineItemsGroups);

      Object.keys(timelineItemsGroups).forEach(key => {
        var groupedTimelineObjects = _.groupBy(timelineItemsGroups[key], ti => {
          return moment(ti.start).startOf("hour");
        });

        Object.keys(groupedTimelineObjects).forEach(gtok => {
          groupedTimelineObjects[gtok].trend = _.reduce(
            groupedTimelineObjects[gtok],
            (trend, ti) => {
              var classTrends = ["red", "grey", "green"];
              return trend + classTrends.indexOf(ti.className) - 1;
            },
            0
          );

          var backgroundItem = {
            id: `background-${groupedTimelineObjects[gtok][0].group}-${gtok}`,
            group: groupedTimelineObjects[gtok][0].group,
            start: moment(gtok),
            end: moment(gtok).add(1, "hour"),
            type: "background",
            className:
              groupedTimelineObjects[gtok].trend < 0
                ? "bgred"
                : groupedTimelineObjects[gtok].trend > 0
                  ? "bggreen"
                  : "bggrey"
          };
          timelineItems.push(backgroundItem);
        });
      });

      return timelineItems;
    }
  },
  methods: {
    ...mapActions(["getHistory", "getHistoryPrice"]),
    auth: function() {
      this.$prompt(
        "Please input your telegram chat id (Run <code>/getme</code> in the chat bot).",
        "ITF timeline",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          dangerouslyUseHTMLString: true
        }
      )
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "Your chat id is:" + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Input canceled"
          });
        });
    },
    addTicker: function() {
      this.loading = true;
      return Promise.all([
        this.getHistory({
          ticker: this.ticker,
          horizon: this.horizon,
          source: this.source,
          counterCurrency: this.counterCurrency
        })
      ]).then(histories => {
        this.ticker = "";
        this.loading = false;
        this.$refs.tl.redraw();
        this.$refs.tltrend.redraw();
      });
    },
    remove: function(gid) {
      
    },
    check: function(event) {
      this.selectedRange = event;
      this.$nextTick(() => {
        console.log(this.selectedRange);
        if (!this.selectedRange) this.contextualItems = [];
        else {
          this.contextualItems = this.filteredTimelineItems.filter(
            fti =>
              this.selectedRange.group == fti.group &&
              moment(fti.start)
                .startOf("hour")
                .isSame(moment(this.selectedRange.time).startOf("hour"))
          );
        }

        console.log(this.contextualItems);
      });
    }
  },
  beforeMount() {
    //this.auth();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: grey !important;
  border-color: grey !important;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.price {
  font-size: 12px;
}
</style>
