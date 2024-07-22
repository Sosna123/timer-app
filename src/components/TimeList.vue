<template>
    <div
        class="timeList overflow-y-scroll overflow-x-hidden p-3 d-inline-block float-start">
        <div class="timeListChart d-inline-block">
            <TimeChart :timeList="timeArray" />
        </div>
        <div class="timeListText d-inline-block">
            <h1 class="headingTimeList">Your times:</h1>
            <h3>Solves: {{ timeArray.length }}</h3>
            <h3>PB: {{ pbTime.str }}</h3>
            <h3>Mean: {{ meanOfArr(timeArray) }}</h3>
        </div>
        <hr />
        <button @click="console.log(timeArrayAvgs)">
            console.log(timeArrayAvgs)
        </button>
        <ul>
            <li v-for="time in timeArray.toReversed()" class="fs-2">
                {{ time.str }}
                <button @click="modifyTime('plus2', time)">+2</button>
                <button @click="modifyTime('dnf', time)">dnf</button>
                <button
                    class="removeButton"
                    @click="modifyTime('remove', time)">
                    -
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import TimeChart from "@/components/TimeChart.vue";
export default defineComponent({
    props: ["time"],
    components: { TimeChart },
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

            //* defocus the buttons after clicking to fix the bug of deleting times instead of adding them
            let buttons = Array.from(
                document.getElementsByClassName(
                    "removeButton"
                ) as HTMLCollectionOf<HTMLButtonElement>
            );
            for (let e of buttons) {
                e.blur();
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

                //TODO
                //* calculate avg of 5
                if (timeArray.length >= 5) {
                    timeArrayAvgs.value = [];
                    timeArray.forEach((e) => {
                        timeArrayAvgs.value.push(calcAvg(e));
                    });
                }
            },
            { deep: true }
        );

        //TODO
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
            let timeArrayCopy = [...timeArray.value];
            timeArrayCopy
                .filter((e) => {
                    if (
                        e.id == time.id ||
                        e.id == time.id - 1 ||
                        e.id == time.id - 2 ||
                        e.id == time.id - 3 ||
                        e.id == time.id - 4
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .sort((a, b) => {
                    if (a.num > b.num && !a.addedDnf) {
                        return 1;
                    } else if (a.num < b.num && !b.addedDnf) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

            timeArrayCopy.shift();
            timeArrayCopy.pop();

            timeArrayCopy.forEach((e) => {
                if (e.addedDnf) {
                    return {
                        str: "DNF",
                        num: -1,
                    };
                }
            });

            let sumOfTimes = timeArrayCopy.reduce((acc, e) => {
                return acc + e.num;
            }, 0);

            return {
                str: formatNormal((sumOfTimes / 3).toString()),
                num: sumOfTimes / 3,
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
    background-color: #242323;
}

.headingTimeList {
    color: white;
}

hr {
    border-color: white;
}

ul > li {
    color: white;
}

h3 {
    color: white;
}
</style>
