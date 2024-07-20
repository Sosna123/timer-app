<template>
    <div class="scrambles bg-dark-subtle p-1 text-center float-start d-flex align-items-center justify-content-center">
        <h3 @click="changeScramble()" class="m-1 ms-2 fs-2">{{ scramble[0].scramble_string }}</h3>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { watch } from "vue";
export default defineComponent({
    props: ["changeScramble"],
    setup(props) {
        const Scrambow = require("scrambow").Scrambow;
        const scrambleGen = new Scrambow();
        let scramble = ref<{ scramble_string: string }[]>(scrambleGen.get(1));

        function changeScramble() {
            scramble.value = scrambleGen.get(1);
        }

        watch(
            () => props.changeScramble,
            () => {
                changeScramble();
            }
        );

        return {
            scramble,
            changeScramble,
        };
    },
});
</script>

<style>
.scrambles {
    height: 15vh;
    width: 70%;
}

.scrambles > h3 {
    cursor: pointer;
}
</style>
