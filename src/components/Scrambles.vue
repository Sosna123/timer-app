<template>
    <div class="text-center pa-5 bg-secondary">
        <div class="timeListBtn" id="timeListBtn">
            <v-btn
                class="timeListBtn"
                @click="showTimeList()"
                v-if="disableInput2 === false"
                color="background">
                <button>Show stats and times</button>
            </v-btn>
        </div>
        <v-select
            label="Scramble Type"
            :items="selectItems"
            item-title="name"
            item-value="value"
            v-model="scrambleType"
            density="compact"
            hide-details
            class="mb-1"
            :disabled="
                $props.disableInput ||
                $props.disableInput2 ||
                $props.disableInput3
            ">
        </v-select>
        <h2
            @click="changeScramble()"
            class="cursor-pointer ma-0 text-color-white scramble-text"
            style="user-select: none"
            :class="{
                smallFont555: smallFont === 1,
                smallFont666: smallFont === 2,
                smallerFont: smallFont === 3,
            }">
            {{ scramble[0].scramble_string }}
        </h2>
    </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { ref } from "vue";
import { watch } from "vue";
export default defineComponent({
    props: ["changeScramble", "disableInput", "disableInput2", "disableInput3"],
    setup(props, { emit }) {
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
        let smallFont = ref<0 | 1 | 2 | 3>(0);
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
        let disableInput = ref<boolean>(false);
        let disableInput2 = ref<boolean>(false);

        //* watch if scramble type changes
        watch(
            () => scrambleType.value,
            (scramType) => {
                scrambleGen = new Scrambow().setType(scramType);
                changeScramble();
                if (scramType === "555") {
                    smallFont.value = 1;
                } else if (scramType === "666" || scramType === "minx") {
                    smallFont.value = 2;
                } else if (scramType === "777") {
                    smallFont.value = 3;
                } else {
                    smallFont.value = 0;
                }
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

        function showTimeList() {
            const button = document.getElementById("timeListBtn");
            button!.blur();
            emit("show-timelist");
            disableInput2.value = false;
        }

        return {
            scramble,
            scrambleType,
            selectItems,
            smallFont,
            disableInput2,
            changeScramble,
            showTimeList,
        };
    },
});
</script>

<style lang="scss">
@use "../styles/main.scss" as *;

.timeListBtn {
    display: none;
    @include breakpoint(xs) {
        display: inline-block;
        width: 100%;
        margin: 0 0 10px 0;
    }
    @include breakpoint(sm) {
        display: inline-block;
        width: 100%;
        margin: 0 0 10px 0;
    }
}

.scramble-text {
    font-size: 20px;
    @include breakpoint(lg) {
        font-size: 32px;
    }
    @include breakpoint(xl) {
        font-size: 48px;
    }
}

.smallFont555 {
    font-size: 16px;
    @include breakpoint(lg) {
        font-size: 20px;
    }
    @include breakpoint(xl) {
        font-size: 36px;
    }
}

.smallFont666 {
    font-size: 12px;
    @include breakpoint(lg) {
        font-size: 16px;
    }
    @include breakpoint(xl) {
        font-size: 30px;
    }
}

.smallerFont {
    font-size: 10px;
    @include breakpoint(lg) {
        font-size: 16px;
    }
    @include breakpoint(xl) {
        font-size: 24px;
    }
}
</style>
