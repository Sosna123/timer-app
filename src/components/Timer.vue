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

        //* change state of timer
        function manageTimer() {
            if (!timerRunning) {
                //* start timer if its not running
                startOfTimer = new Date().getTime();
                intervalTimer = setInterval(() => {
                    currentTime.value = new Date().getTime() - startOfTimer!;
                    currentTimeStr.value = formatNormal(
                        Math.trunc(currentTime.value / 10).toString()
                    );
                }, 10);
                timerRunning = true;
            } else {
                //* stop timer if its running
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

                //* send the time to TimeList
                emit("time-done", time);
            }
        }

        //* check if time is removed to update timeId
        watch(
            () => props.removeTime,
            (removeTime) => {
                if (jscookie.get("timeId")) {
                    timeId = jscookie.get("timeId");
                    jscookie.set({
                        name: "timeId",
                        value: timeId,
                        exdays: 365 * 10,
                    });
                }
            }
        );

        //* load timeId from cookie
        if (jscookie.get("timeId")) {
            timeId = jscookie.get("timeId");
        }

        //* turn on the timer when space is pressed
        document.body.addEventListener("keyup", (e) => {
            if (timerRunning && e.code != "Space") {
                manageTimer();
            }
            if (e.code == "Space") {
                manageTimer();
            }
        });

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
