<template>
    <AppLoader v-if="isLoadingApp" />
    <section class="relative py-4">
        <div class="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Otras Acciones -->
            <div class="flex justify-center items-center my-4 gap-2">
                <div>
                    <button @click="goToStartActivity()"
                        class="flex items-center px-4 py-2 text-sm text-identity transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200"
                        :class="['bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800', 'mb-2']">
                        <span>
                            Ir al inicio
                        </span>
                        <component :is="iconsForm['IconGo']" :class="['w-5 h-5']" />
                    </button>
                    <!-- <button @click="goToEndActivity()"
                        class="py-2 px-4 bg-identity-dark dark:bg-gray-900 text-white rounded-md font-medium transition-all hover:bg-identity-dark-gold">
                        Ir al final
                    </button> -->
                </div>
                <!-- <div>
                    <button @click="changeStartDate()"
                        class="py-2 px-4 bg-identity dark:bg-orange-900 text-black rounded-md font-medium transition-all hover:bg-identity-dark-gold">
                        Cambiar Fecha Inicio
                    </button>
                </div> -->
                <div>
                    <button @click="applyChanges()"
                        class="flex items-center px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200"
                        :class="['bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800', 'mb-2']">
                        <span>
                            Aplicar Cambios
                        </span>
                        <component :is="iconsForm['IconSave']" :class="['w-5 h-5']" />
                    </button>
                </div>
            </div>
            <!-- Controles de Vista -->
            <div class="flex justify-between items-center my-4">
                <h6 class="text-base font-semibold text-gray-900 dark:text-gray-200">{{ viewTitle }}: {{
        timeLabels.length }} días</h6>
                <div class="flex gap-2">
                    <button v-for="option in viewOptions" :key="option.value" @click="changeView(option.value)"
                        class="py-2 px-4 rounded-md font-medium transition-all" :class="[
        currentView === option.value
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ]">
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Gantt wrapper: aquí vive el overlay -->
            <div class="gantt-wrapper relative rounded-lg shadow-md bg-white dark:bg-gray-800">
                <!-- OVERLAY -->
                <div v-show="isGanttLoading" class="gantt-overlay absolute inset-0 flex items-center justify-center">
                    <div class="loader"></div>
                </div>

                <!-- Diagrama de Gantt-->
                <div class="rounded-lg shadow-md bg-white dark:bg-gray-800 sticky-container">
                    <!-- <vue-horizontal> -->
                    <table id="gantt-table" class="min-w-full divide-y divide-gray-700 dark:divide-gray-200">
                        <thead class="bg-identity-dark dark:bg-gray-900 bg-inherit sticky-row">
                            <tr>
                                <th v-for="(column, index) in filterColumns()" :key="index" :id="'head-column-' + index"
                                    class="py-3.5 px-4 text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300"
                                    :class="[{ 'sticky-column': index < props.stickyColumns }]"
                                    :style="index < props.stickyColumns ? { left: `${getLeftOffset(index)}px` } : {}">
                                    {{ column.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(task, index_task) in props.tasks" :key="task.id">
                                <td v-for="(column, index_column) in filterColumns()" :key="column.key"
                                    class="relative text-center font-medium text-gray-800 border-y border-gray-300 py-2"
                                    @click="canAddTask(column.key) ? showFormAddTask(column.key, index_task) : null"
                                    :class="[getBackgroundColumnClass(index_column, task), getBorderClass(column.key, task.start, task.end), canAddTask(column.key) ? 'cursor-pointer bg-green-200' : '']"
                                    :style="index_column < props.stickyColumns ? { left: `${getLeftOffset(index_column)}px` } : {}">

                                    <template v-if="column.key === 'start' || column.key === 'end'">
                                        {{ formatPrettyDate(task[column.key]) }}
                                    </template>
                                    <template v-else-if="column.key === 'duration'">
                                        {{ task[column.key] }} hrs
                                    </template>

                                    <!-- Antecesoras -->
                                    <template v-else-if="column.key === 'actividades_antecesoras_ids'">
                                        <div class="flex flex-row justify-center">
                                            <VDropdown :triggers="['click']" :placement="'top'">
                                                <button :title="'Actividades Antecesoras'"
                                                    :class="['m-1 p-1 rounded-md shadow-xl', 'bg-amber-100 border border-amber-600', 'custom-shadow']">
                                                    <component :is="iconsForm['IconHistory']"
                                                        :class="['w-5 h-5', 'text-amber-800']" />
                                                </button>
                                                <template #popper>
                                                    <div v-if="task && task[column.key] && Object.keys(task[column.key]).length > 0"
                                                        class="p-2 basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300 gap-4">
                                                        <div
                                                            class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                                            <span class="text-sm font-semibold text-green-800">
                                                                • <strong>{{ task[column.key] }} </strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div v-else class="p-2 bg-white dark:bg-gray-800">
                                                        <div
                                                            class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                                            <span class="text-sm font-semibold text-green-800">
                                                                No hay actividades antecesoras.
                                                            </span>
                                                        </div>
                                                    </div>
                                                </template>
                                            </VDropdown>
                                        </div>
                                    </template>

                                    <!-- Ir -->
                                    <template v-else-if="column.key === 'go'">
                                        <div class="flex flex-row justify-center">
                                            <button :title="'Ir'" @click="goToTask(index_task)"
                                                :class="['m-1 p-1 rounded-md shadow-xl', 'bg-emerald-100 border border-emerald-600', 'custom-shadow']">
                                                <component :is="iconsForm['IconGo']"
                                                    :class="['w-5 h-5', 'text-emerald-800']" />
                                            </button>
                                        </div>
                                    </template>

                                    <!-- Progreso -->
                                    <template v-else-if="column.key === 'progress'">
                                        <div class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                                            <div class="relative h-6 flex items-center justify-center">
                                                <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                                    :style="{ width: `${task[column.key]}%` }"
                                                    :class="getClassProgress(task[column.key])">
                                                </div>
                                                <div class="relative font-medium text-sm"
                                                    :class="getClassProgressText(task[column.key])">
                                                    {{ task[column.key] }}%
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <template
                                        v-else-if="currentView !== 'year' ? compareRangeDates(column.key, task.start, task.end) : isInMonthRange(task.start, task.end, column.key)">
                                        <VDropdown id="dropdown-task" :triggers="['click']" :placement="'top'"
                                            @show="onDropdownShow(task)">
                                            <div class="flex justify-center">
                                                <div class="cursor-pointer absolute h-5 shadow-2xl"
                                                    :class="[getBackgroundTaskClass(task, column), roundedBarClass(task, column)]"
                                                    :style="{ width: '100%' }"></div>
                                            </div>
                                            <div class="flex justify-center mt-6 text-xs text-center text-gray-800 shadow-lg border-color-identity-dark-gold"
                                                :class="[roundedBarClass(task, column), noWorkingDaysClass(task, column), noAvailableDaysClass(task, column.key)]">
                                                {{ formatPrettyBusinessDateDayMonth(column.key) }}
                                            </div>
                                            <template #popper>
                                                <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                                    <div v-for="(value, key) in taskSelected" :key="key"
                                                        class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                                        <div v-if="prettyKey(key)['show']"
                                                            class="my-1 p-1 border-color-identity-dark dark:border-gray-200">

                                                            <div v-if="key === 'start' || key === 'end'"
                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                • {{ prettyKey(key)['label'] }}:

                                                                <div class="flex flex-row justify-center items-center">
                                                                    <!-- Botón de restar 1 día -->
                                                                    <div class="flex justify-end mr-2">
                                                                        <button @click="reduceDateOnTask(key)"
                                                                            class="py-2 px-4 bg-identity-dark dark:bg-gray-900 text-white rounded-md font-medium transition-all hover:bg-identity-dark-gold ">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                class="h-4 w-4" fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor">
                                                                                <path stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    stroke-width="2"
                                                                                    d="M20 12H4M12 20l-8-8 8-8M4 12h16">
                                                                                </path>
                                                                            </svg>
                                                                        </button>

                                                                    </div>
                                                                    <!-- Input de fecha -->
                                                                    <div
                                                                        class="flex flex-row justify-center items-center">
                                                                        <VueDatePicker v-model="taskSelected[key]"
                                                                            :format="formatPrettyDate"
                                                                            :input-props="{ readonly: true }"
                                                                            :disabled="true"
                                                                            :disabled-dates="(date) => datesDisabled(date)"
                                                                            class="flex justify-center  " />
                                                                    </div>

                                                                    <!-- Botón de sumar 1 día -->
                                                                    <div class="flex justify-start ml-2">
                                                                        <button @click="addDateOnTask(key)"
                                                                            class="py-2 px-4 bg-identity-dark dark:bg-gray-900 text-white rounded-md font-medium transition-all hover:bg-identity-dark-gold ">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                class="h-4 w-4" fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor">
                                                                                <path stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    stroke-width="2"
                                                                                    d="M12 4l8 8-8 8M4 12h16">
                                                                                </path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div v-else-if="key === 'responsables'"
                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                • {{ prettyKey(key)['label'] }}: ({{ value.length }})
                                                                <div v-for="(responsable, index) in value" :key="index"
                                                                    class="flex justify-center items-center">
                                                                    <div
                                                                        class="flex flex-col justify-center items-center">
                                                                        <span class="ml-2">
                                                                            {{ responsable.nombre_completo }} -
                                                                            {{ responsable.tiempo_planeado }} hrs
                                                                        </span>
                                                                        <span>
                                                                            <VDropdown
                                                                                id="dropdown-fechas-no-disponibles"
                                                                                :triggers="['click']"
                                                                                :placement="'top'">
                                                                                <button :title="'Fechas No Disponibles'"
                                                                                    :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                                                                    <component
                                                                                        :is="iconsForm['IconCalendar']"
                                                                                        :class="['w-5 h-5', 'text-cyan-800']" />
                                                                                </button>
                                                                                <template #popper>
                                                                                    HERE
                                                                                    <!-- <div v-if="responsable.fechas_no_disponibles.length > 0"
                                                                                    class="p-4 bg-white dark:bg-gray-800">
                                                                                    <div v-for="(fecha, index_fecha) in responsable.fechas_no_disponibles"
                                                                                        :key="index_fecha"
                                                                                        class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                                                                        <div
                                                                                            class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                                                                            <span
                                                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                                                {{ fecha.type }} :
                                                                                                {{
                        formatPrettyDate(fecha.start)
                    }}
                                                                                                - {{
                            formatPrettyDate(fecha.end)
                        }}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div v-else
                                                                                    class="p-4 bg-white dark:bg-gray-800">
                                                                                    <div
                                                                                        class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                                                                        <span
                                                                                            class="text-sm font-semibold text-green-800">
                                                                                            100% Disponible.
                                                                                        </span>
                                                                                    </div>
                                                                                </div> -->
                                                                                </template>
                                                                            </VDropdown>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div v-else-if="key === 'duration'"
                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                • {{ prettyKey(key)['label'] }}:
                                                                {{ formatHours(value) }}
                                                            </div>

                                                            <div v-else-if="key === 'progress'"
                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                • {{ prettyKey(key)['label'] }}:
                                                                <div
                                                                    class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                                                                    <div
                                                                        class="relative h-6 flex items-center justify-center">
                                                                        <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                                                            :style="{ width: `${value}%` }"
                                                                            :class="getClassProgress(value)">
                                                                        </div>
                                                                        <div class="relative font-medium text-sm"
                                                                            :class="getClassProgressText(value)">
                                                                            {{ value }}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <span v-else
                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                • {{ prettyKey(key)['label'] }}: {{ value }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <!-- Botón aplicar cambios -->
                                                    <div class="flex justify-between">
                                                        <button @click="swapTaskToLeft(index_task)"
                                                            class="flex justify-center py-2 px-4 mt-4 bg-identity dark:bg-orange-900 text-black border border-solid border-black rounded-md font-medium transition-all hover:bg-identity-dark-gold ">
                                                            <div class="flex flex-row items-center"><svg
                                                                    xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                                                                    fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2"
                                                                        d="M20 12H4M12 20l-8-8 8-8M4 12h16">
                                                                    </path>
                                                                </svg>
                                                                <span>Swap</span>
                                                            </div>
                                                        </button>
                                                        <button @click="applyChangesOnTask(index_task)"
                                                            class="py-2 px-4 mt-4 bg-identity-dark dark:bg-gray-900 text-white rounded-md font-medium transition-all hover:bg-identity-dark-gold">
                                                            Aplicar Cambios
                                                        </button>
                                                        <button @click="swapTaskToRight(index_task)"
                                                            class="flex justify-center py-2 px-4 mt-4  bg-identity dark:bg-orange-900 text-black border-solid border-black rounded-md font-medium transition-all hover:bg-identity-dark-gold ">
                                                            <div class="flex flex-row items-center">
                                                                <span>Swap</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                                                                    fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2" d="M12 4l8 8-8 8M4 12h16">
                                                                    </path>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                        </VDropdown>
                                    </template>
                                    <template v-else-if="task[column.key]">
                                        {{ task[column.key] }}
                                    </template>
                                    <!-- <template v-else>
                                    -
                                </template> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- </vue-horizontal> -->
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import AppLoader from "@/components/loader/AppLoader.vue";
import { ref, computed, defineProps, onMounted, defineEmits, onBeforeMount } from 'vue';
import Modal from "@/components/helpers/Modal.vue";
import { useMomentStore } from "@/stores/moment";
import { watch } from 'vue';
import { nextTick } from 'vue';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { hideAllPoppers } from 'floating-vue'
import { useBusinessStore } from '@/stores/business';
import { useIconStore } from '@/stores/icons';

const { formatStoreMonthYear, formatStoreDate, parseStoreDate, compareDatesIsSame, compareDatesGreater, compareDatesLess, compareRangeDates, getDaysBetweenDates, formatPrettyDate, formatPrettyDateDayMonth, formatPrettyBusinessDateDayMonth, getTime, getMonthYear, isMonthBetweenMonths, getMonth, reduceDaysToDate, addDaysToDate } = useMomentStore();

const { formatHours, formatIntHours, getHorasEstimadasPorEtapa, parseStringToIntHours, getLaboralHoursPerDay } = useBusinessStore();

const formIconNames = ref(['IconPlus', 'IconCalendar', 'IconHistory', 'IconArrowDown', 'IconArrowUp', 'IconSave', 'IconGo']);
const { iconsForm, loadFormIcons } = useIconStore();

const isLoadingApp = ref(false);

onMounted(async () => {
    getWidthStickyColumn();
    await loadFormIcons(formIconNames.value)
    HOURS_PER_DAY.value = await getLaboralHoursPerDay();
    setInitDate();
});

onBeforeMount(async () => {
    await putNotAvailableDatesOnTasksResponsables();
});

const emit = defineEmits(['applyChanges', 'adjustTasks', 'openModal', 'closeModal']);

const columnWidth = ref([])

const getWidthStickyColumn = () => {
    for (let i = 0; i < props.stickyColumns; i++) {
        const column = document.getElementById(`head-column-${i}`);
        columnWidth.value[i] = column?.offsetWidth;
    }
};

const getLeftOffset = (index) => {
    return columnWidth.value.slice(0, index).reduce((acc, width) => acc + width, 0);
};

//Este método actua como syncronizador de fechas no disponibles entre las tareas y los responsables de la orden de trabajo.
const putNotAvailableDatesOnTasksResponsables = async () => {
    //Las tareas son de la orden de trabajo.
    for (const task of props.tasks) {
        for (const responsable of task.responsables) {
            //Responsables son de la orden de trabajo.
            const indexResponsableOnOrder = props.responsablesOnOrder.findIndex(responsableOnOrder => responsableOnOrder.id === responsable.id);

            if (indexResponsableOnOrder !== -1) {
                const responsableOnOrder = props.responsablesOnOrder[indexResponsableOnOrder];
                responsable.fechas_no_disponibles = responsableOnOrder.fechas_no_disponibles;
            }
        }
    }
}

const props = defineProps({
    columns: {
        type: Array,
        default: () => [
            { key: 'id', label: 'ID' },
            { key: 'task', label: 'Tarea' },
            { key: 'duration', label: 'Duración' },
            { key: 'progress', label: 'Progreso' },
            { key: 'actividades_antecesoras_ids', label: 'Actividades Antecesoras' },
            { key: 'go', label: 'Ir' },
        ],
    },
    tasks: {
        type: Array,
        required: true,
        default: () => [],
    },
    stickyColumns: {
        type: Number,
        default: 6,
    },
    responsablesOnOrder: {
        type: Array,
        default: () => [],
    },
    etapasOnOrder: {
        type: Array,
        default: () => [],
    },
    showGeneralInfoSuggestedPlanning: {
        type: Boolean,
        default: true,
    },
});


const taskSelected = ref(null);

const onDropdownShow = (task) => {
    taskSelected.value = { ...task };
    taskSelected.value.start = parseStoreDate(taskSelected.value.start);
    taskSelected.value.end = parseStoreDate(taskSelected.value.end);
    reducedStartDays.value = 0;
    reducedEndDays.value = 0;
    increasedStartDays.value = 0;
    increasedEndDays.value = 0;
}

const increasedStartDays = ref(0);
const increasedEndDays = ref(0);
const reducedStartDays = ref(0);
const reducedEndDays = ref(0);

const reduceDateOnTask = (key) => {
    taskSelected.value[key] = reduceDaysToDate(taskSelected.value[key], 1);
    taskSelected.value[key] = parseStoreDate(taskSelected.value[key]);
    if (key === 'start') {
        if (increasedStartDays.value > 0) {
            increasedStartDays.value--;
        } else {
            reducedStartDays.value++;
        }
    } else {
        if (increasedEndDays.value > 0) {
            increasedEndDays.value--;
        } else {
            reducedEndDays.value++;
        }
    }
}

const addDateOnTask = (key) => {
    taskSelected.value[key] = addDaysToDate(taskSelected.value[key], 1);
    taskSelected.value[key] = parseStoreDate(taskSelected.value[key]);
    if (key === 'start') {
        if (reducedStartDays.value > 0) {
            reducedStartDays.value--;
        } else {
            increasedStartDays.value++;
        }
    } else {
        if (reducedEndDays.value > 0) {
            reducedEndDays.value--;
        } else {
            increasedEndDays.value++;
        }
    }
}

const datesDisabled = (date) => {
    if (!date) return false; // Asegurarse de que la fecha esté definida

    // Deshabilitar sábados y domingos
    const saturday = 6;
    const sunday = 0;
    if (date.getDay() === saturday || date.getDay() === sunday) return true;
}


const getBorderClass = (columnKey, taskStart, taskEnd) => {
    return {
        'border': columnKey === taskStart && columnKey === taskEnd,
        'border-l': columnKey === taskStart && columnKey !== taskEnd,
        'border-r': columnKey === taskEnd && columnKey !== taskStart
    }
}

const getClassProgress = (value) => {
    return {
        'bg-green-200': value < 105,
        'bg-orange-200': value > 105 && value < 120,
        'bg-red-200': value > 120
    }
}

const getClassProgressText = (value) => {
    return {
        'text-green-800': value < 105,
        'text-orange-800': value > 105 && value < 120,
        'text-red-800': value > 120
    }
}

const showFormAddTask = (date, index) => {
    emit('openModal', {
        start: date,
        index: index,
    });
}

const saturday = 6, sunday = 0;

const canAddTask = (date) => {
    const startDate = props.tasks[0].start;
    const endDate = props.tasks[props.tasks.length - 1].end;

    const currentDate = parseStoreDate(date);

    if (isNaN(currentDate.getTime())) {
        return false;
    }

    if (currentDate.getDay() === saturday || currentDate.getDay() === sunday) {
        return false;
    }

    if (currentDate < parseStoreDate(startDate) || currentDate > parseStoreDate(endDate)) {
        return false;
    }

    //Si no hay ninguna tarea en la fecha seleccionada, dentro del rango de fechas de las tareas actuales, se puede agregar la tarea.
    for (const tarea of props.tasks) {
        if (compareRangeDates(date, tarea.start, tarea.end)) {
            return false;
        }
    }

    return true;
}

// Estado
const currentView = ref('semester'); // Opciones: 'week', 'month', 'three-months', 'year'

const viewOptions = [
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
    { label: 'Tres Meses', value: 'three-months' },
    { label: 'Semestre', value: 'semester' },
    // { label: 'Año', value: 'year' },
];

// Etiquetas de Tiempo (Header)
const initDate = ref(null);

//Set from the start property of the frist task from props.tasks
const setInitDate = () => {
    if (props.tasks.length > 0) {
        initDate.value = parseStoreDate(props.tasks[0].start);
    } else {
        initDate.value = new Date();
    }

    console.log('initDate', initDate.value);
};

// const weekLabels = computed(() => {
//     return Array.from({ length: 5 }, (_, i) => { // 5 días (lunes a viernes)
//         const date = new Date(initDate.value);
//         date.setDate(date.getDate() - date.getDay() + 1 + i); // Comienza desde lunes (1) y agrega el día i (hasta viernes)
//         return date;
//     })
// });

const weekLabels = computed(() => {
    if (!initDate.value) return [];

    const startOfWeek = new Date(initDate.value);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Comienza desde lunes

    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i); // Agrega el día i (hasta viernes)
        return date;
    });
});

