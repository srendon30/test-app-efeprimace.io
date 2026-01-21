<template>
    <div id="simple-bar-chart">
        <apexchart type="bar" width="420" height="450"  :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const series = ref([{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
}])

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
            'United States', 'China', 'Germany'
        ],
    }
})
</script>

<style></style>