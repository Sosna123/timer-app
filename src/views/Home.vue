<template>
    <div class="timeList bg-primary-subtle overflow-y-scroll overflow-x-hidden p-3 d-inline-block float-start">
        <h1 class="headingTimeList">Your times:</h1>
        <ul>
            <li v-for="time in timeArray.toReversed()" class="fs-2">
                {{ time.str }}
                <button @click="modifyTime('plus2', time)">+2</button>
                <button @click="modifyTime('dnf', time)">dnf</button>
                <button @click="modifyTime('remove', time)">-</button>
            </li>
        </ul>
    </div>
    <Scrambles :change-scramble="changeScramble"/>
    <Timer class="float-start" @time-done="i => {addTime(i); changeScramble++}"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Timer from "../components/Timer.vue"
import Scrambles from '@/components/Scrambles.vue'
import formatNormal from '@/js/timeFormat';
export default defineComponent({
    setup(){
        let jscookie = require("jscookie")
        let timeArray = ref<{id:number, str:string, num:number, added2:boolean, addedDnf:boolean}[]>([])
        let changeScramble:number = 0
        
        function addTime(time:{id:number, str:string, num:number, added2:boolean, addedDnf:boolean}){
            timeArray.value.push(time)
            jscookie.set({
                name:"timeList",
                value: JSON.stringify(timeArray.value),
                exdays: 365 * 10
            })
        }

        function modifyTime(action:"plus2"|"dnf"|"remove", time:{id:number, str:string, num:number, added2:boolean, addedDnf:boolean}){
            if(action == "plus2"){
                timeArray.value.forEach(e => {
                    if(e.id == time.id && !e.added2){
                        if(e.addedDnf){
                            e.addedDnf = !e.addedDnf
                            e.str = formatNormal(e.num.toString())
                        }
                        console.log(e)
                        e.added2 = !e.added2
                        e.num += 200
                        e.str = formatNormal(e.num.toString()) + "+"
                    }else if(e.id == time.id && e.added2){
                        e.added2 = !e.added2
                        e.num -= 200
                        e.str = formatNormal(e.num.toString())
                    }
                })
            }else if(action == "dnf"){
                timeArray.value.forEach(e => {
                    if(e.id == time.id && !e.addedDnf){
                        if(e.added2){
                            e.added2 = !e.added2
                            e.num -= 200
                            e.str = formatNormal(e.num.toString())
                        }
                        e.addedDnf = !e.addedDnf
                        e.str = `DNF(${e.str})`
                    }else if(e.id == time.id && e.addedDnf){
                        e.addedDnf = !e.addedDnf
                        e.str = formatNormal(e.num.toString())
                    }
                })
            }else if(action == "remove"){
                timeArray.value.forEach(e => {
                    if(e.id == time.id){
                        timeArray.value = timeArray.value.filter(e => {
                            if(e.id != time.id){
                                return true
                            }
                            return false
                        })
                    }
                })
            }

            jscookie.set({
                name:"timeList",
                value: JSON.stringify(timeArray.value),
                exdays: 365 * 10
            })
        }
        
        if(jscookie.get('timeList')){
            timeArray.value = JSON.parse(jscookie.get('timeList'))
        }

        return{
            timeArray, changeScramble,
            addTime, modifyTime
        }
    },
    components: {Timer, Scrambles}
})
</script>

<style>
.timeList{
    height: 100vh;
    width: 30%;
}

.headingTimeList{
    display: sticky;
}
</style>