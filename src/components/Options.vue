<template>
    <div
        class="position-absolute d-flex"
        style="
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2;
        ">
        <div>
            <div class="optionsContainer bg-primary">
                <!-- <div>
                    <v-btn
                        style="width: 400px"
                        color="background"
                        @click="redirectToWca()"
                        ><button>Login using WCA</button></v-btn
                    >
                </div> -->
                <div>
                    <h1>Options:</h1>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-checkbox
                        label="Use as guest"
                        v-model="isGuest"></v-checkbox>
                    <v-text-field
                        hide-details="auto"
                        label="Type in your username"
                        style="width: 400px"
                        v-model="newUsername"
                        :disabled="isGuest"
                        prepend-inner-icon="mdi-account-circle">
                    </v-text-field>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-checkbox
                        label="Show the Time Chart"
                        v-model="timeChartActive"></v-checkbox>
                    <v-select
                        label="Change Theme"
                        :items="selectItems"
                        v-model="newTheme"
                        prepend-inner-icon="mdi-palette"
                        hide-details
                        style="width: 400px"
                        class="mb-1">
                    </v-select>
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <div>
                    <v-btn
                        style="width: 200px; margin-right: 10px"
                        color="background"
                        @click="
                            $emit('hideOptions'); /* hide options */
                            changeTheme();
                            /* toggle timeChart*/
                            changeTimeChartActive();
                            $emit('time-chart-change', timeChartActive);
                            /* change username */
                            newUsername = newUsername.replaceAll(/\s/g, '');
                            newUsername.length > 0 &&
                            !newUsername.startsWith('wca-')
                                ? !(newUsername.length > 28)
                                    ? $emit('username-changed', newUsername)
                                    : newUsername.substring(0, 28)
                                : (newUsername = props.username);
                            /* toggle guest mode*/
                            changeIsGuest();
                        ">
                        <button>Save Changes</button>
                    </v-btn>
                    <v-btn
                        style="width: 200px"
                        color="background"
                        @click="
                            revertChanges();
                            $emit('hideOptions');
                        ">
                        <button>Revert Changes</button>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useTheme } from "vuetify";
export default defineComponent({
    props: ["username"],
    setup(props, { emit }) {
        let newUsername = ref<string>(props.username);

        watch(props.username, (username: string) => {
            newUsername.value = username.toLowerCase();
        });

        const jscookie = require("js-cookie");
        const themeChanger = useTheme();
        const selectItems: string[] = [
            "dark",
            "light",
            "red",
            "pink",
            "purple",
            "deep-purple",
            "indigo",
            "blue",
            "light-blue",
            "cyan",
            "teal",
            "green",
            "light-green",
            "lime",
            "yellow",
            "amber",
            "orange",
            "deep-orange",
            "brown",
            "blue-grey",
        ];
        let theme = ref<string>("dark");
        let newTheme = ref(theme.value);
        let isGuest = ref<boolean>(jscookie.get("isGuest") === "1");

        jscookie.get("timeChartActive") === undefined
            ? jscookie.set("timeChartActive", 1)
            : null;
        let timeChartActive = ref<boolean>(
            jscookie.get("timeChartActive") === "1"
        );

        function changeTheme() {
            theme.value = newTheme.value;
            themeChanger.global.name.value = theme.value;
            jscookie.set("theme", theme.value, {
                expires: 365 * 10,
            });
            emit("changed-theme", theme.value);
        }

        function changeIsGuest() {
            jscookie.set("isGuest", Number(isGuest.value));
            if (jscookie.get("isGuest") !== "1") {
                emit("guest-changed", newUsername.value);
            }
        }
        function changeTimeChartActive() {
            jscookie.set("timeChartActive", Number(timeChartActive.value));
        }

        function redirectToWca() {
            window.location.href =
                "https://www.worldcubeassociation.org/oauth/authorize?client_id=veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0&client_secret=1aGASn8lsLAVHWz8tUlremODceIazL6CPwUTUH9iu-Y&redirect_uri=https%3A%2F%2Fspeedcubing-timer.netlify.app%2F&response_type=code&scope=";
        }

        function revertChanges() {
            newUsername.value = props.username;
            newTheme.value = theme.value;
            isGuest.value = jscookie.get("isGuest") === "1";
            timeChartActive.value = jscookie.get("timeChartActive") === "1";
        }

        return {
            props,
            jscookie,
            isGuest,
            timeChartActive,
            selectItems,
            newTheme,
            newUsername,
            changeTheme,
            changeIsGuest,
            changeTimeChartActive,
            redirectToWca,
            revertChanges,
        };
    },
});
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
    height: 600px;
    position: relative;
    overflow: hidden;
}
</style>
