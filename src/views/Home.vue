<template>
    <div v-show="editingOptions">
        <Options
            :username="username"
            @hide-options="editingOptions = false"
            @username-changed="
                (i) => {
                    changeUsernameFunc(i, false);
                }
            "
            @guest-changed="
                (i) => {
                    changeUsernameFunc(i, true);
                }
            "
            @changed-theme="
                (i) => {
                    currTheme = i;
                }
            "
            @time-chart-change="
                (i) => {
                    timeChartActive = i;
                    updateChartNum++;
                }
            "
            @statsModeChanged="updateStats++" />
    </div>

    <div v-show="editingTime && timeModified != null">
        <ModifyTime
            :time="timeModified"
            @exit-time-modifying="editingTime = false"
            @modifyTime="
                (i) => {
                    makeChangeToTime = i;
                }
            " />
    </div>

    <div class="left-panel" v-show="(showTimeList && $vuetify.display.mdAndDown) || $vuetify.display.lgAndUp">
        <TimeList
            style="height: 100vh"
            :time="time"
            :username="username"
            :guest-mode-changed="guestModeChanged"
            :editing-options="editingOptions"
            :update-chart="updateChartNum"
            :show-chart="timeChartActive"
            :makeChangeToTime="makeChangeToTime"
            :updateStats="updateStats"
            @time-deleted="timeRemoved++"
            @change-options="
                (i) => {
                    editingOptions = i;
                }
            "
            @timeListChanged="
                (i) => {
                    timeListChanged = i;
                }
            "
            @modify-time="
                (i) => {
                    timeModified = i;
                    editingTime = true;
                }
            "
            @clearModifyArray="makeChangeToTime = null" />
    </div>
    <div class="right-panel">
        <Scrambles
            class="pa-0"
            style="height: 27vh; width: 100%"
            :change-scramble="changeScramble"
            :disable-input="editingOptions"
            :disable-input2="showTimeList"
            :timer-running="timerRunning"
            @show-timelist="
                showTimeList = true;
                updateChartNum++;
            "
            @new-scramble="
                (i) => {
                    currentScramble = i;
                }
            " />
        <Timer
            class="pa-0"
            style="height: 73vh; width: 100%"
            :remove-time="timeRemoved"
            :curr-theme="currTheme"
            :editing-options="editingOptions"
            :showTimeList="showTimeList"
            :time-list="timeListChanged"
            :current-scramble="currentScramble"
            @click="showTimeList ? (showTimeList = false) : null"
            @time-done="
                (i) => {
                    addTime(i);
                    changeScramble++;
                }
            "
            @timer-running="
                (i) => {
                    timerRunning = i;
                }
            " />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TimeList from "../components/TimeList.vue";
import Timer from "../components/Timer.vue";
import Scrambles from "@/components/Scrambles.vue";
import Options from "@/components/Options.vue";
import ModifyTime from "@/components/ModifyTime.vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";

//* vars
const jscookie = require("js-cookie");
const route = useRoute();
let time = ref<{
    id: number;
    str: string;
    num: number;
    added2: boolean;
    addedDnf: boolean;
}>();
let changeScramble = ref<number>(0);
let timeRemoved = ref<number>(0);
let username = ref<string>("");
let editingOptions = ref<boolean>(false);
let showTimeList = ref<boolean>(false);
let updateChartNum = ref<number>(0);
let currTheme = jscookie.get("theme") ? ref<string>(jscookie.get("theme")) : ref<string>("dark");
let timeChartActive = ref<boolean>(jscookie.get("timeChartActive") === "1");
let timeListChanged = ref<any>([]);
let guestModeChanged = ref<number>(0);
let updateStats = ref<number>(0);
let currentScramble = ref<string>("");
let timerRunning = ref<boolean>(false);
type Time = {
    id: number;
    str: string;
    num: number;
    added2: boolean;
    addedDnf: boolean;
    scramble: string;
    date: number;
};
let editingTime = ref<boolean>(false);
let timeModified = ref<Time | null>(null);
let makeChangeToTime = ref<[string, Time] | null>(null);

//* use a prop to send time to TimeList
function addTime(i: { id: number; str: string; num: number; added2: boolean; addedDnf: boolean }) {
    time.value = i;
}

function changeUsernameFunc(newUsername: string, hasGuestChanged: boolean = false) {
    username.value = newUsername.toLowerCase();
    jscookie.set("username", newUsername, { expires: 365 * 10 });
    // if (hasGuestChanged) {
    //     guestModeChanged.value++;
    // }
}

if (jscookie.get("username")) {
    username.value = jscookie.get("username");
}

if (username.value == "") {
    editingOptions.value = true;
}

//* change theme
if (jscookie.get("theme")) {
    let theme = useTheme();
    theme.global.name.value = jscookie.get("theme");
}
</script>

<style lang="scss">
@use "@/styles/main.scss" as *;

.left-panel {
    height: 100vh;
    width: 35%;
    float: left;
    transition: 0.5s;
    @include breakpoint(xs) {
        width: 95%;
        position: absolute;
        z-index: 1;
    }
    @include breakpoint(sm) {
        width: 95%;
        position: absolute;
        z-index: 1;
    }
    @include breakpoint(md) {
        width: 95%;
        position: absolute;
        z-index: 1;
    }
}

.right-panel {
    width: 65%;
    height: 100vh;
    float: left;
    @include breakpoint(xs) {
        width: 100%;
    }
    @include breakpoint(sm) {
        width: 100%;
    }
    @include breakpoint(md) {
        width: 100%;
    }
}
</style>
