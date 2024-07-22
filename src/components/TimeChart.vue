<template>
    <div class="bg-light p-1 me-3">
        <canvas id="timeChart"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import Chart from "chart.js/auto";
import { onMounted } from "vue";
import formatNormal from "@/js/timeFormat";
export default defineComponent({
    props: ["timeList"],
    setup(props) {
        //* vars
        let canvas: any;
        let lineChart: any;

        //* create or update every time timeList changes
        function updateChart() {
            if (lineChart) {
                lineChart.destroy();
            }
            lineChart = new Chart(canvas, {
                type: "line",
                options: {
                    animation: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value: any) {
                                    return formatNormal(value.toString());
                                },
                            },
                        },
                        x: {
                            display: false,
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem: any) {
                                    return formatNormal(
                                        tooltipItem.parsed.y.toString()
                                    );
                                },
                                title: function (tooltipItem: any) {
                                    return "";
                                },
                            },
                        },
                    },
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

        //* create canvas when html is loaded
        onMounted(() => {
            canvas = document.getElementById("timeChart") as HTMLCanvasElement;
            canvas = canvas.getContext("2d");
            updateChart();
        });

        //* watching for array change to update chart
        watch(
            () => props.timeList,
            () => {
                updateChart();
            },
            { deep: true }
        );

        return { timeList: props.timeList };
    },
});
</script>

<style></style>
