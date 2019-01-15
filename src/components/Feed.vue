<template>
  <div>
    <div :class="this.loading ? 'disabledComponent' : ''">
      <el-row v-for="signal in this.signals" :key="signal.id">
        <signal :signalDto="signal"/>
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
      signals: []
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
    const socket = io(
      `${process.env.ITT_NODE_SERVICES.split("//")[1].split(":")[0]}`
    );

    socket.on("connect", () => {
      const user = JSON.parse(localStorage["user"]);
      socket.emit("subscribe", user.telegram_chat_id);
    });

    socket.on("info", data => {
      console.log(data);
    });

    socket.on("signal", signalData => {
      console.log(signalData)
      this.addSignalToFeed(signalData)
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