// const monthLabels = computed(() => {
//     return Array.from({ length: 31 }, (_, i) => {
//         const date = new Date(initDate.value);
//         date.setDate(i + 1); // Primer día del mes actual
//         return date;
//     })
// });

const monthLabels = computed(() => {
    if (!initDate.value) return [];

    const startOfMonth = new Date(initDate.value);
    // startOfMonth.setDate(1); // Primer día del mes actual

    return Array.from({ length: 31 }, (_, i) => {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() + i); // Agrega i días
        return date;
    });
});

// const threeMonthsLabels = computed(() => {
//     return Array.from({ length: 90 }, (_, i) => {
//         const date = new Date(initDate.value);
//         date.setMonth(date.getMonth() - 1);

//         date.setDate(i + 1); // Día en el trimestre
//         return date;
//     })
// });

const threeMonthsLabels = computed(() => {
    if (!initDate.value) return [];

    const startOfThreeMonths = new Date(initDate.value);
    // startOfThreeMonths.setMonth(startOfThreeMonths.getMonth() - 1); // Comienza desde un mes atrás

    return Array.from({ length: 90 }, (_, i) => {
        const date = new Date(startOfThreeMonths);
        date.setDate(date.getDate() + i); // Agrega i días
        return date;
    });
});

// const semesterLabels = computed(() => {
//     return Array.from({ length: 180 }, (_, i) => {
//         const date = new Date();
//         date.setMonth(date.getMonth() - 1);

