<template>
    <div class="scrambles bg-dark-subtle p-1 text-center">
        <h3 class="m-1 ms-2">{{ scramble[0].scramble_string }}</h3>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    setup(){
        const Scrambow = require("scrambow").Scrambow
        const scrambleGen = new Scrambow()

        let scramble = scrambleGen.get(1)

        return{
            scramble
        }
    }
})
</script>

<style>
.scrambles{
    height: 10vh
}
</style>