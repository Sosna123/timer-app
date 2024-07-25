<template>
    <div
        class="timeList overflow-y-scroll overflow-x-hidden p-3 d-inline-block float-start">
        <div class="timeListChart d-inline-block">
            <TimeChart :timeList="timeArray" />
        </div>
        <div class="timeListText d-inline-block">
            <h1 class="headingTimeList">Your times:</h1>
            <h4 class="m-0">Solves: {{ timeArray.length }}</h4>
            <h4 class="m-0">PB single: {{ pbTime.str }}</h4>
            <h4 class="m-0">PB ao5: {{ pbAo5.str }}</h4>
            <h4 class="m-0">Mean: {{ meanOfArr(timeArray) }}</h4>
        </div>
        <hr />
        <v-btn @click="clearCookies()">
            <button>clear cookies</button>
        </v-btn>
        <ul>
            <li v-for="time in timeArray.toReversed()" class="fs-2">
                <p class="d-inline-block me-3">{{ time.str }}</p>
                <v-btn @click="modifyTime('plus2', time)" class="mr-2">
                    <button>+2</button>
                </v-btn>
                <v-btn @click="modifyTime('dnf', time)" class="mr-2">
                    <button>dnf</button>
                </v-btn>
                <v-btn
                    class="removeButton mr-2"
                    @click="modifyTime('remove', time)">
                    <button>-</button>
                </v-btn>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, watch } from "vue";
import formatNormal from "@/js/timeFormat";
import TimeChart from "@/components/TimeChart.vue";
export default defineComponent({
    props: ["time"],
    components: { TimeChart },
    setup(props, { emit }) {
        //* vars
        const jscookie = require("js-cookie");
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
        let pbAo5 = ref<{
            str: string;
            num: number;
        }>({
            str: "0.00",
            num: 0,
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
                        jscookie.set("timeId", timeId, { expires: 365 * 10 });
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

                //* calculate avg of 5
                if (timeArray.length >= 5) {
                    timeArrayAvgs.value = [];
                    calcAvgs();
                } else {
                    timeArrayAvgs.value = [];
                }

                //* cookies change
                jscookie.set("timeArray", JSON.stringify(timeArray), {
                    expires: 365 * 10,
                });

                if (timeArray.length == 0) {
                    jscookie.set("timeId", 0, { expires: 365 * 10 });
                }
            },
            { deep: true }
        );

        const getConsecutiveArrays = <T, _>(arr: T[], size: number): T[][] =>
            size > arr.length
                ? []
                : arr.slice(size - 1).map((_, i) => arr.slice(i, size + i));

        //* function to calculate avg of 5
        function calcAvgs() {
            let timeArrayCopy: {
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
            }[] = [...toRaw(timeArray.value)];

            let allArrays = getConsecutiveArrays(timeArrayCopy, 5);

            allArrays.forEach((array) => {
                calcAvg(array);
            });
        }

        function calcAvg(
            array: {
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
            }[]
        ) {
            array.sort((a, b) => {
                if (a.addedDnf) {
                    return 1;
                }
                if (b.addedDnf) {
                    return -1;
                }

                if (a.num > b.num) {
                    return 1;
                } else if (a.num < b.num) {
                    return -1;
                } else {
                    return 0;
                }
            });

            array.shift();
            array.pop();

            let dnfAvg: boolean = false;

            array.forEach((e) => {
                if (e.addedDnf) {
                    dnfAvg = true;
                }
            });

            if (dnfAvg) {
                timeArrayAvgs.value.push({
                    str: "DNF",
                    num: -1,
                });
            } else {
                let sumOfTimes = array.reduce((acc, e) => {
                    return acc + e.num;
                }, 0);

                sumOfTimes = Math.round(sumOfTimes / 3);
                timeArrayAvgs.value.push({
                    str: formatNormal(sumOfTimes.toString()),
                    num: sumOfTimes,
                });
            }
        }

        watch(
            timeArrayAvgs,
            (timeArrayAvgs) => {
                //* update pbao5
                if (timeArrayAvgs.length > 0) {
                    timeArrayAvgs.filter((e) => {
                        if (e.num < 0) {
                            return false;
                        }
                        return true;
                    });
                    if (timeArrayAvgs.length > 0) {
                        timeArrayAvgs.sort(
                            (
                                a: {
                                    str: string;
                                    num: number;
                                },
                                b: {
                                    str: string;
                                    num: number;
                                }
                            ) => {
                                if (a.num > b.num) {
                                    return 1;
                                } else if (a.num < b.num) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            }
                        );
                        pbAo5.value = timeArrayAvgs[0];
                    } else {
                        pbAo5.value = {
                            str: "0.00",
                            num: 0,
                        };
                    }
                } else {
                    pbAo5.value = {
                        str: "0.00",
                        num: 0,
                    };
                }

                //* cookies change
                jscookie.set("timeArrayAvgs", JSON.stringify(timeArrayAvgs), {
                    expires: 365 * 10,
                });
            },
            { deep: true }
        );

        //* restore values from cookies
        if (jscookie.get("timeArray")) {
            timeArray.value = JSON.parse(jscookie.get("timeArray"));
        }
        if (jscookie.get("timeArrayAvgs")) {
            timeArrayAvgs.value = JSON.parse(jscookie.get("timeArrayAvgs"));
        }

        function clearCookies() {
            timeArray.value = [];
            timeArrayAvgs.value = [];
            emit("timeDeleted");
            jscookie.remove("timeArray");
            jscookie.remove("timeArrayAvgs");
            jscookie.remove("timeId");
        }

        return {
            //* vars
            timeArray,
            timeArrayAvgs,
            changeScramble,
            pbTime,
            pbAo5,
            //* functions
            addTime,
            modifyTime,
            meanOfArr,
            clearCookies,
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

h3,
h4 {
    color: white;
}
</style>
