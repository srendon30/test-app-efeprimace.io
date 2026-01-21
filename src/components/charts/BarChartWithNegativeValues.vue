<template>
    <div id="bar-chart-with-negative-values">
        <apexchart type="bar" width="420" height="450" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const series = ref([
    {
        name: 'Completadas',
        data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3],
    },
    {
        name: 'Pendientes',
        data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4],
    },
]);

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 440,
        stacked: true,
    },
    colors: ['#EC7522', '#FF4560'],
    plotOptions: {
        bar: {
            borderRadius: 5,
            borderRadiusApplication: 'end', // 'around', 'end'
            borderRadiusWhenStacked: 'all', // 'all', 'last'
            horizontal: true,
            barHeight: '80%',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 1,
        colors: ['#fff'],
    },
    grid: {
        xaxis: {
            lines: {
                show: false,
            },
        },
    },
    yaxis: {
        stepSize: 1,
    },
    tooltip: {
        shared: false,
        x: {
            formatter: function (val) {
                return val;
            },
        },
        y: {
            formatter: function (val) {
                return Math.abs(val) + '%';
            },
        },
    },
    title: {
        text: 'Cumplimiento de actividades',
    },
    xaxis: {
        categories: [
            'María Fernanda',
            'José Luis',
            'María José',
            'María de los Ángeles',
            'Laura',
            'José Antonio',
            'José Manuel',
            'Eliana',
            'Paola',
            'Karla',
            'Héctor',
            'José Alfredo',
        ],
        title: {
            text: 'Percent',
        },
        labels: {
            formatter: function (val) {
                return Math.abs(Math.round(val)) + '%';
            },
        },
    },
});
</script>