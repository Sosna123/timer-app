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

    <div v-show="editingUsername">
        <ChangeUsername
            :username="username"
            @log-wca="redirect()"
            @username-changed="
                (i) => {
                    changeUsernameFunc(i);
                }
            " />
    </div>
    <div v-show="editingTheme">
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
            (showTimeList && $vuetify.display.mdAndDown) ||
            $vuetify.display.lgAndUp
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
                showTimeList = true;
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
            :editing-username="editingUsername"
            :editing-theme="editingTheme"
            :showTimeList="showTimeList"
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
import {
    generateCodeVerifier,
    OAuth2Client,
    OAuth2Fetch,
} from "@badgateway/oauth2-client";
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
        const docLocation = document.location;
        let codeVerifier: any;

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

        // wca authorization
        async function fetchToken() {
            try {
                const fetchedData = await fetch(
                    `https://www.worldcubeassociation.org/oauth/token?grant_type=authorization_code&client_id=veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0&client_secret=${
                        process.env.VUE_APP_WCA_SECRET
                    }&code=${jscookie.get(
                        "authorCode"
                    )}&redirect_uri=https://speedcubing-timer.netlify.app`,
                    {
                        method: "POST",
                    }
                );
                const data = await fetchedData.json();
                return data;
            } catch (e) {
                console.log("fetchToken: " + e);
            }
        }

        async function refreshToken() {
            try {
                const fetchedData = await fetch(
                    `https://www.worldcubeassociation.org/oauth/token?grant_type=refresh_token&client_id=veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0&client_secret=${
                        process.env.VUE_APP_WCA_SECRET
                    }&refresh_token=${jscookie.get(
                        "refreshToken"
                    )}&redirect_uri=https://speedcubing-timer.netlify.app`,
                    {
                        method: "POST",
                    }
                );
                const data = await fetchedData.json();
                return data;
            } catch (e) {
                console.log("refreshToken: " + e);
            }
        }

        async function fetchData() {
            try {
                const fetchedData = await fetch(
                    "https://www.worldcubeassociation.org/api/v0/me",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + jscookie.get("bearerToken"),
                        },
                    }
                );
                const data = await fetchedData.json();
                return data;
            } catch (e) {
                console.log("fetchData: " + e);
            }
        }

        if (route.query.code) {
            console.log("authorization code found");
            let authorCode = route.query.code;
            jscookie.set("authorCode", authorCode, { expires: 365 * 10 });

            console.log("fetching token");
            fetchToken().then((data) => {
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
            fetchData().then((data) => {
                console.log("data fetched");
                console.log(data);
                username.value = "wca-" + data.me.id;
                jscookie.set("username", username.value, {
                    expires: 365 * 10,
                });
            });
        }

        if (jscookie.get("refreshToken")) {
            refreshToken().then((e) => {
                jscookie.set("bearerToken", e.access_token, {
                    expires: e.access_token / 60 / 60 / 24,
                });
                jscookie.set("refreshToken", e.access_token, {
                    expires: e.access_token / 60 / 60 / 24,
                });
            });
        }

        // change theme
        if (jscookie.get("theme")) {
            let theme = useTheme();
            theme.global.name.value = jscookie.get("theme");
        }

        const client = new OAuth2Client({
            server: "https://worldcubeassociation.org/oauth",
            clientId: "veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0",
            clientSecret: process.env.VUE_APP_WCA_SECRET,
        });

        async function redirect() {
            codeVerifier = await generateCodeVerifier();

            document.location = await client.authorizationCode.getAuthorizeUri({
                redirectUri: "https://speedcubing-timer.netlify.app",

                codeVerifier,

                scope: ["public"],
            });
        }

        async function redirectBack() {
            const oauth2Token =
                await client.authorizationCode.getTokenFromCodeRedirect(
                    docLocation.toString(),
                    {
                        redirectUri: "https://speedcubing-timer.netlify.app",

                        codeVerifier,
                    }
                );

            const fetchWrapper = new OAuth2Fetch({
                client: client,

                getNewToken: async () => {
                    return client.clientCredentials();
                },
            });

            const response = fetchWrapper.fetch(
                "https://www.worldcubeassociation.org/api/v0/me"
            );
            (await response).json().then((data) => {
                try {
                    username.value = "wca-" + data.me.id;
                    jscookie.set("username", username.value, {
                        expires: 365 * 10,
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        }

        if (route.query.code) {
            redirectBack();
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
            redirect,
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
