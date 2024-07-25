<template>
    <div class="timerDiv text-center d-block pa-5 bg-tertiary">
        <p
            @click="manageTimer()"
            class="timerText user-select-none cursor-pointer"
            :class="{ 'text-amber': spaceDown }">
            {{ currentTimeStr }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    setup(props, { emit }) {
        //* vars
        const jscookie = require("js-cookie");
        let currentTimeStr = ref<string>("0.00");
        let currentTime = ref<number>(0);
        let startOfTimer: number | null = null;
        let timerRunning: boolean = false;
        let intervalTimer: undefined | number;
        let timeId: number = 0;
        let spaceDown = ref<boolean>(false);

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
                if (!jscookie.get("timeId")) {
                    timeId = 0;
                }
                const time = {
                    id: Number(timeId),
                    str: currentTimeStr.value,
                    num: currentTime.value,
                    added2: false,
                    addedDnf: false,
                };
                timeId++;

                jscookie.set("timeId", timeId, { expires: 365 * 10 });

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
                    jscookie.set("timeId", timeId, { expires: 365 * 10 });
                } else {
                    timeId = 0;
                    jscookie.set("timeId", timeId, { expires: 365 * 10 });
                }
            }
        );

        //* load timeId from cookie
        if (jscookie.get("timeId")) {
            timeId = jscookie.get("timeId");
        }

        //* turn on the timer when space is pressed
        document.body.addEventListener("keyup", (e) => {
            spaceDown.value = false;
            if (timerRunning && e.code != "Space" && e.code != "Escape") {
                manageTimer();
            }
            if (e.code == "Space") {
                manageTimer();
            }
            if (e.code == "Escape" && timerRunning) {
                clearInterval(intervalTimer);
                timerRunning = false;
                currentTime.value = 0;
                currentTimeStr.value = "0.00";
            }
        });

        document.body.addEventListener("keydown", (e) => {
            if (e.code == "Space" && !timerRunning) {
                spaceDown.value = true;
            }
        });

        return {
            currentTimeStr,
            spaceDown,
            manageTimer,
        };
    },
    components: { Scrambles },
    props: { removeTime: Number },
});
</script>

<style>
.timerDiv {
    background-color: #434343;
}

.timerText {
    font-size: 128px;
}

.spaceDown {
    color: #ffff00;
}
</style>
