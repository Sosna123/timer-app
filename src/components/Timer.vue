<template>
    <div @click="manageTimer();" class="fs-1">{{ currentTimeStr }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import formatNormal from '@/js/timeFormat';
import Scrambles from '@/components/Scrambles.vue'
export default defineComponent({
    setup(props, { emit }){
        //* vars
        let jscookie = require("jscookie")
        let currentTimeStr = ref<string>("0.00")
        let currentTime = ref<number>(0)
        let startOfTimer : number|null = null
        let timerRunning: boolean = false
        let intervalTimer: undefined|number
        let timeId: number = 0

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
                currentTime.value = Math.trunc((new Date().getTime() - startOfTimer!) / 10)
                currentTimeStr.value = formatNormal(currentTime.value.toString())
                timerRunning = false
                const time = {id: timeId, str: currentTimeStr.value, num: currentTime.value, added2: false, addedDnf: false}
                timeId++
                
                jscookie.set({
                    name:"timeId",
                    value: timeId,
                    exdays: 365 * 10
                })

                emit('time-done', time)
            }
        }

        if(jscookie.get("timeId")){
            timeId = jscookie.get("timeId")
        }

        document.body.addEventListener("keyup", (e) => {
            if(e.code == "Space"){
                manageTimer()
            }
        })

        //* return
        return{
            currentTimeStr,
            manageTimer
        }
    },
    components: {Scrambles}
})
</script>

<style>

</style>