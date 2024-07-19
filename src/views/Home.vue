<template>
    <p>{{ currentTimeStr }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
    setup(){
        let currentTimeStr = ref<string>("12.58")
        let currentTime = ref<number>()

        return{
            currentTimeStr
        }
    }
})
</script>

<style>

</style>