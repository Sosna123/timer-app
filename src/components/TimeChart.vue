<template>
    <div class="p-1 me-3 rounded-2">
        <canvas id="timeChart"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import Chart from "chart.js/auto";
import { onMounted } from "vue";
import formatNormal from "@/js/timeFormat";
export default defineComponent({
    props: ["timeList", "updateChartNum"],
    setup(props) {
        //* vars
        let canvas: any;
        let canvasContext: any;
        let lineChart: any;

        let filteredTimeList = props.timeList.filter((i: any) => !i.addedDnf);

        function makeChart() {
            lineChart = new Chart(canvasContext, {
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
                                color: "rgba(255,255,255,0.5)",
                            },
                            grid: {
                                color: "rgba(255,255,255,0.5)",
                            },
                        },
                        x: {
                            grid: {
                                color: "rgba(255,255,255,0.5)",
                            },
                            ticks: {
                                color: "rgba(255,255,255,0)",
                            },
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
                    labels: filteredTimeList.map((i: any) => i.num),
                    datasets: [
                        {
                            label: "Time",
                            data: filteredTimeList.map((i: any) => i.num),
                        },
                    ],
                },
            });
        }

        function tryToUpdateChartUntilShown() {
            canvas = document.getElementById("timeChart") as HTMLCanvasElement;
            let i = 0;
            let interval = setInterval(() => {
                i++;
                if (canvas.checkVisibility()) {
                    canvasContext = canvas.getContext("2d");
                    updateChart(1);
                    clearInterval(interval);
                }
                if (i >= 10) {
                    clearInterval(interval);
                }
            }, 100);
        }

        //* create or update every time timeList changes
        function updateChart(timeout: number = 0) {
            if (lineChart) {
                lineChart.data = {
                    labels: filteredTimeList.map((i: any) => i.num),
                    datasets: [
                        {
                            label: "Time",
                            data: filteredTimeList.map((i: any) => i.num),
                        },
                    ],
                };
                setTimeout(() => {
                    lineChart.update();
                }, timeout);
            } else {
                setTimeout(() => {
                    makeChart();
                }, timeout);
            }
        }

        //* create canvas when html is loaded
        onMounted(() => {
            tryToUpdateChartUntilShown();
        });

        //* watching for array change or show timelist on mobile to update chart
        watch(
            () => props.timeList,
            () => {
                filteredTimeList = props.timeList.filter(
                    (i: any) => !i.addedDnf
                );
                tryToUpdateChartUntilShown();
            },
            { deep: true }
        );

        //* timeout so it renders after timelist is shown
        watch(
            () => props.updateChartNum,
            () => {
                tryToUpdateChartUntilShown();
            }
        );

        return { timeList: props.timeList };
    },
});
</script>

<style></style>
