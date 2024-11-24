<template>
    <div
        class="position-absolute d-flex"
        style="
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2;
        ">
        <div>
            <div
                class="timeContainer bg-primary"
                v-if="$props.time != null"
                style="overflow-y: scroll">
                <h1 style="font-size: 64px">{{ $props.time.str }}</h1>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                    ">
                    <v-btn
                        style="width: 150px"
                        color="background"
                        @click="$emit('modifyTime', ['plus2', time])"
                        ><button>Add +2</button></v-btn
                    >
                    <v-btn
                        style="width: 150px"
                        color="background"
                        @click="$emit('modifyTime', ['dnf', time])"
                        ><button>Add DNF</button></v-btn
                    >
                    <v-btn
                        style="width: 150px"
                        color="background"
                        @click="
                            $emit('modifyTime', ['remove', time]);
                            $emit('exit-time-modifying');
                        "
                        ><button>Remove time</button></v-btn
                    >
                </div>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <p
                    class="hoverUnderline"
                    @click="
                        navigator.clipboard.writeText($props.time.scramble)
                    ">
                    Scramble: {{ makeShortScrambleText($props.time.scramble) }}
                </p>
                <p>Date: {{ getDateString(new Date($props.time.date)) }}</p>
                <v-divider class="my-3" :thickness="3" length="90%"></v-divider>
                <v-btn
                    style="width: 400px"
                    color="background"
                    @click="$emit('exit-time-modifying')"
                    ><button>Exit</button></v-btn
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
    props: ["time"],
    setup(props, { emit }) {
        function getDateString(date: Date): string {
            // time hh:mm:ss
            let hours = date.getHours(); /* hours */
            let minutes = date.getMinutes() + ""; /* minutes */
            minutes.length == 1 ? (minutes = "0" + minutes) : null;
            let seconds = date.getSeconds() + ""; /* seconds */
            seconds.length == 1 ? (seconds = "0" + seconds) : null;
            // day dd/mm/yyyy
            let days = date.getDate(); /* day */
            let months = date.getMonth() + 1; /* month */
            let year = date.getFullYear(); /* year */
            return `${hours}:${minutes}.${seconds} ${days}/${months}/${year}`;
        }

        function makeShortScrambleText(scramble: string): string {
            let scrambleArr: string[] = scramble.split(" ");
            scrambleArr = scrambleArr.filter((e) => {
                if (e == "" || e == " ") {
                    return false;
                }
                return true;
            });
            if (scrambleArr.length <= 15) {
                return scrambleArr.join(" ");
            }
            let scrambleArrFiltered: string[] = scrambleArr.filter(
                (_e, index) => {
                    if (index > 15) {
                        return false;
                    }
                    return true;
                }
            );
            let shortScrambleText: string =
                scrambleArrFiltered.join(" ") + "...";
            return shortScrambleText;
        }

        return {
            navigator,
            makeShortScrambleText,
            getDateString,
        };
    },
});
</script>

<style>
.timeContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    height: 600px;
    position: relative;
    overflow: hidden;
    text-align: center;
}
.timeContainer > p {
    font-size: 24px;
}
.hoverUnderline:hover {
    text-decoration: underline;
}
</style>
