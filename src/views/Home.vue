<template>
    <div v-show="editingOptions">
        <Options
            @hide-options="editingOptions = false"
            :username="username"
            @username-changed="
                (i) => {
                    changeUsernameFunc(i);
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
            " />
    </div>

    <div
        class="left-panel"
        v-show="
            (showTimeList && $vuetify.display.mdAndDown) ||
            $vuetify.display.lgAndUp
        ">
        <TimeList
            style="height: 100vh"
            :time="time"
            :username="username"
            :editing-options="editingOptions"
            :update-chart="updateChartNum"
            :show-chart="timeChartActive"
            @time-deleted="
                (i) => {
                    timeRemoved++;
                }
            "
            @change-options="
                (i) => {
                    editingOptions = i;
                }
            "
            @timeListChanged="
                (i) => {
                    timeListChanged = i;
                }
            " />
    </div>
    <div class="right-panel">
        <Scrambles
            @show-timelist="
                showTimeList = true;
                updateChartNum++;
            "
            class="pa-0"
            :change-scramble="changeScramble"
            :disable-input="editingOptions"
            :disable-input2="showTimeList"
            style="height: 27vh; width: 100%" />
        <Timer
            @click="showTimeList ? (showTimeList = false) : null"
            class="pa-0"
            style="height: 73vh; width: 100%"
            :remove-time="timeRemoved"
            :curr-theme="currTheme"
            :editing-options="editingOptions"
            :showTimeList="showTimeList"
            :time-list="timeListChanged"
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
import Options from "@/components/Options.vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
export default defineComponent({
    components: {
        TimeList,
        Timer,
        Scrambles,
        Options,
    },
    setup() {
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
        let currTheme = jscookie.get("theme")
            ? ref<string>(jscookie.get("theme"))
            : ref<string>("dark");
        let timeChartActive = ref<boolean>(
            jscookie.get("timeChartActive") === "1"
        );
        let timeListChanged = ref<any>([]);

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

        function changeUsernameFunc(newUsername: string) {
            username.value = newUsername.toLowerCase();
            jscookie.set("username", newUsername, { expires: 365 * 10 });
        }

        if (jscookie.get("username")) {
            username.value = jscookie.get("username");
        }

        if (username.value == "") {
            editingOptions.value = true;
        }

        //* wca authorization

        if (route.query.code) {
            console.log("authorization code found");
            let authorCode = route.query.code;
            jscookie.set("authorCode", authorCode, { expires: 365 * 10 });

            console.log("fetching token");
            fetch("https://frog01-31260.wykr.es/wca/token", {
                method: "POST",
                body: JSON.stringify({ authorizationCode: authorCode }),
            }).then((data: any) => {
                console.log("token fetched");
                jscookie.set("bearerToken", data.access_token, {
                    expires: data.access_token / 60 / 60 / 24,
                });
                jscookie.set("refreshToken", data.access_token, {
                    expires: data.access_token / 60 / 60 / 24,
                });
                jscookie.remove("authorCode");
            });
        }

        if (jscookie.get("bearerToken")) {
            console.log("fetching data");
            fetch("https://frog01-31260.wykr.es/wca/data", {
                method: "POST",
                body: JSON.stringify({
                    bearerToken: jscookie.get("bearerToken"),
                }),
            }).then((data: any) => {
                console.log("data fetched");
                console.log(data);
                username.value = "wca-" + data.me.id;
                jscookie.set("username", username.value, {
                    expires: 365 * 10,
                });
            });
        }

        if (jscookie.get("refreshToken")) {
            fetch("https://frog01-31260.wykr.es/", {
                method: "POST",
                body: JSON.stringify({
                    refreshToken: jscookie.get("refreshToken"),
                }),
            }).then((data: any) => {
                jscookie.set("bearerToken", data.access_token, {
                    expires: data.access_token / 60 / 60 / 24,
                });
                jscookie.set("refreshToken", data.access_token, {
                    expires: data.access_token / 60 / 60 / 24,
                });
            });
        }

        //* change theme
        if (jscookie.get("theme")) {
            let theme = useTheme();
            theme.global.name.value = jscookie.get("theme");
        }

        return {
            time,
            changeScramble,
            timeRemoved,
            username,
            editingOptions,
            showTimeList,
            updateChartNum,
            currTheme,
            timeChartActive,
            timeListChanged,
            addTime,
            changeUsernameFunc,
        };
    },
});
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
