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

    <div style="height: 100vh; width: 35%" class="float-left">
        <TimeList
            style="height: 100vh"
            :time="time"
            :username="username"
            :editing-username="editingUsername"
            @time-deleted="
                (i) => {
                    timeRemoved++;
                }
            "
            @changeUsername="
                (i) => {
                    editingUsername = i;
                }
            " />
    </div>
    <div style="height: 100vh; width: 65%" class="float-left">
        <Scrambles
            class="pa-0"
            :change-scramble="changeScramble"
            :disable-input="editingUsername"
            style="height: 27vh" />
        <Timer
            class="pa-0"
            style="height: 73vh"
            :remove-time="timeRemoved"
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
export default defineComponent({
    components: { TimeList, Timer, Scrambles, ChangeUsername },
    setup() {
        //* vars
        let time = ref<{
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }>();
        let changeScramble = ref<number>(0);
        let timeRemoved = ref<number>(0);
        let username = ref<string>("user1");
        let editingUsername = ref<boolean>(false);
        const jscookie = require("js-cookie");

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
            username.value = newUsername;
            editingUsername.value = false;
            jscookie.set("username", newUsername, { expires: 365 * 10 });
        }

        if (jscookie.get("username")) {
            username.value = jscookie.get("username");
        }

        return {
            time,
            changeScramble,
            timeRemoved,
            username,
            editingUsername,
            addTime,
            changeUsernameFunc,
        };
    },
});
</script>

<style>
.headingTimeList {
    display: sticky;
}
</style>
