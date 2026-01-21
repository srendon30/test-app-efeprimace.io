<template>
    <div id="grouped-bar-chart">
        <apexchart type="bar" :width="props.width" :height="props.height" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '420',
    },
    height: {
        type: String,
        default: '450',
    },
    data: {
        type: Object,
        default: () => {
            return {
                categories: [],
                series: []
            }
        },
    },
})

onMounted(() => {
    // Si se pasa data como prop, se asigna a series
    if (props.data && props.data.categories && props.data.series) {
        chartOptions.value.xaxis.categories = props.data.categories
        series.value = props.data.series
    }
})

const series = ref([])

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 430
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'top',
            },
        }
    },
    colors: ['#EC7522', '#70706F'],
    dataLabels: {
        enabled: true,
        offsetX: -20,
        style: {
            fontSize: '12px',
            colors: ['#fff']
        },
        formatter: function (val) {
            return val + "%";
        }
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
    },
    xaxis: {
        categories: [],
    },
    tooltip: {
        theme: 'dark',
        style: {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFFFFF',
        },
        shared: true,
        intersect: false,
        y: {
            formatter: function (val) {
                return val + "% " + " desarrollado"
            }
        }
    },
})
</script>