//         date.setDate(i + 1); // Día en el semestre

//         console.log('semesterLabels date', date);
//         return date;
//     })
// });


const semesterLabels = computed(() => {
    if (!initDate.value) return [];

    return Array.from({ length: 180 }, (_, i) => {
        const date = new Date(initDate.value); // Start from initDate
        date.setDate(date.getDate() + i); // Add i days

        return date;
    });
});


// const yearLabels = computed(() => {
//     return Array.from({ length: 12 }, (_, i) => {
//         const date = new Date(new Date().getFullYear(), i, 1); // Set the date to the first day of the month
//         return date; // Format the date
//     })
// });

const yearLabels = computed(() => {
    if (!initDate.value) return [];

    const startYear = new Date(initDate.value);
    startYear.setMonth(0); // Primer mes del año (enero)

    return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(startYear);
        date.setMonth(i); // Establece el mes
        return date; // Retorna la fecha formateada
    });
});

// Computed para ajustar etiquetas según la vista
// const timeLabels = ref([]);

const timeLabels = computed(() => {
    switch (currentView.value) {
        case 'week': return weekLabels.value
        case 'month': return monthLabels.value
        case 'three-months': return threeMonthsLabels.value
        case 'semester': return semesterLabels.value
        case 'year': return yearLabels.value
        default: return weekLabels.value
    }
})

