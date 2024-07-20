<template>
    <TimeList :time="time" />
    <Scrambles :change-scramble="changeScramble" />
    <Timer
        @time-done="
            (i) => {
                addTime(i);
                changeScramble++;
            }
        " />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TimeList from "../components/TimeList.vue";
import Timer from "../components/Timer.vue";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    setup() {
        let time = ref<{
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }>();
        let changeScramble: number = 0;

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
            addTime,
        };
    },
    components: { TimeList, Timer, Scrambles },
});
</script>

<style>
.timeList {
    height: 100vh;
    width: 30%;
}

.headingTimeList {
    display: sticky;
}
</style>
