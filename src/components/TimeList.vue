<template>
    <div class="timeList overflow-y-scroll overflow-x-hidden pa-5 bg-primary">
        <div class="d-inline-block">
            <TimeChart :timeList="timeArray" />
        </div>
        <div class="d-inline-block">
            <h1 class="headingTimeList">Your times:</h1>
            <h2 class="ma-0">Solves: {{ timeArray.length }}</h2>
            <h2 class="ma-0">PB single: {{ pbTime.str }}</h2>
            <h2 class="ma-0">PB ao5: {{ pbAo5.str }}</h2>
            <h2 class="ma-0">Mean: {{ meanOfArr(timeArray) }}</h2>
        </div>
        <v-divider class="border-opacity-100 my-4"></v-divider>
        <v-btn
            @click="$emit('changeUsername', true)"
            :disabled="$props.editingUsername"
            class="d-inline-block">
            <button>Change Username</button>
        </v-btn>
        <p class="d-inline-block ml-3 ma-0 pa-0 md-fs-20">
            {{ $props.username }}
        </p>
        <v-divider class="border-opacity-100 my-4"></v-divider>
        <ul>
            <li v-for="time in timeArray.toReversed()" class="fs-2">
                <p class="d-inline-block me-3 timeListText">
                    {{ time.str }}
                </p>
                <p class="d-inline-block me-3 timeListText">|</p>
                <!-- <p class="d-inline-block me-3 timeListText">
                    a05:
                    {{
                        timeArrayAvgs.length > 0 && timeArray.
                            ? timeArrayAvgs.toReversed()[time.id - 4].str
                            : "0.00"
                    }}
                </p> -->
                <v-btn
                    @click="modifyTime('plus2', time)"
                    class="timeBtn mr-2"
                    :disabled="$props.editingUsername">
                    <button>+2</button>
                </v-btn>
                <v-btn
                    @click="modifyTime('dnf', time)"
                    class="timeBtn mr-2"
                    :disabled="$props.editingUsername">
                    <button>dnf</button>
                </v-btn>
                <v-btn
                    @click="modifyTime('remove', time)"
                    class="timeBtn mr-2"
                    :disabled="$props.editingUsername">
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
import ChangeUsername from "@/components/ChangeUsername.vue";
export default defineComponent({
    props: ["time", "username", "editingUsername"],
    components: { TimeChart, ChangeUsername },
    setup(props, { emit }) {
        //* types
        type Time = {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        };

        //* vars
        const jscookie = require("js-cookie");
        let timeArray = ref<Time[]>([]);
        let timeArrayAvgs = ref<
            {
                str: string;
                num: number;
            }[]
        >([]);
        let pbTime = ref<Time>({
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

        //* communication with database
        async function fetchData(method: string, body?: object) {
            const fetched = await fetch("https://frog01-31260.wykr.es/", {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await fetched.json();
            return data;
        }
        async function getData() {
            fetchData("get").then((e) => {
                clearCookies();
                e.forEach((i: any) => {
                    if (i.username == props.username) {
                        let newTime = {
                            id: i.id,
                            str: i.str,
                            num: i.num,
                            added2: i.added2,
                            addedDnf: i.addedDnf,
                        };
                        timeArray.value.push(newTime);
                    }
                });
            });
        }
        function postData(body: any) {
            body.username = props.username;
            fetchData("post", body);
        }
        function putData(body: any) {
            body.username = props.username;
            fetchData("put", body);
        }
        function delData(body: any) {
            body.username = props.username;
            fetchData("delete", body);
        }

        //* push the time to timeArray
        function addTime(time: {
            id: number;
            str: string;
            num: number;
            added2: boolean;
            addedDnf: boolean;
        }) {
            timeArray.value.push(time);
            postData(time);
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
                        e.added2 = !e.added2;
                        e.num += 200;
                        e.str = formatNormal(e.num.toString()) + "+";
                    } else if (e.id == time.id && e.added2) {
                        e.added2 = !e.added2;
                        e.num -= 200;
                        e.str = formatNormal(e.num.toString());
                    }
                });
                putData(time);
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
                putData(time);
            } else if (action == "remove") {
                //* remove the time
                delData(time);
                timeArray.value.forEach((e) => {
                    timeArray.value = timeArray.value.filter((e) => {
                        if (
                            e.id == time.id &&
                            e.str == time.str &&
                            e.num == time.num &&
                            e.added2 == time.added2 &&
                            e.addedDnf == time.addedDnf
                        ) {
                            return false;
                        }
                        return true;
                    });
                });
            }

            //* defocus the buttons after clicking to fix the bug of deleting times instead of adding them
            let buttons = Array.from(
                document.getElementsByClassName(
                    "timeBtn"
                ) as HTMLCollectionOf<HTMLElement>
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

        watch(
            () => props.username,
            () => {
                clearCookies();
                getData().then(() => {
                    if (timeArray.value.length > 0) {
                        let timeId = timeArray.value[-1].id + 1;
                        jscookie.set("timeId", timeId, { expires: 365 * 10 });
                    } else {
                        jscookie.set("timeId", 0, { expires: 365 * 10 });
                    }
                    emit("timeDeleted");
                });
            }
        );

        clearCookies();
        getData();

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
    background-color: #242323;
}

.timeListText {
    font-size: 32px;
}

.fs-20 {
    font-size: 20px;
}
</style>