// 4) whenever timeLabels changes we re‑measure your sticky column
watch(timeLabels, () => {
    // Espera un tick para que Vue actualice el DOM…
    nextTick(() => {
        getWidthStickyColumn()
    })
}, { immediate: true })


// watch(currentView, (newValue) => {
//     if (newValue) {
//         switch (newValue) {
//             case 'week':
//                 timeLabels.value = weekLabels;
//                 break;
//             case 'month':
//                 timeLabels.value = monthLabels;
//                 break;
//             case 'three-months':
//                 timeLabels.value = threeMonthsLabels;
//                 break;
//             case 'semester':
//                 timeLabels.value = semesterLabels;
//                 break;
//             case 'year':
//                 timeLabels.value = yearLabels;
//                 break;
//             default:
//                 timeLabels.value = weekLabels;
//         }
//         nextTick(() => {
//             getWidthStickyColumn();
//         });
//     }

// }, {
//     immediate: true,
// })
const filterColumns = () => {
    return [
        ...props.columns,
        ...timeLabels.value.map(time => ({
            key: formatStoreDate(time),
            label: currentView.value !== 'year'
                ? formatPrettyDate(time)
                : getMonthYear(time),
        }))
    ]
}
// const filterColumns = () => {
//     const mergedColumns = [...props.columns, ...timeLabels.value.map(time => {
//         return {
//             // key: currentView.value !== 'year' ? formatStoreDate(time) : formatStoreMonthYear(time), //2024-12-30
//             key: formatStoreDate(time),
//             label: currentView.value !== 'year' ? formatPrettyDate(time) : getMonthYear(time), //Dic 30° 2024
//         };
//     })];
//     return mergedColumns;
// };

// const precomputedColumns = filterColumns().map((column, index_column) => {
//     const columnKey = column.key;
//     const columnDate = parseStoreDate(columnKey);
//     const isStickyColumn = index_column < props.stickyColumns;
//     const isWeekend = columnDate.getDay() === 6 || columnDate.getDay() === 0;

//     return {
//         isStickyColumn,
//         isWeekend,
//     };
// });

// <-- filterColumns() is your function that returns the newest mergedColumns array
const precomputedColumns = computed(() => {
    return filterColumns().map((column, idx) => {
        const columnDate = parseStoreDate(column.key)
        const isStickyColumn = idx < props.stickyColumns
        const isWeekend = [0, 6].includes(columnDate.getDay())

        return { isStickyColumn, isWeekend }
    })
})

const getBackgroundColumnClass = (index, task) => {
    // grab the latest column-info (or {} if index is invalid)
    const { isStickyColumn = false, isWeekend = false } =
        precomputedColumns.value[index] || {}

    const area = task.area_responsable

    return {
        'sticky-column px-2': isStickyColumn,
        'bg-orange-200': area === 'INGENIERIA' && isStickyColumn,
        'bg-gray-200': area === 'DIBUJO' && isStickyColumn,
        'bg-indigo-200': area === 'OTRO' && isStickyColumn,
        'bg-yellow-200': isWeekend,
    }
}

// const getBackgroundColumnClass = (index_column, task) => {
//     const { isStickyColumn, isWeekend } = precomputedColumns[index_column];
//     const areaResponsable = task.area_responsable;

//     return {
//         'sticky-column px-2': isStickyColumn,
//         'bg-orange-200': areaResponsable === 'INGENIERIA' && isStickyColumn,
//         'bg-gray-200': areaResponsable === 'DIBUJO' && isStickyColumn,
//         'bg-indigo-200': areaResponsable === 'OTRO' && isStickyColumn,
//         'bg-yellow-200': isWeekend,
//     };
// };


// Métodos para las barras
const isInMonthRange = (start, end, key) => {
    if (start === null || end === null) return false;

    const monthStart = getMonthYear(start)
    const monthEnd = getMonthYear(end)
    const monthKey = getMonthYear(key)
    return monthStart === monthKey || monthEnd === monthKey || isMonthBetweenMonths(monthKey, monthStart, monthEnd);
};

const isInMonthRangeClass = (start, end, key) => {
    if (start === null || end === null) return '';

    const monthStart = getMonthYear(start)
    const monthEnd = getMonthYear(end)
    const monthKey = getMonthYear(key)
    return {
        'rounded-l-lg': monthStart === monthKey,
        'rounded-r-lg': monthEnd === monthKey,
        '': isMonthBetweenMonths(monthKey, monthStart, monthEnd),
        // 'rounded-lg': !isMonthBetweenMonths(monthKey, monthStart, monthEnd) && currentView.value !== 'year'
    }
};

const roundedBarClass = (task, column) => {
    return {
        'rounded-lg': task.start === task.end,
        'rounded-l-lg': column.key === task.start && task.start !== task.end,
        'rounded-r-lg': column.key === task.end && task.start !== task.end
    };
};

const getBackgroundTaskClass = (task, column) => {
    const columnKey = column.key;
    const currentDate = parseStoreDate(columnKey);

    // const dateNotAvailable = isNotDateAvailable(task.responsables, currentDate, task.no_available_days);
    const dateNotAvailable = false

    return {
        'bg-orange-500': task.area_responsable === 'INGENIERIA' && currentView.value !== 'year',
        'bg-gray-500': task.area_responsable === 'DIBUJO' && currentView.value !== 'year',
        'bg-cyan-500': task.area_responsable === 'OTRO' && currentView.value !== 'year',
        'bg-red-500': dateNotAvailable && currentDate.getDay() !== saturday && currentDate.getDay() !== sunday,
    }
};

// const isNotDateAvailable = (responsables, currentDate, no_available_days) => {
//     const isNotDayAvailable = isNotAvailableDay(no_available_days, currentDate);
//     return responsables.some(responsable => {
//         return responsable.fechas_no_disponibles.some(rango => {
//             const startDate = parseStoreDate(rango.start);
//             const endDate = parseStoreDate(rango.end);
//             // Verificar si la fecha actual está dentro del rango no disponible.
//             return currentDate >= startDate && currentDate <= endDate && !isNotDayAvailable;
//         });
//     });
// };

const isNotWorkingDay = (no_working_days, column) => {
    const columnDate = parseStoreDate(column.key);

    const isNotWorkingDay = no_working_days.some(date => {
        return compareDatesIsSame(parseStoreDate(date), columnDate) && columnDate.getDay() !== saturday && columnDate.getDay() !== sunday;
    });

    return isNotWorkingDay;
};

const noWorkingDaysClass = (task, column) => {
    const isNotWorkDay = isNotWorkingDay(task.no_working_days, column);
    return {
        'bg-red-200': isNotWorkDay,
    };
};

const isNotAvailableDay = (no_available_days, date) => {
    const columnDate = parseStoreDate(date);
    const isNotAvailableDay = no_available_days.some(date => {
        return compareDatesIsSame(parseStoreDate(date), columnDate) && columnDate.getDay() !== saturday && columnDate.getDay() !== sunday;
    });
    return isNotAvailableDay;
};
//Las tasks no_available_days son las fechas que no están disponibles y que el algoritmo TOMÓ EN CUENTA.
const noAvailableDaysClass = (task, date) => {
    const isNotDayAvailable = isNotAvailableDay(task.no_available_days, date);
    return {
        'bg-cyan-200': isNotDayAvailable,
    };
};


