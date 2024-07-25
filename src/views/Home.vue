<template>
    <!-- <v-row class="d-flex pa-0">
        <v-col cols="4" class="pa-0">
            <TimeList
                style="height: 100vh"
                :time="time"
                @time-deleted="
                    (i) => {
                        timeRemoved++;
                    }
                " />
        </v-col>
        <v-col cols="8" class="pa-0" style="height: 100vh">
            <Scrambles class="pa-0" :change-scramble="changeScramble" />
            <Timer
                class="pa-0"
                :remove-time="timeRemoved"
                @time-done="
                    (i) => {
                        addTime(i);
                        changeScramble++;
                    }
                " />
        </v-col>
    </v-row> -->

    <div style="height: 100vh; width: 35%" class="float-left">
        <TimeList
            style="height: 100vh"
            :time="time"
            @time-deleted="
                (i) => {
                    timeRemoved++;
                }
            " />
    </div>
    <div style="height: 100vh; width: 65%" class="float-left">
        <Scrambles
            class="pa-0"
            :change-scramble="changeScramble"
            style="height: 30vh" />
        <Timer
            class="pa-0"
            style="height: 70vh"
            :remove-time="timeRemoved"
            @time-done="
                (i) => {
                    addTime(i);
                    changeScramble++;
                }
            " />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TimeList from "../components/TimeList.vue";
import Timer from "../components/Timer.vue";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    setup() {
        //* vars
        let time = ref<{
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }>();
        let changeScramble = ref<number>(0);
        let timeRemoved = ref<number>(0);

        //* use a prop to send time to TimeList
        function addTime(i: {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }) {
            time.value = i;
        }

        return {
            time,
            changeScramble,
            timeRemoved,
            addTime,
        };
    },
    components: { TimeList, Timer, Scrambles },
});
</script>

<style>
.headingTimeList {
    display: sticky;
}
</style>
