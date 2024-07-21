<template>
    <div
        class="timerDiv text-center d-flex align-items-center justify-content-center">
        <p @click="manageTimer()" class="timerText">{{ currentTimeStr }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    setup(props, { emit }) {
        //* vars
        let jscookie = require("jscookie");
        let currentTimeStr = ref<string>("0.00");
        let currentTime = ref<number>(0);
        let startOfTimer: number | null = null;
        let timerRunning: boolean = false;
        let intervalTimer: undefined | number;
        let timeId: number = 0;

        //* functions
        function manageTimer() {
            if (!timerRunning) {
                startOfTimer = new Date().getTime();
                intervalTimer = setInterval(() => {
                    currentTime.value = new Date().getTime() - startOfTimer!;
                    currentTimeStr.value = formatNormal(
                        Math.trunc(currentTime.value / 10).toString()
                    );
                }, 10);
                timerRunning = true;
            } else {
                clearInterval(intervalTimer);
                currentTime.value = Math.trunc(
                    (new Date().getTime() - startOfTimer!) / 10
                );
                currentTimeStr.value = formatNormal(
                    currentTime.value.toString()
                );
                timerRunning = false;
                const time = {
                    id: timeId,
                    str: currentTimeStr.value,
                    num: currentTime.value,
                    added2: false,
                    addedDnf: false,
                };
                timeId++;

                jscookie.set({
                    name: "timeId",
                    value: timeId,
                    exdays: 365 * 10,
                });

                emit("time-done", time);
            }
        }

        watch(
            () => props.removeTime,
            (removeTime) => {
                console.log("change found in removeTime");
                if (jscookie.get("timeId")) {
                    console.log("time removed and restoring timeid");
                    timeId = jscookie.get("timeId");
                }
            }
        );

        if (jscookie.get("timeId")) {
            timeId = jscookie.get("timeId");
        }

        document.body.addEventListener("keyup", (e) => {
            if (timerRunning && e.code != "Space") {
                manageTimer();
            }
            if (e.code == "Space") {
                manageTimer();
            }
        });

        //* return
        return {
            currentTimeStr,
            manageTimer,
        };
    },
    components: { Scrambles },
    props: { removeTime: Number },
});
</script>

<style>
.timerDiv {
    height: 85vh;
    width: 70%;
}

.timerText {
    cursor: pointer;
    font-size: 128px;
}
</style>