// Título de la Vista
const viewTitle = computed(() => {
    switch (currentView.value) {
        case 'week':
            return 'Vista Semanal';
        case 'month':
            return 'Vista Mensual';
        case 'three-months':
            return 'Vista Trimestral';
        case 'semester':
            return 'Vista Semestral';
        case 'year':
            return 'Vista Anual';
    }
});

const isGanttLoading = ref(false);

// Métodos
const changeView = (view) => {
    isGanttLoading.value = true;
    currentView.value = view;
    nextTick(() => {
        setTimeout(() => {
            isGanttLoading.value = false;
        }, 500);
    });
};

const prettyTaskKey = ref({
    id: {
        label: 'ID',
        show: true,
    },
    task: {
        label: 'Tarea',
        show: true,
    },
    start: {
        label: 'Inicio',
        show: true,
    },
    end: {
        label: 'Fin',
        show: true,
    },
    duration: {
        label: 'Duración',
        show: true,
    },
    progress: {
        label: 'Progreso',
        show: true,
    },
    area_responsable: {
        label: 'Área Responsable',
        show: true,
    },
    responsables: {
        label: 'Responsables',
        show: true,
    },
    type: {
        label: 'Tipo',
        show: true,
    },
    orden_id: {
        label: 'Orden ID',
        show: true,
    },
    belongs_to_etapa: {
        label: 'Etapa ID',
        show: true,
    },
    actividades_antecesoras_ids: {
        label: 'Actividades Antecesoras',
        show: true,
    },
});

const prettyKey = (key) => {
    return prettyTaskKey.value[key] ?? { label: '', show: false };
}

const swapTaskToLeft = (index) => {
    hideAllPoppers();
    Swal.fire({
        title: '¿Estás seguro de mover esta tarea hacia la izquierda?',
        showDenyButton: true,
        confirmButtonText: `Sí, mover`,
        confirmButtonColor: '#EC7522',
        denyButtonText: `No, cancelar`,
        denyButtonColor: '#B2B2B2',
    }).then((result) => {
        if (result.isConfirmed) {
            if (index === 0) return;

            // Intercambiar las tareas
            const task = props.tasks[index];
            props.tasks[index] = props.tasks[index - 1];
            props.tasks[index - 1] = task;

            // Intercambiar las fechas de las tareas
            const keys = ['start', 'end'];
            keys.forEach(key => {
                const tempDate = props.tasks[index][key];
                props.tasks[index][key] = props.tasks[index - 1][key];
                props.tasks[index - 1][key] = tempDate;
            });
        }
    })
}

const swapTaskToRight = (index) => {
    hideAllPoppers();
    Swal.fire({
        title: '¿Estás seguro de mover esta tarea hacia la derecha?',
        showDenyButton: true,
        confirmButtonText: `Sí, mover`,
        confirmButtonColor: '#EC7522',
        denyButtonText: `No, cancelar`,
        denyButtonColor: '#B2B2B2',
    }).then((result) => {
        if (result.isConfirmed) {
            if (index === props.tasks.length - 1) return;

            // Intercambiar las tareas
            const task = props.tasks[index];
            props.tasks[index] = props.tasks[index + 1];
            props.tasks[index + 1] = task;

            // Intercambiar las fechas de las tareas
            const keys = ['start', 'end'];
            keys.forEach(key => {
                const tempDate = props.tasks[index][key];
                props.tasks[index][key] = props.tasks[index + 1][key];
                props.tasks[index + 1][key] = tempDate;
            });
        }
    })
}

const changeStartDate = () => {
    //Cambiar fecha 
    console.log('changeStartDate');
}

