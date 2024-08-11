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
            <v-select
                label="Change Theme"
                :items="selectItems"
                v-model="newTheme"
                prepend-inner-icon="mdi-palette"
                hide-details
                class="mb-1">
            </v-select>
            <v-btn style="width: 400px" color="primary" @click="changeTheme()"
                >Submit</v-btn
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useTheme } from "vuetify";
export default defineComponent({
    setup(props, { emit }) {
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
        let newTheme = theme;

        function changeTheme() {
            theme.value = newTheme.value;
            themeChanger.global.name.value = theme.value;
            jscookie.set("theme", theme.value, {
                expires: 365 * 10,
            });
            emit("changed-theme", theme.value);
        }

        return {
            selectItems,
            newTheme,
            changeTheme,
        };
    },
});
</script>

<style></style>
