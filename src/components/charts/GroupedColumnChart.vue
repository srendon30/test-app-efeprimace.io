<template>
    <div id="grouped-column-chart">
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
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#EC7522', '#70706F'],
    xaxis: {
        categories: [],
    },
    yaxis: {
        title: {
            text: '% Desarrollado'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        theme: 'dark',
        style: {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFFFFF',
        },
        y: {
            formatter: function (val) {
                return val + "% " + " desarrollado"
            }
        }
    }
})
</script>
<!-- <script setup>
import { ref } from 'vue'

const series = ref([
    {
        name: 'Ingeniería',
        type: 'column',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    },
    {
        name: 'Dibujo',
        type: 'column',
        data: [76, 85, 91, 98, 87, 75, 91, 99, 94]
    },
    {
        name: 'Avance Estimado',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22],
    },
])

const chartOptions = ref({
    // chart: {
    //     type: 'bar',
    //     height: 350
    // },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
        },
    },
    // dataLabels: {
    //     enabled: false
    // },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [2],
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#EC7522', '#70706F', '#00E396'],
    xaxis: {
        categories: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'],
    },
    yaxis: [
        {
            title: {
                text: '% Desarrollado'
            }
        },
        {
            opposite: true,
            title: {
                text: 'Avance Estimado',
            },
        },
    ],
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "% " + val + " desarrollado"
            }
        }
    }
})
</script> -->

<!-- <script setup>
import { ref } from 'vue';

const series = ref([
  {
    name: 'Website Blog',
    type: 'column',
    data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
  },
  {
    name: 'Social Media',
    type: 'line',
    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
  },
]);

const chartOptions = ref({
  stroke: {
    width: [0, 4],
  },
  title: {
    text: 'Traffic Sources',
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  labels: [
    '01 Jan 2001',
    '02 Jan 2001',
    '03 Jan 2001',
    '04 Jan 2001',
    '05 Jan 2001',
    '06 Jan 2001',
    '07 Jan 2001',
    '08 Jan 2001',
    '09 Jan 2001',
    '10 Jan 2001',
    '11 Jan 2001',
    '12 Jan 2001',
  ],
  yaxis: [
    {
      title: {
        text: 'Website Blog',
      },
    },
    {
      opposite: true,
      title: {
        text: 'Social Media',
      },
    },
  ],
});
</script> -->