const applyChangesOnTask = (index) => {
    if (validateStartEndDates()) {
        hideAllPoppers();
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha de fin no puede ser menor a la fecha de inicio',
        })
    }
    const originalStartTask = parseStoreDate(props.tasks[index].start);
    const originalEndTask = parseStoreDate(props.tasks[index].end);

    const taskSelectedStart = parseStoreDate(taskSelected.value.start);
    const taskSelectedEnd = parseStoreDate(taskSelected.value.end);

    if (taskSelectedStart.getDay() === saturday || taskSelectedStart.getDay() === sunday || taskSelectedEnd.getDay() === saturday || taskSelectedEnd.getDay() === sunday) {
        hideAllPoppers();
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pueden seleccionar fechas en sábado o domingo',
        })
    }

    if (compareDatesLess(taskSelectedStart, originalStartTask) && compareDatesIsSame(taskSelectedEnd, originalEndTask)) {
        console.log('solo se modifico la fecha de inicio hacia atras ', reducedStartDays.value + ' días');
        //Preguntar si desea mover en bloque hacia atrás
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia atrás ' + reducedStartDays.value + ' días?',
            showDenyButton: true,
            confirmButtonText: `Mover las tareas en bloque hacia atrás ${reducedStartDays.value} días`,
            confirmButtonColor: '#EC7522',
            denyButtonText: `No, sólo la fecha hacia atrás ${reducedStartDays.value} días`,
            denyButtonColor: '#B2B2B2',
        }).then(async (result) => {
            // const currentTask = props.tasks[index];
            // const newTask = taskSelected.value;
            // const newDuration = await adjustDurationOnTask(currentTask, newTask);

            if (result.isConfirmed) {
                reducirTodasLasFechasEnTareaActual(index, reducedStartDays.value, 0);
                nextTick(() => {
                    verificarYCorregirHuecosHaciaAtras(index);
                });
            } else if (result.isDenied) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
            }

            // props.tasks[index].duration = newDuration;
            ajustarSabadosYDomingos();

            nextTick(() => {
                adjustDurationOnTask(index);
                ajustarSabadosYDomingos();
            });
        })

    } else if (compareDatesIsSame(taskSelectedStart, originalStartTask) && compareDatesGreater(taskSelectedEnd, originalEndTask)) {
        console.log('solo se modifico la fecha de fin hacia adelante ', increasedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia adelante ' + increasedEndDays.value + ' días?',
            showDenyButton: true,
            confirmButtonText: `Mover las tareas en bloque hacia adelante ${increasedEndDays.value} días`,
            confirmButtonColor: '#EC7522',
            denyButtonText: `No, sólo la fecha hacia adelante ${increasedEndDays.value} días`,
            denyButtonColor: '#B2B2B2',
        }).then(async (result) => {
            // const currentTask = props.tasks[index];
            // const newTask = taskSelected.value;
            // const newDuration = await adjustDurationOnTask(currentTask, newTask);

            if (result.isConfirmed) {
                incrementarTodasLasFechasEnTareaActual(index, 0, increasedEndDays.value);
                nextTick(() => {
                    verificarYCorregirHuecosHaciaAdelante(index);
                });
            } else if (result.isDenied) {
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }

            // props.tasks[index].duration = newDuration;
            ajustarSabadosYDomingos();

            nextTick(() => {
                adjustDurationOnTask(index);
                ajustarSabadosYDomingos();
            });
        })

    } else if (compareDatesIsSame(taskSelectedStart, originalStartTask) && compareDatesLess(taskSelectedEnd, originalEndTask)) {
        console.log('solo se modifico la fecha de fin hacia atras ', reducedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia atrás ' + reducedEndDays.value + ' días?',
            showDenyButton: false,
            confirmButtonText: `Mover la fecha de fin hacia atrás ${reducedEndDays.value} días`,
            confirmButtonColor: '#EC7522',
        }).then((result) => {
            if (result.isConfirmed) {
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }
        })

    } else if (compareDatesGreater(taskSelectedStart, originalStartTask) && compareDatesIsSame(taskSelectedEnd, originalEndTask)) {
        console.log('solo se modificó la fecha de inicio hacia adelante ', increasedStartDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia adelante ' + increasedStartDays.value + ' días?',
            showDenyButton: false,
            confirmButtonText: `Mover la fecha de inicio hacia adelante ${increasedStartDays.value} días`,
            confirmButtonColor: '#EC7522',
        }).then((result) => {
            if (result.isConfirmed) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
            }
        })
    } else if (compareDatesLess(taskSelectedStart, originalStartTask) && compareDatesLess(taskSelectedEnd, originalEndTask)) {
        console.log('se modifico la fecha de inicio hacia atras ' + reducedStartDays.value + ' días' + ' y la fecha de fin hacia atras ', reducedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia atrás ' + reducedStartDays.value + ' días?',
            showDenyButton: true,
            confirmButtonText: `Mover las tareas en bloque hacia atrás ${reducedStartDays.value} días`,
            confirmButtonColor: '#EC7522',
            denyButtonText: `No, sólo la fecha hacia atrás ${reducedStartDays.value} días`,
            denyButtonColor: '#B2B2B2',
        }).then(async (result) => {
            // const currentTask = props.tasks[index];
            // const newTask = taskSelected.value;
            // const newDuration = await adjustDurationOnTask(currentTask, newTask);


            if (result.isConfirmed) {
                reducirTodasLasFechasEnTareaActual(index, reducedStartDays.value, reducedEndDays.value);
                nextTick(() => {
                    verificarYCorregirHuecosHaciaAtras(index);
                });
            } else if (result.isDenied) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }

            // props.tasks[index].duration = newDuration;
            ajustarSabadosYDomingos();

            nextTick(() => {
                adjustDurationOnTask(index);
                ajustarSabadosYDomingos();
            });
        })

    } else if (compareDatesGreater(taskSelectedStart, originalStartTask) && compareDatesGreater(taskSelectedEnd, originalEndTask)) {
        console.log('se modifico la fecha de inicio hacia adelante ' + increasedStartDays.value + ' días' + ' y la fecha de fin hacia adelante ', increasedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia adelante ' + increasedStartDays.value + ' días?',
            showDenyButton: true,
            confirmButtonText: `Mover las tareas en bloque hacia adelante ${increasedStartDays.value} días`,
            confirmButtonColor: '#EC7522',
            denyButtonText: `No, sólo la fecha hacia adelante ${increasedStartDays.value} días`,
            denyButtonColor: '#B2B2B2',
        }).then(async (result) => {
            // const currentTask = props.tasks[index];
            // const newTask = taskSelected.value;
            // const newDuration = await adjustDurationOnTask(currentTask, newTask);

            if (result.isConfirmed) {
                incrementarTodasLasFechasEnTareaActual(index, increasedStartDays.value, increasedEndDays.value);
                nextTick(() => {
                    verificarYCorregirHuecosHaciaAdelante(index);
                });
            } else if (result.isDenied) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }

            // props.tasks[index].duration = newDuration;
            ajustarSabadosYDomingos();

            nextTick(() => {
                adjustDurationOnTask(index);
                ajustarSabadosYDomingos();
            });
        })
    } else if (compareDatesLess(taskSelectedStart, originalStartTask) && compareDatesGreater(taskSelectedEnd, originalEndTask)) {
        console.log('se modifico la fecha de inicio hacia atrás ' + reducedStartDays.value + ' días' + ' y la fecha de fin hacia adelante ', increasedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia atrás ' + reducedStartDays.value + ' días y adelante ' + increasedEndDays.value + ' días?',
            showDenyButton: true,
            confirmButtonText: `Mover las tareas en bloque hacia atrás ${reducedStartDays.value} días y adelante ${increasedEndDays.value} días`,
            confirmButtonColor: '#EC7522',
            denyButtonText: `No, sólo la fecha hacia atrás ${reducedStartDays.value} días y adelante ${increasedEndDays.value} días`,
            denyButtonColor: '#B2B2B2',
        }).then(async (result) => {
            // const currentTask = props.tasks[index];
            // const newTask = taskSelected.value;
            // const newDuration = await adjustDurationOnTask(currentTask, newTask);

            if (result.isConfirmed) {
                reducirTodasLasFechasEnTareaActual(index, reducedStartDays.value, 0);
                incrementarTodasLasFechasEnTareaActual(index, 0, increasedEndDays.value);

                nextTick(() => {
                    verificarYCorregirHuecosHaciaAtras(index);
                    verificarYCorregirHuecosHaciaAdelante(index);
                });

            } else if (result.isDenied) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }

            // props.tasks[index].duration = newDuration;
            ajustarSabadosYDomingos();

            nextTick(() => {
                adjustDurationOnTask(index);
                ajustarSabadosYDomingos();
            });
        })
    } else if (compareDatesGreater(taskSelectedStart, originalStartTask) && compareDatesLess(taskSelectedEnd, originalEndTask)) {
        console.log('se modificó la fecha de inicio hacia adelante ' + increasedStartDays.value + ' días' + ' y la fecha de fin hacia atrás ', reducedEndDays.value + ' días');
        hideAllPoppers();
        Swal.fire({
            title: '¿Cómo desea mover esta tarea hacia adelante ' + increasedStartDays.value + ' días y hacia atrás ' + reducedEndDays.value + ' días?',
            showDenyButton: false,
            confirmButtonText: `Mover la fecha de inicio hacia adelante ${increasedStartDays.value} días y la fecha de fin hacia atrás ${reducedEndDays.value} días`,
            confirmButtonColor: '#EC7522',
        }).then((result) => {
            if (result.isConfirmed) {
                props.tasks[index].start = formatStoreDate(taskSelected.value.start);
                props.tasks[index].end = formatStoreDate(taskSelected.value.end);
            }
        })
    } else {
        console.log('no se modifico ninguna fecha');
    }
}

const incrementarTodasLasFechasEnTareaActual = (index, startDays, endDays) => {
    const currentTask = props.tasks[index];
    // Guardar las fechas originales de la tarea actual
    const originalStartDate = parseStoreDate(currentTask['start']);
    const originalEndDate = parseStoreDate(currentTask['end']);

    // Incrementar las fechas de inicio y fin según los días especificados
    currentTask['start'] = formatStoreDate(addDaysToDate(originalStartDate, startDays));
    currentTask['end'] = formatStoreDate(addDaysToDate(originalEndDate, endDays));

    // Calcular la diferencia entre la fecha original de fin y la nueva fecha de fin
    const newEndDateCurrentTask = parseStoreDate(currentTask['end']);
    const diffDays = getDaysBetweenDates(originalEndDate, newEndDateCurrentTask);

    // Ajustar las fechas de las tareas siguientes
    ajustarTodasLasFechasEnBloqueHaciaAdelante(index, diffDays);
};

const ajustarTodasLasFechasEnBloqueHaciaAdelante = (index, diffDays) => {
    const currentTask = props.tasks[index];
    let endDateCurrentTask = parseStoreDate(currentTask['end']); // Fecha de fin actualizada
    // Ajustar todas las tareas posteriores al índice `index`
    for (let i = index + 1; i < props.tasks.length; i++) {
        const task = props.tasks[i];

        // Calcular la fecha original de inicio y fin
        const originalStartDate = parseStoreDate(task['start']);
        const originalEndDate = parseStoreDate(task['end']);

        // Calcular duración original y brecha con respecto a la tarea actual
        const originalDuration = getDaysBetweenDates(originalStartDate, originalEndDate);
        const gapWithPreviousTask = getDaysBetweenDates(endDateCurrentTask, originalStartDate);

        // Calcular nueva fecha de inicio manteniendo la brecha
        const newStartDate = addDaysToDate(endDateCurrentTask, gapWithPreviousTask + diffDays);
        const newEndDate = addDaysToDate(newStartDate, originalDuration);

        // Actualizar las fechas en la tarea
        task['start'] = formatStoreDate(newStartDate);
        task['end'] = formatStoreDate(newEndDate);

        // Actualizar end date para el siguiente ciclo
        endDateCurrentTask = newEndDate; // Actualiza para la próxima iteración
    }
};

