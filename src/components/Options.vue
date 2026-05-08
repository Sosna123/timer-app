<template>
    <div class="position-absolute d-flex" style="justify-content: center; align-items: center; height: 100vh; width: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 2">
        <div>
            <div class="optionsContainer bg-primary">
                <div>
                    <h1>Options:</h1>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-checkbox label="Use as guest" v-model="isGuest"></v-checkbox>
                    <v-text-field hide-details="auto" label="Type in your username" style="width: 400px" v-model="newUsername" :disabled="isGuest" prepend-inner-icon="mdi-account-circle"> </v-text-field>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-checkbox label="Show the Time Chart" v-model="timeChartActive"></v-checkbox>
                    <v-select label="Change Theme" :items="selectThemeItems" v-model="newTheme" prepend-inner-icon="mdi-palette" hide-details style="width: 400px" class="mb-1"> </v-select>
                    <v-select label="Show stats for:" :items="selectStatsItems" v-model="statsMode" hide-details style="width: 400px" class="mb-1"> </v-select>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-btn
                        style="width: 200px; margin-right: 10px"
                        color="background"
                        @click="
                            emit('hideOptions'); /* hide options */
                            changeTheme();
                            /* toggle timeChart*/
                            changeTimeChartActive();
                            emit('time-chart-change', timeChartActive);
                            /* change username */
                            newUsername = newUsername.replaceAll(/\s/g, '');
                            newUsername.length > 0 && !newUsername.startsWith('wca-') ? (!(newUsername.length > 28) ? emit('username-changed', newUsername) : newUsername.substring(0, 28)) : (newUsername = props.username);
                            /* toggle guest mode*/
                            changeIsGuest();
                            /* toggle stats mode*/
                            changeStatsMode();
                        ">
                        <button>Save Changes</button>
                    </v-btn>
                    <v-btn
                        style="width: 200px"
                        color="background"
                        @click="
                            revertChanges();
                            emit('hideOptions');
                        ">
                        <button>Revert Changes</button>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

const props = defineProps(["username"]);
const emit = defineEmits<{
    "changed-theme": [string];
    "guest-changed": [string];
    "username-changed": [string];
    "time-chart-change": [boolean];
    hideOptions: [];
    statsModeChanged: [];
}>();
let newUsername = ref<string>(props.username);

watch(
    () => props.username,
    (username: string) => {
        newUsername.value = username.toLowerCase();
    },
);

const jscookie = require("js-cookie");
const themeChanger = useTheme();
const selectThemeItems: string[] = ["dark", "light", "red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "brown", "blue-grey"];
const selectStatsItems: { title: string; value: number }[] = [
    {
        title: "All times",
        value: -1,
    },
    {
        title: "Today",
        value: 1,
    },
];
let theme = ref<string>(jscookie.get("theme") ?? "dark");
let newTheme = ref(theme.value);
let isGuest = ref<boolean>(jscookie.get("isGuest") === "1");
let statsMode = ref<number>(Number(jscookie.get("statsMode")) ?? -1);

if (isNaN(statsMode.value)) {
    statsMode.value = -1;
}

jscookie.get("timeChartActive") === undefined
    ? jscookie.set("timeChartActive", 1, {
          expires: 365 * 10,
      })
    : null;
let timeChartActive = ref<boolean>(jscookie.get("timeChartActive") === "1");

function changeTheme() {
    theme.value = newTheme.value;
    themeChanger.global.name.value = theme.value;
    jscookie.set("theme", theme.value, {
        expires: 365 * 10,
    });
    emit("changed-theme", theme.value);
}

function changeIsGuest() {
    jscookie.set("isGuest", Number(isGuest.value), {
        expires: 365 * 10,
    });
    if (jscookie.get("isGuest") !== "1") {
        emit("guest-changed", newUsername.value);
    }
}

function changeStatsMode() {
    jscookie.set("statsMode", Number(statsMode.value), {
        expires: 365 * 10,
    });
    emit("statsModeChanged");
}

function changeTimeChartActive() {
    jscookie.set("timeChartActive", Number(timeChartActive.value), {
        expires: 365 * 10,
    });
}

function revertChanges() {
    newUsername.value = props.username;
    newTheme.value = theme.value;
    isGuest.value = jscookie.get("isGuest") === "1";
    timeChartActive.value = jscookie.get("timeChartActive") === "1";
    statsMode.value = Number(jscookie.get("statsMode")) ?? -1;
}
</script>

<style>
.optionsContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    height: 700px;
    position: relative;
    overflow: hidden;
}
</style>
