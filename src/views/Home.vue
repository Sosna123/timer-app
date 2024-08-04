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

    <div v-if="editingUsername">
        <ChangeUsername
            :username="username"
            @username-changed="
                (i) => {
                    changeUsernameFunc(i);
                }
            " />
    </div>
    <div v-if="editingTheme">
        <ChangeTheme
            @changed-theme="
                (i) => {
                    editingTheme = !editingTheme;
                    currTheme = i;
                }
            " />
    </div>

    <div
        class="left-panel"
        v-show="
            (showTimeList && $vuetify.display.smAndDown) ||
            $vuetify.display.mdAndUp
        ">
        <TimeList
            style="height: 100vh"
            :time="time"
            :username="username"
            :editing-username="editingUsername"
            :editing-theme="editingTheme"
            :update-chart="updateChartNum"
            @time-deleted="
                (i) => {
                    timeRemoved++;
                }
            "
            @changeUsername="
                (i) => {
                    editingUsername = i;
                }
            "
            @changeTheme="
                (i) => {
                    editingTheme = i;
                }
            " />
    </div>
    <div class="right-panel">
        <Scrambles
            @show-timelist="
                showTimeList = !showTimeList;
                updateChartNum++;
            "
            class="pa-0"
            :change-scramble="changeScramble"
            :disable-input="editingUsername"
            :disable-input2="showTimeList"
            :disable-input3="editingTheme"
            style="height: 27vh; width: 100%" />
        <Timer
            @click="showTimeList ? (showTimeList = false) : null"
            class="pa-0"
            style="height: 73vh; width: 100%"
            :remove-time="timeRemoved"
            :curr-theme="currTheme"
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
import ChangeUsername from "@/components/ChangeUsername.vue";
import ChangeTheme from "@/components/ChangeTheme.vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
export default defineComponent({
    components: { TimeList, Timer, Scrambles, ChangeUsername, ChangeTheme },
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
        let editingUsername = ref<boolean>(false);
        let editingTheme = ref<boolean>(false);
        let showTimeList = ref<boolean>(false);
        let updateChartNum = ref<number>(0);
        let currTheme = jscookie.get("theme")
            ? ref<string>(jscookie.get("theme"))
            : ref<string>("dark");

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
            editingUsername.value = false;
            jscookie.set("username", newUsername, { expires: 365 * 10 });
        }

        if (jscookie.get("username")) {
            username.value = jscookie.get("username");
        }

        if (username.value == "") {
            editingUsername.value = true;
        }

        if (route.query.code) {
            let bearerToken = route.query.code;
            jscookie.set("bearer_token", bearerToken, { expires: 365 * 10 });
        }

        async function fetchData() {
            const fetchedData = await fetch(
                "https://www.worldcubeassociation.org/api/v0/me",
                {
                    headers: {
                        Authorization: "Bearer " + jscookie.get("bearer_token"),
                    },
                }
            );
            const data = await fetchedData.json();
            return data;
        }

        if (jscookie.get("bearer_token")) {
            fetchData().then((data) => {
                try {
                    // username.value = "wca-" + data.me.id;
                    // jscookie.set("username", username.value, {
                    //     expires: 365 * 10,
                    // });
                    console.log(data);
                } catch (e) {
                    console.log(e);
                }
            });
        }

        if (jscookie.get("theme")) {
            let theme = useTheme();
            theme.global.name.value = jscookie.get("theme");
        }

        return {
            time,
            changeScramble,
            timeRemoved,
            username,
            editingUsername,
            editingTheme,
            showTimeList,
            updateChartNum,
            currTheme,
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
}
</style>
