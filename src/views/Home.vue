<template>
    <div class="timeList w-25 bg-primary-subtle overflow-scroll p-3 d-inline-block float-start">
        <h1 class="headingTimeList">Your times:</h1>
        <ul>
            <li v-for="time in timeArray" class="fs-2">
                {{ time.str }}
            </li>
        </ul>
    </div>
    <Timer class="float-start" @time-done="i => addTime(i)"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Timer from "../components/Timer.vue"
import TimeList from "../components/TimeList.vue"
export default defineComponent({
    setup(){
        let timeArray = ref<{str:string, num:number}[]>([])
        
        function addTime(time:{str:string, num:number}){
            timeArray.value.push(time)
        }
        
        return{
            timeArray,
            addTime
        }
    },
    components: {Timer, TimeList}
})
</script>

<style>

</style>