<template>
    <div id="simple-colum-chart">
        <apexchart type="bar" width="420" height="450" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const chartOptions = ref({
    chart: {
        id: 'basic-bar'
    },
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
})

const series = ref([
    {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
])
</script>

<style></style>