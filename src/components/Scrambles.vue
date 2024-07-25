<template>
    <div class="scrambles text-center pa-5 bg-secondary">
        <v-select
            label="Scramble Type"
            :items="selectItems"
            item-title="name"
            item-value="value"
            v-model="scrambleType"
            density="compact"
            hide-details>
        </v-select>
        <h2
            @click="changeScramble()"
            class="fs-2 user-select-none cursor-pointer ma-0">
            {{ scramble[0].scramble_string }}
        </h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { watch } from "vue";
export default defineComponent({
    props: ["changeScramble"],
    setup(props) {
        //* vars
        const selectItems = [
            { value: "333", name: "3x3" },
            { value: "222", name: "2x2" },
            { value: "444", name: "4x4" },
            { value: "555", name: "5x5" },
            { value: "666", name: "6x6" },
            { value: "777", name: "7x7" },
            { value: "clock", name: "Clock" },
            { value: "minx", name: "Megaminx" },
            { value: "pyram", name: "Pyraminx" },
            { value: "skewb", name: "Skewb" },
            { value: "sq1", name: "Square-1" },
        ];

        const Scrambow = require("scrambow").Scrambow;
        let scrambleGen = new Scrambow();
        let scramble = ref<{ scramble_string: string }[]>(scrambleGen.get(1));
        type ScrambleType =
            | "333"
            | "222"
            | "444"
            | "555"
            | "666"
            | "777"
            | "clock"
            | "minx"
            | "pyram"
            | "skweb"
            | "sq1";
        let scrambleType = ref<ScrambleType>("333");

        //* watch if scramble type changes
        watch(
            () => scrambleType.value,
            (scramType) => {
                scrambleGen = new Scrambow().setType(scramType);
                changeScramble();
            }
        );

        //* change the scramble
        function changeScramble() {
            scramble.value = scrambleGen.get(1);
        }

        //* watch if you need to change scramble
        watch(
            () => props.changeScramble,
            () => {
                changeScramble();
            }
        );

        return {
            scramble,
            scrambleType,
            selectItems,
            changeScramble,
        };
    },
});
</script>

<style>
.scrambles {
    background-color: #2c2c2c;
}

.scrambles > h3 {
    cursor: pointer;
    color: white;
}
</style>
