<template>
    <div id="simple-pie-chart">
        <apexchart type="pie" :width="props.width" :height="props.height" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '400',
    },
    height: {
        type: String,
        default: '400',
    },
    data: {
        type: Array,
        default: () => [],
    },
})

onMounted(() => {
    // If data is passed as a prop, assign it to series
    if (props.data && props.data.length) {
        series.value = props.data
    }
})

const series = ref([])

const chartOptions = ref({
    labels: ['Avance', 'Sin Terminar'],
    colors: ['#EC7522', '#008FFB'],
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
})
</script>