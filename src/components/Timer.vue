<template>
    <div
        class="timerDiv pa-5 bg-tertiary d-flex"
        style="justify-content: center; align-items: center">
        <div
            style=""
            class="d-flex timerContainer"
            @touchend="screenWidth <= 600 ? manageTimer() : null">
            <div v-if="timerMode == 'normal'" id="timerOverflowDiv">
                <p
                    :class="{
                        'text-amber': spaceDown,
                        'text-black': $props.currTheme === 'light',
                        'text-amber-lighten-1':
                            spaceDown && $props.currTheme === 'amber',
                    }"
                    id="timerText"
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
                <v-btn
                    style="width: 100%"
                    @click="submitInputTime()"
                    color="background"
                    ><button>Submit</button></v-btn
                >
            </div>
        </div>
        <v-btn
            style="position: absolute; bottom: 0; right: 0"
            @click="
                timerMode == 'input'
                    ? (timerMode = 'normal')
                    : (timerMode = 'input');
                ($event.target as HTMLButtonElement).blur();
            "
            id="changeMode"
            color="background"
            ><button>Change button mode</button></v-btn
        >
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import Scrambles from "@/components/Scrambles.vue";
export default defineComponent({
    components: { Scrambles },
    props: [
        "removeTime",
        "currTheme",
        "editingOptions",
        "showTimeList",
        "timeList",
        "currentScramble",
    ],
    setup(props, { emit }) {
        //* vars
        let changeModeBtn: null | HTMLButtonElement = null;

        window.document.addEventListener("load", () => {
            changeModeBtn = document.getElementById(
                "changeMode"
            ) as HTMLButtonElement;
        });

        const jscookie = require("js-cookie");
        let currentTimeStr = ref<string>("0.00");
        let currentTime = ref<number>(0);
        let startOfTimer: number | null = null;
        let timerRunning: boolean = false;
        let intervalTimer: undefined | number;
        let spaceDown = ref<boolean>(false);
        let lightTheme = ref<boolean>(false);
        let timerMode = ref<"normal" | "input">("normal");
        let timeInInput = ref<string>("");
        let screenWidth = ref<number>(window.screen.width);
        let fontSize = 128;

        //* change state of timer
        function manageTimer() {
            resetFontSize();
            changeOverflowFontSize();
            if (
                !(
                    !props.editingOptions &&
                    timerMode.value == "normal" &&
                    !props.showTimeList
                )
            )
                return;

            if (!timerRunning) {
                //* start timer if its not running
                startOfTimer = new Date().getTime();
                intervalTimer = setInterval(() => {
                    currentTime.value = new Date().getTime() - startOfTimer!;
                    currentTimeStr.value = formatNormal(
                        Math.trunc(currentTime.value / 10).toString()
                    );
                    changeOverflowFontSize();
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
                const time = {
                    id: 0,
                    str: currentTimeStr.value,
                    num: currentTime.value,
                    added2: false,
                    addedDnf: false,
                    scramble: props.currentScramble,
                    date: Number(new Date()),
                };

                if (time.num === 0) return;

                //* send the time to TimeList
                emit("time-done", time);
            }
            emit("timer-running", timerRunning);
        }

        //* turn on the timer when space is pressed
        document.body.addEventListener("keyup", (e) => {
            spaceDown.value = false;
            if (e.key == "m" && e.ctrlKey) {
                timerMode.value =
                    timerMode.value == "normal" ? "input" : "normal";
                return;
            }
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
                if (e.key == "Enter") {
                    submitInputTime();
                }
            }
        });

        function submitInputTime() {
            let value: string = timeInInput.value.replace(/\D/g, "");
            value = value.length <= 6 ? value : value.slice(0, 6);
            if (value.length && value.match(/[1-9]+/)) {
                const time = {
                    id: Number(props.timeList.length),
                    str: formatNormal(value, "addDots"),
                    num: Number(formatNormal(value, "calcNumBasedStr")),
                    added2: false,
                    addedDnf: false,
                    scramble: props.currentScramble,
                    date: Number(new Date()),
                };
                emit("time-done", time);
            }
            timeInInput.value = "";
        }

        function checkOverflow(element: HTMLElement) {
            var curOverflow = element.style.overflow;

            if (!curOverflow || curOverflow === "visible")
                element.style.overflow = "hidden";

            var isOverflowing =
                element.clientWidth < element.scrollWidth ||
                element.clientHeight < element.scrollHeight;

            element.style.overflow = curOverflow;

            return isOverflowing;
        }

        function resetFontSize() {
            fontSize = 128;
            document.getElementById(
                "timerText"
            )!.style.fontSize = `${fontSize}px`;
        }

        function changeOverflowFontSize() {
            if (timerMode.value == "normal") {
                const timerText = document.getElementById("timerText")!;
                const timerOverflowDiv =
                    document.getElementById("timerOverflowDiv")!;

                let overflow = checkOverflow(timerOverflowDiv);

                if (overflow) {
                    fontSize--;
                    timerText.style.fontSize = `${fontSize}px`;
                    changeOverflowFontSize();
                }
            }
        }

        document.body.addEventListener("keydown", (e) => {
            if (e.code == "Space" && !timerRunning) {
                spaceDown.value = true;
            }
        });

        return {
            changeModeBtn,
            currentTimeStr,
            lightTheme,
            spaceDown,
            timerMode,
            timeInInput,
            screenWidth,
            manageTimer,
            submitInputTime,
        };
    },
});
</script>

<style>
.timeInput {
    width: 100%;
    color: #000;
}

.timerContainer {
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
}
</style>
