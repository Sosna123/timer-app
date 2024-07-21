<template>
    <div
        class="timeList bg-primary-subtle overflow-y-scroll overflow-x-hidden p-3 d-inline-block float-start">
        <h1 class="headingTimeList">Your times:</h1>
        <h3>Your PB: {{ pbTime.str }}</h3>
        <h3>Your ao5: {{}}</h3>
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
    setup(props) {
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
                id: number;
                str: string;
                num: number;
                added2: boolean;
                addedDnf: boolean;
                ao5: {
                    str: string;
                    num: number;
                };
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

        function addTime(time: {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }) {
            timeArray.value.push(time);
        }

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
                timeArray.value.forEach((e) => {
                    if (e.id == time.id) {
                        timeArray.value = timeArray.value.filter((e) => {
                            if (e.id != time.id) {
                                return true;
                            }
                            return false;
                        });
                    }
                });
            }
        }

        watch(
            () => props.time,
            (time) => {
                addTime(time);
            }
        );

        watch(
            () => timeArray.value,
            () => {
                // cookies change
                jscookie.set({
                    name: "timeList",
                    value: JSON.stringify(timeArray.value),
                    exdays: 365 * 10,
                });

                // pb change
                let timeArrayCopy = timeArray.value;
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
                    console.log("no pb");
                    pbTime.value = {
                        id: 0,
                        str: "0.00",
                        num: 0,
                        added2: false,
                        addedDnf: false,
                    };
                }
            },
            { deep: true }
        );

        function calcAvgs(time: {
            id: number;
            num: number;
            str: string;
            added2: boolean;
            addedDnf: boolean;
        }) {
            let timeArrayCopy = timeArray.value;
            timeArrayCopy
                .filter((e) => {
                    if (
                        e.id == time.id ||
                        e.id == time.id - 1 ||
                        e.id == time.id - 2 ||
                        e.id == time.id - 3 ||
                        e.id == time.id - 4
                    ) {
                        return 1;
                    } else {
                        return 0;
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
            timeArrayCopy.pop();
            timeArrayCopy.shift();
            let avg5 = timeArrayCopy.reduce((acc, e) => {
                acc.num += e.num;
                return acc;
            });
            avg5.num = avg5.num / 3;
            let result = {
                id: time.id,
                str: time.str,
                num: time.num,
                added2: false,
                addedDnf: false,
                ao5: {
                    str: formatNormal(avg5.num.toString()),
                    num: avg5.num,
                },
            };

            timeArrayAvgs.value.push(result);
        }

        timeArray.value.forEach((e) => {
            calcAvgs(e);
        });

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