const reducirTodasLasFechasEnTareaActual = (index, startDays, endDays) => {
    const currentTask = props.tasks[index];

    // Guardar las fechas originales de la tarea actual
    const originalStartDate = parseStoreDate(currentTask['start']);
    const originalEndDate = parseStoreDate(currentTask['end']);

    // Reducir las fechas de inicio y fin según los días especificados
    currentTask['start'] = formatStoreDate(reduceDaysToDate(originalStartDate, startDays));
    currentTask['end'] = formatStoreDate(reduceDaysToDate(originalEndDate, endDays));

    // Calcular la diferencia entre la fecha original de inicio y la nueva fecha de inicio
    const newStartDateCurrentTask = parseStoreDate(currentTask['start']);
    const diffDays = getDaysBetweenDates(newStartDateCurrentTask, originalStartDate);

    // Ajustar las fechas de las tareas anteriores
    ajustarTodasLasFechasEnBloqueHaciaAtras(index, diffDays);
};

const ajustarTodasLasFechasEnBloqueHaciaAtras = (index, diffDays) => {
    let currentStartDate = parseStoreDate(props.tasks[index]['start']); // Fecha de inicio actualizada para la tarea actual

    // Ajustar todas las tareas anteriores al índice `index`
    for (let i = index - 1; i >= 0; i--) {
        const task = props.tasks[i];

        // Fechas originales de la tarea anterior
        const originalStartDate = parseStoreDate(task['start']);
        const originalEndDate = parseStoreDate(task['end']);

        // Calcular duración original
        const originalDuration = getDaysBetweenDates(originalStartDate, originalEndDate);

        // Calcular el nuevo gap con respecto a la tarea siguiente
        const gapWithNextTask = getDaysBetweenDates(originalEndDate, currentStartDate);

        // Calcular nueva fecha de fin manteniendo el gap con respecto a la siguiente tarea
        const newEndDate = reduceDaysToDate(currentStartDate, gapWithNextTask + diffDays);

        // Calcular nueva fecha de inicio manteniendo la duración original
        const newStartDate = reduceDaysToDate(newEndDate, originalDuration);

        // Actualizar las fechas en la tarea
        task['start'] = formatStoreDate(newStartDate);
        task['end'] = formatStoreDate(newEndDate);

        // Actualizar currentStartDate para el siguiente ciclo
        currentStartDate = newStartDate; // Actualiza para la próxima iteración
    }
}

const verificarYCorregirHuecosHaciaAdelante = (index) => {
    for (let i = index; i < props.tasks.length - 1; i++) {
        const currentTask = props.tasks[i];
        const nextTask = props.tasks[i + 1];

        const currentEndDate = parseStoreDate(currentTask['end']);
        const nextStartDate = parseStoreDate(nextTask['start']);
        const diffDays = getDaysBetweenDates(currentEndDate, nextStartDate) - 1;

        if (diffDays > 0) {
            nextTask['start'] = formatStoreDate(reduceDaysToDate(parseStoreDate(nextTask['start']), diffDays));
            nextTask['end'] = formatStoreDate(reduceDaysToDate(parseStoreDate(nextTask['end']), diffDays));
        }
    }
}

const verificarYCorregirHuecosHaciaAtras = (index) => {
    for (let i = index; i > 0; i--) {
        const currentTask = props.tasks[i];
        const previousTask = props.tasks[i - 1];

        const currentStartDate = parseStoreDate(currentTask['start']);
        const previousEndDate = parseStoreDate(previousTask['end']);
        const diffDays = getDaysBetweenDates(previousEndDate, currentStartDate) - 1;

        if (diffDays > 0) {
            previousTask['end'] = formatStoreDate(addDaysToDate(parseStoreDate(previousTask['end']), diffDays));
            previousTask['start'] = formatStoreDate(addDaysToDate(parseStoreDate(previousTask['start']), diffDays));
        }
    }
}

const ajustarSabadosYDomingos = () => {
    // console.log('ajustarSabadosYDomingos');
    // console.log('reducedStartDays.value', reducedStartDays.value);
    // console.log('increasedStartDays.value', increasedStartDays.value);
    // console.log('------');
    // console.log('reducedEndDays.value', reducedEndDays.value);
    // console.log('increasedEndDays.value', increasedEndDays.value);

    for (let i = 0; i < props.tasks.length; i++) {
        const task = props.tasks[i];
        let startDate = parseStoreDate(task['start']);
        let endDate = parseStoreDate(task['end']);

        // Ajuste de fecha de inicio
        if (reducedStartDays.value > 0) {
            // Ajustar hacia atrás si fue reducida
            while (startDate.getDay() === 6 || startDate.getDay() === 0) {
                startDate = reduceDaysToDate(startDate, 1);
            }
            while (endDate.getDay() === 6 || endDate.getDay() === 0) {
                endDate = reduceDaysToDate(endDate, 1);
            }
        } else if (increasedStartDays.value > 0) {
            // Ajustar hacia adelante si fue incrementada
            while (startDate.getDay() === 6 || startDate.getDay() === 0) {
                startDate = addDaysToDate(startDate, 1);
            }
            while (endDate.getDay() === 6 || endDate.getDay() === 0) {
                endDate = addDaysToDate(endDate, 1);
            }
        }

        // Ajuste de fecha final
        if (reducedEndDays.value > 0) {
            while (endDate.getDay() === 6 || endDate.getDay() === 0) {
                endDate = reduceDaysToDate(endDate, 1);
            }
            while (startDate.getDay() === 6 || startDate.getDay() === 0) {
                startDate = reduceDaysToDate(startDate, 1);
            }
        } else if (increasedEndDays.value > 0) {
            while (endDate.getDay() === 6 || endDate.getDay() === 0) {
                endDate = addDaysToDate(endDate, 1);
            }
            while (startDate.getDay() === 6 || startDate.getDay() === 0) {
                startDate = addDaysToDate(startDate, 1);
            }
        }

        // Actualizar fechas manteniendo la duración
        task['start'] = formatStoreDate(startDate);
        task['end'] = formatStoreDate(endDate);
    }
};

const HOURS_PER_DAY = ref(null);

const adjustDurationOnTask = (index) => {
    let totalDuration = 0; // Usar let para permitir cambios

    const startDate = parseStoreDate(props.tasks[index].start);
    const endDate = parseStoreDate(props.tasks[index].end);

    // Recorre cada día entre el inicio y el fin de la tarea
    while (startDate <= endDate) {

        if (startDate.getDay() !== saturday && startDate.getDay() !== sunday) {
            // Suma las horas laborables del día actual a la duración total
            const duration = HOURS_PER_DAY.value[startDate.getDay()] || 0;
            totalDuration += duration;

        } else {
            console.log('Fecha', startDate);
            console.log('Total Duration', totalDuration);
        }

        // Avanza al día siguiente
        startDate.setDate(startDate.getDate() + 1);
    }

    // Actualiza la duración de la tarea en la prop
    props.tasks[index].duration = formatIntHours(totalDuration);
};

// const adjustDurationOnTask = async (currentTask, newTask) => {
//     console.log('Adjusting Duration');

//     const originalDuration = parseFloat(currentTask.duration) || 0;

//     // Parseamos fechas originales y nuevas
//     const originalStart = parseStoreDate(currentTask.start);
//     const originalEnd = parseStoreDate(currentTask.end);

//     const newStart = parseStoreDate(newTask.start);
//     const newEnd = parseStoreDate(newTask.end);

//     console.log('Original Dates', originalStart, originalEnd);
//     console.log('New Dates', newStart, newEnd);

//     // Helper para calcular horas entre dos fechas
//     const getWorkHours = (start, end) => {
//         let hours = 0;
//         const current = new Date(start);
//         const last = new Date(end);

//         while (current <= last) {
//             const day = current.getDay();
//             if (day !== saturday && day !== sunday) {
//                 hours += HOURS_PER_DAY.value[day] || 0;
//             }
//             current.setDate(current.getDate() + 1);
//         }
//         console.log('----------??-----------');

//         console.log('Hours', hours);
//         return hours;
//     };

