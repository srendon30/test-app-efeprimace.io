<template>
    <div id="advanced-timeline-chart">
        <!-- <button @click="addTaskToBob" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ➕ Add Task to Bob
        </button> -->
        <apexchart type="rangeBar" width="420" height="450" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const dataSource = ref([
    {
        name: 'Bob',
        color: '#534c46',
        data: [
            { x: 'E1', y: [new Date('2019-03-05').getTime(), new Date('2019-03-08').getTime()] },
            { x: 'E2', y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()] },
            { x: 'E2', y: [new Date('2019-03-05').getTime(), new Date('2019-03-07').getTime()] },
            { x: 'E3', y: [new Date('2019-03-03').getTime(), new Date('2019-03-09').getTime()] },
            { x: 'E3', y: [new Date('2019-03-08').getTime(), new Date('2019-03-11').getTime()] },
            { x: 'E4', y: [new Date('2019-03-11').getTime(), new Date('2019-03-16').getTime()] },
            { x: 'E1', y: [new Date('2019-03-01').getTime(), new Date('2019-03-03').getTime()] }
        ]
    },
    {
        name: 'Joe',
        color: '#EC7522',
        data: [
            { x: 'E1', y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()] },
            {
                x: 'E3',
                y: [new Date('2019-03-06').getTime(), new Date('2019-03-16').getTime()],
                goals: [
                    { name: 'Break', value: new Date('2019-03-10').getTime(), strokeColor: '#CD2F2A' }
                ]
            },
            { x: 'E2', y: [new Date('2019-03-03').getTime(), new Date('2019-03-07').getTime()] },
            { x: 'E5', y: [new Date('2019-03-20').getTime(), new Date('2019-03-22').getTime()] },
            { x: 'E1', y: [new Date('2019-03-10').getTime(), new Date('2019-03-16').getTime()] }
        ]
    },
    {
        name: 'Libre',
        color: '#FFFACD',
        data: [
            { x: 'E2', y: [new Date('2019-03-10').getTime(), new Date('2019-03-17').getTime()] },
            {
                x: 'E4',
                y: [new Date('2019-03-05').getTime(), new Date('2019-03-09').getTime()],
                goals: [
                    { name: 'Break', value: new Date('2019-03-07').getTime(), strokeColor: '#CD2F2A' }
                ]
            }
        ]
    }
])

const series = computed(() => JSON.parse(JSON.stringify(dataSource.value)))

const chartOptions = ref({
    // chart: { height: 450, type: 'rangeBar' },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '80%'
        }
    },
    xaxis: { type: 'datetime' },
    stroke: { width: 1 },
    fill: { type: 'solid', opacity: 0.6 },
    legend: { position: 'top', horizontalAlign: 'left' }
})

// ➕ Agrega una nueva tarea a Bob
const addTaskToBob = () => {
    const bob = dataSource.value.find(person => person.name === 'Bob')
    if (bob) {
        bob.data.push({
            x: 'New Task',
            y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-15').getTime()
            ]
        })
    }
}
</script>