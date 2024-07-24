<template>
    <div class="scrambles p-1 text-center float-start">
        <select
            name="scramble-type"
            id="scramble-type"
            class="d-block text-center user-select-none"
            v-model="scrambleType">
            <option value="333">3x3</option>
            <option value="222">2x2</option>
            <option value="444">4x4</option>
            <option value="555">5x5</option>
            <option value="666">6x6</option>
            <option value="777">7x7</option>
            <option value="clock">Clock</option>
            <option value="minx">Megaminx</option>
            <option value="pyram">Pyraminx</option>
            <option value="skewb">Skewb</option>
            <option value="sq1">Square-1</option>
        </select>
        <h3 @click="changeScramble()" class="m-1 ms-2 fs-2">
            {{ scramble[0].scramble_string }}
        </h3>
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
            changeScramble,
        };
    },
});
</script>

<style>
.scrambles {
    height: 15vh;
    width: 70%;
    background-color: #2c2c2c;
}

.scrambles > h3 {
    cursor: pointer;
    color: white;
}
</style>