//     // Calculamos delta basado en los cambios
//     let delta = 0;

//     // 1. Días agregados/reducidos al INICIO
//     if (newStart < originalStart) {
//         console.log('Se extendió hacia atrás');
//         // Se extendió hacia atrás: sumar horas entre [newStart, originalStart - 1]
//         delta += getWorkHours(newStart, originalStart - 1);
//     } else if (newStart > originalStart) {
//         console.log('Se redujo desde el inicio');
//         // Se redujo desde el inicio: restar horas entre [originalStart, newStart - 1]
//         delta -= getWorkHours(originalStart, newStart - 1);
//     }

//     // 2. Días agregados/reducidos al FINAL
//     if (newEnd > originalEnd) {
//         console.log('Se extendió hacia adelante');
//         // Se extendió hacia adelante: sumar horas entre [originalEnd + 1, newEnd]
//         delta += getWorkHours(originalEnd + 1, newEnd);
//     } else if (newEnd < originalEnd) {
//         console.log('Se redujo desde el final');
//         // Se redujo desde el final: restar horas entre [newEnd + 1, originalEnd]
//         delta -= getWorkHours(newEnd + 1, originalEnd);
//     }

//     console.log('New Duration', originalDuration + delta);
//     return originalDuration + delta;
// };

const validateStartEndDates = () => {
    if (compareDatesGreater(taskSelected.value.start, taskSelected.value.end)) {
        return true;
    }
    return false;
}
//Hacer scroll horizontal a la tabla hasta la fecha de inicio de la primera tarea
const goToStartActivity = () => {

    const firstTask = props.tasks[0];
    const firstTaskMiddleFormatted = formatStoreDate(firstTask.start);
    const columnIndex = filterColumns().findIndex(column => column.key === firstTaskMiddleFormatted);
    const firstTaskMiddleElement = document.getElementById(`head-column-${columnIndex}`);
    if (!firstTaskMiddleElement) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la fecha de inicio de la primera tarea',
        })
    }
    firstTaskMiddleElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
}
//Ir hacia la izquierda todo lo que se pueda, no por tarea, sino la tabla todo lo que se pueda
const goToEndActivity = () => {
    const table = document.getElementById('gantt-table');
    table.scrollLeft = 0;
}

// const goToTask = (index) => {
//     const task = props.tasks[index];

//     const taskMiddleFormatted = formatStoreDate(task.start);
//     const columnIndex = filterColumns().findIndex(column => column.key === taskMiddleFormatted);

//     const taskMiddleElement = document.getElementById(`head-column-${columnIndex}`);

//     if (!taskMiddleElement) {
//         return Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'No se encontró la fecha de inicio de la tarea',
//         })
//     }

//     taskMiddleElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
// }

const goToTask = (index) => {
    const task = props.tasks[index]
    const key = formatStoreDate(task.start)
    const colIdx = filterColumns().findIndex(c => c.key === key)
    const th = document.getElementById(`head-column-${colIdx}`)

    if (!th) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la fecha de inicio de la tarea',
        })
    }

    const container = document.querySelector('.sticky-container')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const thRect = th.getBoundingClientRect()
    const currentScroll = container.scrollLeft

    // X del TH dentro del contenedor (antes de scroll)
    const thRelativeX = thRect.left - containerRect.left + currentScroll

    // Queremos centrarlo: moverlo a la mitad
    const centerOffset = thRelativeX + thRect.width / 2 - container.clientWidth / 2

    // EXTRA: un 5% más hacia la izquierda (para que el TH se vea más a la derecha)
    const extraOffset = - container.clientWidth * 0.05

    // Clamp entre 0 y el máximo scroll posible
    const targetScrollX = Math.min(
        Math.max(centerOffset + extraOffset, 0),
        container.scrollWidth - container.clientWidth
    )

    container.scrollTo({
        left: targetScrollX,
        behavior: 'smooth'
    })
}




const applyChanges = () => {
    emit('applyChanges', props.tasks);
}

const adjustTasks = () => {
    emit('adjustTasks', props.tasks);
}

</script>
<style scoped>
.sticky-column {
    position: sticky;
    z-index: 10;
}

.sticky-row {
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

th.sticky-column {
    color: white;
    background-color: rgb(255, 119, 0);
}

.sticky-container {
    position: relative;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 60vh;
}

.gantt-wrapper {
    position: relative;
}

.gantt-overlay {
    inset: 0;
    position: absolute;
    background-color: rgba(31, 41, 55, 0.5);
    z-index: 9999;
}
</style>
<style scoped>
.loader {
    width: 5px;
    /* Aumentado un 25% (de 4px a 5px) */
    color: #F6EEEA;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow:
        23.75px -23.75px 0 0px, 47.5px -23.75px 0 0px, 71.25px -23.75px 0 0px,
        /* Aumentado un 25% */
        23.75px 0 0 6.25px, 47.5px 0 0 6.25px, 71.25px 0 0 6.25px,
        /* Aumentado un 25% */
        23.75px 23.75px 0 0px, 47.5px 23.75px 0 0px, 71.25px 23.75px 0 0px;
    /* Aumentado un 25% */
    transform: translateX(-47.5px);
    /* Aumentado un 25% */
    animation: l26 2s infinite linear;
    z-index: 9999;
}

@keyframes l26 {
    12.5% {
        box-shadow:
            23.75px -23.75px 0 0px, 47.5px -23.75px 0 0px, 71.25px -23.75px 0 6.25px,
            /* Aumentado un 25% */
            23.75px 0 0 6.25px, 47.5px 0 0 0px, 71.25px 0 0 6.25px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 0px, 47.5px 23.75px 0 0px, 71.25px 23.75px 0 0px
            /* Aumentado un 25% */
    }

    25% {
        box-shadow:
            23.75px -23.75px 0 6.25px, 47.5px -23.75px 0 0px, 71.25px -23.75px 0 6.25px,
            /* Aumentado un 25% */
            23.75px 0 0 0px, 47.5px 0 0 0px, 71.25px 0 0 0px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 0px, 47.5px 23.75px 0 6.25px, 71.25px 23.75px 0 0px
            /* Aumentado un 25% */
    }

    50% {
        box-shadow:
            23.75px -23.75px 0 6.25px, 47.5px -23.75px 0 6.25px, 71.25px -23.75px 0 0px,
            /* Aumentado un 25% */
            23.75px 0 0 0px, 47.5px 0 0 0px, 71.25px 0 0 0px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 0px, 47.5px 23.75px 0 0px, 71.25px 23.75px 0 6.25px
            /* Aumentado un 25% */
    }

    62.5% {
        box-shadow:
            23.75px -23.75px 0 0px, 47.5px -23.75px 0 0px, 71.25px -23.75px 0 0px,
            /* Aumentado un 25% */
            23.75px 0 0 6.25px, 47.5px 0 0 0px, 71.25px 0 0 0px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 0px, 47.5px 23.75px 0 6.25px, 71.25px 23.75px 0 6.25px
            /* Aumentado un 25% */
    }

    75% {
        box-shadow:
            23.75px -23.75px 0 0px, 47.5px -23.75px 0 6.25px, 71.25px -23.75px 0 0px,
            /* Aumentado un 25% */
            23.75px 0 0 0px, 47.5px 0 0 0px, 71.25px 0 0 6.25px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 0px, 47.5px 23.75px 0 0px, 71.25px 23.75px 0 6.25px
            /* Aumentado un 25% */
    }

    87.5% {
        box-shadow:
            23.75px -23.75px 0 0px, 47.5px -23.75px 0 6.25px, 71.25px -23.75px 0 0px,
            /* Aumentado un 25% */
            23.75px 0 0 0px, 47.5px 0 0 6.25px, 71.25px 0 0 0px,
            /* Aumentado un 25% */
            23.75px 23.75px 0 6.25px, 47.5px 23.75px 0 0px, 71.25px 23.75px 0 0px
            /* Aumentado un 25% */
    }
}
</style>