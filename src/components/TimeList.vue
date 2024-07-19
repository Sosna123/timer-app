<template>
    <div class="timeList w-25 bg-primary-subtle overflow-scroll p-3 d-inline-block">
        <h1 class="headingTimeList">Your times:</h1>
        <ul>
            <li v-for="time in timeArray" class="fs-2">
                {{ time }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    setup(){
        let timeArray: string[] = ["12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82","12.37","12.85","1:12.82"]
        return{
            timeArray
        }
    }
})
</script>

<style>
.timeList{
    height: 100vh;
}

.headingTimeList{
    display: sticky;
}
</style>