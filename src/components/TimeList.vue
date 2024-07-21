<template>
    <div
        class="timeList bg-primary-subtle overflow-y-scroll overflow-x-hidden p-3 d-inline-block float-start">
        <h1 class="headingTimeList">Your times:</h1>
        <h3>Solves: {{ timeArray.length }}</h3>
        <h3>PB: {{ pbTime.str }}</h3>
        <h3>Mean: {{ meanOfArr(timeArray) }}</h3>
        <hr />
        <button @click="console.log(timeArrayAvgs)">
            console.log(timeArrayAvgs)
        </button>
        <ul>
            <li v-for="time in timeArray.toReversed()" class="fs-2">
                {{ time.str }}
                <button @click="modifyTime('plus2', time)">+2</button>
                <button @click="modifyTime('dnf', time)">dnf</button>
                <button @click="modifyTime('remove', time)">-</button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
export default defineComponent({
    props: ["time"],
    setup(props, { emit }) {
        //* vars
        let jscookie = require("jscookie");
        let timeArray = ref<
            {
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
            }[]
        >([]);
        let timeArrayAvgs = ref<
            {
                str: string;
                num: number;
            }[]
        >([]);
        let pbTime = ref<{
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }>({
            id: 0,
            str: "0.00",
            num: 0,
            added2: false,
            addedDnf: false,
        });
        let changeScramble: number = 0;

        //* push the time to timeArray
        function addTime(time: {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }) {
            timeArray.value.push(time);
        }

        //* modify the time to add +2, dnf or remove it
        function modifyTime(
            action: "plus2" | "dnf" | "remove",
            time: {
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
            }
        ) {
            //* add +2 to time
            if (action == "plus2") {
                timeArray.value.forEach((e) => {
                    if (e.id == time.id && !e.added2) {
                        if (e.addedDnf) {
                            e.addedDnf = !e.addedDnf;
                            e.str = formatNormal(e.num.toString());
                        }
                        console.log(e);
                        e.added2 = !e.added2;
                        e.num += 200;
                        e.str = formatNormal(e.num.toString()) + "+";
                    } else if (e.id == time.id && e.added2) {
                        e.added2 = !e.added2;
                        e.num -= 200;
                        e.str = formatNormal(e.num.toString());
                    }
                });
            } else if (action == "dnf") {
                //* change time to dnf
                timeArray.value.forEach((e) => {
                    if (e.id == time.id && !e.addedDnf) {
                        if (e.added2) {
                            e.added2 = !e.added2;
                            e.num -= 200;
                            e.str = formatNormal(e.num.toString());
                        }
                        e.addedDnf = !e.addedDnf;
                        e.str = `DNF(${e.str})`;
                    } else if (e.id == time.id && e.addedDnf) {
                        e.addedDnf = !e.addedDnf;
                        e.str = formatNormal(e.num.toString());
                    }
                });
            } else if (action == "remove") {
                //* remove the time and update the ids
                timeArray.value.forEach((e) => {
                    if (e.id == time.id) {
                        let timeId = jscookie.get("timeId");
                        timeId--;
                        jscookie.set({
                            name: "timeId",
                            value: timeId,
                            exdays: 365 * 10,
                        });
                        emit("timeDeleted", timeId);
                        timeArray.value = timeArray.value.filter((e) => {
                            if (e.id != time.id) {
                                return true;
                            }
                            return false;
                        });
                    }
                    if (e.id > time.id) {
                        e.id--;
                    }
                });
            }
        }

        //* calculate mean of session
        function meanOfArr(
            array: {
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
            }[]
        ): string {
            if (array.length > 0) {
                let sumOfTimes = array.reduce((acc, e) => {
                    return acc + e.num;
                }, 0);
                let meanNum = Math.trunc(sumOfTimes / array.length);
                let meanStr: string = formatNormal(meanNum.toString());
                return meanStr;
            } else {
                return "0.00";
            }
        }

        //* track props to add to timeArray
        watch(
            () => props.time,
            (time) => {
                addTime(time);
            }
        );

        //* watch for an timeArray change to save it and update pb
        watch(
            timeArray,
            (timeArray) => {
                //* cookies change
                jscookie.set({
                    name: "timeList",
                    value: JSON.stringify(timeArray),
                    exdays: 365 * 10,
                });

                //* pb change
                let timeArrayCopy = timeArray;
                timeArrayCopy = timeArrayCopy.filter((e) => !e.addedDnf);
                if (timeArrayCopy.length > 0) {
                    pbTime.value = timeArrayCopy.sort(
                        (
                            a: {
                                id: number;
                                str: string;
                                num: number;
                                added2: boolean;
                                addedDnf: boolean;
                            },
                            b: {
                                id: number;
                                str: string;
                                num: number;
                                added2: boolean;
                                addedDnf: boolean;
                            }
                        ) => {
                            if (a.num > b.num && !a.addedDnf) {
                                return 1;
                            } else if (a.num < b.num && !b.addedDnf) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    )[0];
                } else {
                    pbTime.value = {
                        id: 0,
                        str: "0.00",
                        num: 0,
                        added2: false,
                        addedDnf: false,
                    };
                }

                //* calculate avg of 5 (still todo)
                if (timeArray.length >= 5) {
                    timeArrayAvgs.value = [];
                    timeArray.forEach((e) => {
                        timeArrayAvgs.value.push(calcAvg(e));
                    });
                }
            },
            { deep: true }
        );

        //* function to calculate avg of 5
        function calcAvg(time: {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }): {
            str: string;
            num: number;
        } {
            //* copy the array and shorten it to 5 times
            let timeArrayCopy = [...timeArray.value];
            timeArrayCopy.filter((e) => {
                if (
                    e.id == time.id ||
                    e.id == time.id - 1 ||
                    e.id == time.id - 2 ||
                    e.id == time.id - 3 ||
                    e.id == time.id - 4
                ) {
                    return true;
                }
                return false;
            });
            if (timeArrayCopy.length < 5) {
                return {
                    str: "0.00",
                    num: 0,
                };
            }
            //* sort the array and remove the first and last element
            timeArrayCopy.sort((a, b) => {
                if (a.num > b.num) {
                    return 1;
                } else if (a.num < b.num) {
                    return -1;
                } else {
                    return 0;
                }
            });
            timeArrayCopy.shift();
            timeArrayCopy.pop();
            let avg = timeArrayCopy.reduce((acc, e) => {
                return acc + e.num;
            }, 0);
            avg = Math.trunc(avg / 3);
            return {
                str: formatNormal(avg.toString()),
                num: avg,
            };
        }

        watch(timeArray, (timeArray) => {}, { deep: true });

        watch(timeArrayAvgs, (time) => {
            console.log(time);
        });

        //* restore timeArray from cookies
        if (jscookie.get("timeList")) {
            timeArray.value = JSON.parse(jscookie.get("timeList"));
        }

        return {
            timeArray,
            timeArrayAvgs,
            changeScramble,
            pbTime,
            addTime,
            modifyTime,
            meanOfArr,
        };
    },
});
</script>

<style>
.timeList {
    height: 100vh;
    width: 30%;
}

.headingTimeList {
    display: sticky;
}
</style>
