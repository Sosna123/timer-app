<template>
    <div><canvas id="timeChart"></canvas></div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import Chart from "chart.js/auto";
import { onMounted } from "vue";
export default defineComponent({
    props: ["timeList"],
    setup(props) {
        let canvas: any;
        let lineChart: any;

        function createCanvas() {
            if (lineChart) {
                lineChart.destroy();
            }
            lineChart = new Chart(canvas, {
                type: "line",
                options: {
                    animation: false,
                },
                data: {
                    labels: props.timeList.map((i: any) => i.num),
                    datasets: [
                        {
                            label: "Time",
                            data: props.timeList.map((i: any) => i.num),
                        },
                    ],
                },
            });
        }

        onMounted(() => {
            canvas = document.getElementById("timeChart") as HTMLCanvasElement;
            canvas = canvas.getContext("2d");
            createCanvas();
        });

        watch(props.timeList, () => {
            createCanvas();
        });

        return { timeList: props.timeList };
    },
});
</script>

<style></style>
