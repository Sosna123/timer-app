<template>
    <div class="text-center pa-5 bg-secondary">
        <v-select
            label="Scramble Type"
            :items="selectItems"
            item-title="name"
            item-value="value"
            v-model="scrambleType"
            density="compact"
            hide-details
            class="mb-1"
            :disabled="disableInput">
        </v-select>
        <h2
            @click="changeScramble()"
            class="fs-2 cursor-pointer ma-0 text-color-white lg-scramble-textLG xl-scramble-textXL"
            style="user-select: none"
            :class="{
                'lg-smallFontLG': smallFont === 1,
                'xl-smallFontXL': smallFont === 1,
                'lg-smallerFontLG': smallFont === 2,
                'xl-smallerFontXL': smallFont === 2,
            }">
            {{ scramble[0].scramble_string }}
        </h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { watch } from "vue";
export default defineComponent({
    props: ["changeScramble", "disableInput"],
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
        let smallFont = ref<0 | 1 | 2>(0);
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

        //* watch if scramble type changes
        watch(
            () => scrambleType.value,
            (scramType) => {
                scrambleGen = new Scrambow().setType(scramType);
                changeScramble();
                if (
                    scramType === "555" ||
                    scramType === "666" ||
                    scramType === "minx"
                ) {
                    smallFont.value = 1;
                } else if (scramType === "777") {
                    smallFont.value = 2;
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
        watch(
            () => props.disableInput,
            (disableInputProp) => {
                disableInput.value = disableInputProp;
            }
        );

        return {
            scramble,
            scrambleType,
            selectItems,
            smallFont,
            changeScramble,
        };
    },
});
</script>

<style>
.scramble-textXL {
    font-size: 48px;
}

.smallFontXL {
    font-size: 32px !important;
}

.smallerFontXL {
    font-size: 24px !important;
}

.scramble-textL {
    font-size: 64px;
}

.smallFontL {
    font-size: 24px !important;
}

.smallerFontL {
    font-size: 12px !important;
}
</style>
