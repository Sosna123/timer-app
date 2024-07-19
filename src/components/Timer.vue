<template>
    <div @click="manageTimer();" class="fs-1">{{ currentTimeStr }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import formatNormal from '@/js/timeFormat';
export default defineComponent({
    setup(props, { emit }){
        //* vars
        let currentTimeStr = ref<string>("0.00")
        let currentTime = ref<number>(0)
        let startOfTimer : number|null = null
        let timerRunning: boolean = false
        let intervalTimer:any = null

        //* functions
        function manageTimer(){
            if(!timerRunning){
                startOfTimer = new Date().getTime()
                intervalTimer = setInterval(() => {
                    currentTime.value = new Date().getTime() - startOfTimer!
                    currentTimeStr.value = formatNormal((Math.trunc(currentTime.value/10)).toString())
                }, 10)
                timerRunning = true
            }else{
                clearInterval(intervalTimer)
                currentTime.value = new Date().getTime() - startOfTimer!
                currentTimeStr.value = formatNormal((Math.trunc(currentTime.value/10)).toString())
                timerRunning = false
                const time = {str: currentTimeStr.value, num: currentTime.value}
                emit('time-done', time)
            }

        }

        //* return
        return{
            currentTimeStr,
            manageTimer
        }
    }
})
</script>

<style>

</style>