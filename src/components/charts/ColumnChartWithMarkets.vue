<template>
    <div id="column-chart-with-markets">
        <apexchart type="bar" :width="props.width" :height="props.height" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    width: {
        type: String,
        default: '500',
    },
    height: {
        type: String,
        default: '450',
    },
    data: {
        type: Array,
        default: () => [],
    },
});

onMounted(() => {
    // Si se pasa data como prop, se asigna a series
    if (props.data && props.data.length) {
        series.value = [{
            name: 'Actual',
            data: props.data
        }];
    }
});

// Data for the chart
const series = ref([
    {
        name: 'Actual',
        data: [
            // {
            //     x: 'María',
            //     y: 76,
            //     goals: [
            //         {
            //             name: 'Esperado',
            //             value: 90,
            //             strokeHeight: 5,
            //             strokeColor: '#FF0000',
            //         },
            //     ],
            // },
            // {
            //     x: 'Manuel',
            //     y: 43,
            //     goals: [
            //         {
            //             name: 'Esperado',
            //             value: 54,
            //             strokeHeight: 5,
            //             strokeColor: '#FF0000',
            //         },
            //     ],
            // },
        ],
    },
]);

// Chart options
const chartOptions = ref({
    chart: {
        height: 350,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            columnWidth: '30%',
        },
    },
    colors: ['#EC7522'],
    dataLabels: {
        enabled: false,
    },
    yaxis: {
        min: 0,
        max: 100,
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Actual', 'Esperado'],
        markers: {
            fillColors: ['#EC7522', '#FF0000'],
        },
    },
    tooltip: {
        theme: 'dark',
        style: {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFFFFF',
        },
    }
});
</script>