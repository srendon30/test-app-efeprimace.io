<template>
    <div id="bar-chart-with-markets">
        <apexchart type="bar" :width="props.width" :height="props.height" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useMomentStore } from '@/stores/moment.js';
import { onMounted } from 'vue';

const { parseStoreDate, formatPrettyDate, parseTimeToPrettyDate } = useMomentStore();

const props = defineProps({
    width: {
        type: String,
        default: '600',
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

const series = ref([
    // {
    //     name: 'Actual',
    //     data: [
    //         {
    //             x: 'E1',
    //             y: parseStoreDate('2025-02-02').getTime(),
    //             goals: [
    //                 {
    //                     name: 'Esperado',
    //                     value: parseStoreDate('2025-05-12').getTime(),
    //                     strokeWidth: 5,
    //                     strokeColor: '#FF0000'
    //                 }
    //             ]
    //         },
    //         {
    //             x: 'E2',
    //             y: parseStoreDate('2025-03-10').getTime(),
    //             goals: [
    //                 {
    //                     name: 'Esperado',
    //                     value: parseStoreDate('2025-06-01').getTime(),
    //                     strokeWidth: 5,
    //                     strokeColor: '#FF0000'
    //                 }
    //             ]
    //         },
    //         {
    //             x: 'E3',
    //             y: parseStoreDate('2025-05-20').getTime(),
    //             goals: [
    //                 {
    //                     name: 'Esperado',
    //                     value: parseStoreDate('2025-06-01').getTime(),
    //                     strokeWidth: 5,
    //                     strokeColor: '#FF0000'
    //                 }
    //             ]
    //         }
    //     ],
    // },
]);

const chartOptions = ref({
    chart: {
        toolbar: {
            show: false, // Desactiva el menú de herramientas (incluye la opción de descargar imágenes)
        },
    },
    plotOptions: {
        bar: {
            barHeight: '30%',
            borderRadius: 5,
            horizontal: true,
        },
    },
    colors: ['#EC7522'],
    dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
            const goals =
                opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

            if (goals && goals.length) {
                return `${parseTimeToPrettyDate(val)} / ${parseTimeToPrettyDate(goals[0].value)}`;
            }
            return val;
        },
    },
    xaxis: {
        // type: 'datetime',
        min: parseStoreDate('2025-01-01').getTime(),
        max: parseStoreDate('2025-06-30').getTime(),
        labels: {
            formatter: function (val) {
                return parseTimeToPrettyDate(val);
            },
        },
        title: {
            text: 'Fechas de Entrega',
            style: { fontSize: '14px' }
        },
    },
    yaxis: {
        title: {
            // text: 'Estructuras',
            style: { fontSize: '14px' }
        },
        labels: {
            formatter: function (val) { return val; } // Muestra E1, E2 directamente
        }
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
        y: {
            formatter: function (val, opt) {
                const goals =
                    opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

                if (goals && goals.length) {
                    return `${parseTimeToPrettyDate(val)}`;
                }
                return val;
            },
        },
    },
});
</script>