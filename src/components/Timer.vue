<template>
    <div
        class="timerDiv pa-5 bg-tertiary d-flex"
        style="justify-content: center; align-items: center">
        <div v-if="timerMode == 'normal'">
            <p
                @click="manageTimer()"
                class="cursor-pointer"
                :class="{
                    'text-amber': spaceDown,
                    'text-black': $props.currTheme === 'light',
                }"
                style="user-select: none; font-size: 128px">
                {{ currentTimeStr }}
            </p>
        </div>
        <div v-else-if="timerMode == 'input'" style="width: 60%">
            <v-text-field
                class="timeInput"
                hide-details="auto"
                label="Input your time"
                v-model="timeInInput"></v-text-field>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    components: { Scrambles },
    props: ["removeTime", "currTheme"],
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
        let lightTheme = ref<boolean>(false);
        let timerMode = ref<"normal" | "input">("input");
        let timeInInput = ref<string>("");

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
            } else if (timerRunning) {
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
            if (timerMode.value == "normal") {
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
            } else if (timerMode.value == "input") {
                if (e.code == "Enter") {
                    let value: string = timeInInput.value.replace(/\D/g, "");
                    if (value.length) {
                        const time = {
                            id: Number(timeId),
                            str: formatNormal(value, "addDots"),
                            num: Number(value),
                            added2: false,
                            addedDnf: false,
                        };
                        timeId++;
                        jscookie.set("timeId", timeId, { expires: 365 * 10 });
                        emit("time-done", time);
                    }
                    timeInInput.value = "";
                }
            }
        });

        document.body.addEventListener("keydown", (e) => {
            if (e.code == "Space" && !timerRunning) {
                spaceDown.value = true;
            }
        });

        return {
            currentTimeStr,
            lightTheme,
            spaceDown,
            timerMode,
            timeInInput,
            manageTimer,
        };
    },
});
</script>

<style>
.timeInput {
    width: 100%;
    color: #000;
}
</style>
