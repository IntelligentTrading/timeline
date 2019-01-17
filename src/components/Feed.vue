<template>
  <div>
    <div :class="this.loading ? 'disabledComponent' : ''">
      <label
        v-show="!this.signals || this.signals.length <= 0"
        style="font-size:9px"
      >{{this.feedSocketOpen ? 'Signals will start coming soon.' : 'Connecting to live feed...'}}</label>
      <el-row v-for="signal in this.signals" :key="signal.id">
        <signal :clickEnabled="true" :signalDto="signal"/>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters, mapState } from "vuex";
import Signal from "./Signal";
import ProgressLine from "./ProgressLine";
import io from "socket.io-client";

export default {
  name: "Feed",
  props: ["loading"],
  data() {
    return {
      signals: [],
      feedSocketOpen: false
    };
  },
  components: { Signal, ProgressLine },
  computed: {
    ...mapGetters(["horizons", "sources", "counterCurrencies"])
  },
  methods: {
    addSignalToFeed(signalData) {
      this.signals.push(signalData);
    }
  },
  mounted() {
    const socket = io(process.env.ITT_SOCKET);

    setInterval(() => {
      this.feedSocketOpen = false;
    }, 60000);

    socket.on("connect", () => {
      const user = JSON.parse(localStorage["user"]);
      socket.emit("subscribe", user.telegram_chat_id);
    });

    socket.on("info", data => {
      console.log(data);
      this.feedSocketOpen = true;
    });

    socket.on("heartbeat", hb => {
      console.log("Received heartbeat!");
      this.feedSocketOpen = true;
    });

    socket.on("signal", signalData => {
      this.addSignalToFeed(signalData);
    });
  }
};
</script>

<style>
th {
  font-size: 10px;
}

tfoot {
  vertical-align: bottom;
}

.positive {
  color: green;
}
.negative {
  color: red;
}
.neutral {
  color: gray;
}
</style>
