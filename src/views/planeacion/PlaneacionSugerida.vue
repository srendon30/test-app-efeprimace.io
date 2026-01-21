<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="flex flex-col items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300 mb-10">Planeación Sugerida</h1>
            <!-- Información Proyecto y Estructura -->
            <div class="flex flex-row items-center px-3 py-1 rounded-lg my-1"
                :class="['bg-orange-100 border border-orange-600']">
                <h1 class="text-1xl font-bold text-orange-800">
                    {{ infoProyecto }}
                </h1>
            </div>
            <div class="flex flex-row items-center px-3 py-1 rounded-lg my-1"
                :class="['bg-orange-100 border border-orange-600']">
                <h1 class="text-1xl font-bold text-orange-800">
                    {{ infoEstructura }}
                </h1>
            </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex justify-between">
            <button @click="goBack"
                :class="'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800 mb-2'"
                class="flex items-center px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200">
                <component :is="iconsForm['IconBack']" :class="['w-5 h-5']" />
                <span>
                    Planeación
                </span>
            </button>
        </div>
        <hr>
        <!-- Responsables en Orden que incluye las fechas no disponibles en esta propia orden de trabajo -->
        <div v-if="responsablesOnOrderIncludingOwnNotAvailableDates.length > 0" class="my-4">
            <!-- //Responsables on order -->
            <div class="flex justify-center items-center">
                <span class="text-black text-base font-bold ">Responsables en la Orden de Trabajo</span>
            </div>
            <div class="flex flex-row justify-between my-4 items-center gap-2">
                <div v-for="(responsable, index) in responsablesOnOrderIncludingOwnNotAvailableDates" :key="index"
                    class="flex flex-row items-center justify-center">
                    <label :for="`responsable-checkbox-${index}`"
                        class="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300 text-center border-color-identity-dark rounded-lg p-2 shadow-lg">
                        <span class="font-semibold">
                            {{ responsable.nombre_completo }}
                        </span>
                        <div v-if="responsable.fechas_no_disponibles.length > 0">
                            <VDropdown :triggers="['click']" :placement="'top'">
                                <div class="flex flex-row justify-center items-center"
                                    :class="['m-1 p-2 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                    <span>Fechas No Disponibles: </span>
                                    <component :is="iconsForm['IconCalendar']"
                                        :class="['ml-2', 'w-5 h-5', 'text-cyan-800']" />
                                </div>
                                <template #popper>
                                    <div v-for="(fecha, index) in responsable.fechas_no_disponibles" :key="index"
                                        class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300 gap-4">
                                        <div class="my-1 p-2 border-color-identity-dark dark:border-gray-200">
                                            <span class="text-identity-dark font-semibold dark:text-gray-300">
                                                • <strong>{{ fecha.type }} : </strong>
                                                {{ formatPrettyDate(fecha.start) }} -
                                                {{ formatPrettyDate(fecha.end) }} |
                                                {{ formatHours(fecha.busy_time) }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </VDropdown>
                        </div>
                        <div v-else>
                            <div
                                class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                <h2 class="text-sm font-semibold text-green-800">
                                    100% Disponible.
                                </h2>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-row justify-center items-center my-4">
            <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-cyan-100 border border-cyan-600">
                <h2 class="text-sm font-semibold text-cyan-800">
                    No hay responsables para mostrar.
                </h2>
            </div>
        </div>

        <!-- Información General -->
        <div v-if="etapasOnOrder.length > 0" class="my-4">
            <div class="flex justify-center items-center py-4 px-10 text-center cursor-pointer rounded-lg border border-gray-600 shadow-lg gap-4"
                @click="toggleCollapseInfoEtapas">
                <div class="flex justify-center items-center cursor-pointer">
                    <span class="text-gray-900 dark:text-gray-300 text-base font-bold ">Información General Etapas</span>
                </div>
                <!-- Botón de flecha para expandir/retraer -->
                <span class="text-sm text-gray-500">
                    <component v-if="isCollapsedInfoEtapas" class="h-6 w-6" :is="iconsForm['IconArrowDown']" />
                    <component v-else class="h-6 w-6" :is="iconsForm['IconArrowUp']" />
                </span>
            </div>
            <!-- Contenido retraíble -->
            <div v-if="!isCollapsedInfoEtapas" class="flex flex-wrap transition-all duration-300 px-4 py-2">
                <div v-for="(etapa, index) in etapasOnOrder" :key="index"
                    class="flex flex-col justify-center items-center w-1/4 p-2 box-border border-r border-b border-solid border-black">
                    <!-- Etiqueta de la etapa -->
                    <label :for="`etapa-checkbox-${index}`"
                        class="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300">
                        <span class="text-center font-semibold">
                            {{ etapa.show_data }}
                        </span>
                    </label>

                    <!-- Contenedor de dos columnas -->
                    <div class="flex flex-row w-full mt-4">
                        <!-- Columna 1: Horas -->
                        <div class="flex flex-col w-1/2 pr-2">
                            <!-- Fila 1: Horas Etapa -->
                            <div
                                class="flex flex-row items-center px-3 py-1 rounded-lg mb-2 bg-orange-100 border border-orange-600">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        Horas Estimadas Etapa:
                                    </h2>
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        {{ etapa.horas_estimadas_etapa }}
                                    </h2>
                                </div>
                            </div>

                            <!-- Fila 2: Horas Ingeniería -->
                            <div
                                class="flex flex-row items-center px-3 py-1 rounded-lg mb-2 bg-orange-100 border border-orange-600">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        Horas Estimadas Ingeniería:
                                    </h2>
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        {{ etapa.horas_estimadas_ingenieria }}
                                    </h2>
                                </div>
                            </div>

                            <!-- Fila 3: Horas Dibujo -->
                            <div
                                class="flex flex-row items-center px-3 py-1 rounded-lg bg-orange-100 border border-orange-600">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        Horas Estimadas Dibujo:
                                    </h2>
                                    <h2 class="text-sm text-center text-orange-800 dark:text-gray-300">
                                        {{ etapa.horas_estimadas_dibujo }}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 2: Tiempos Planeados -->
                        <div class="flex flex-col w-1/2 pl-2">
                            <!-- Fila 1: Tiempo Planeado Etapa -->
                            <div class="flex flex-row items-center px-3 py-1 rounded-lg mb-2"
                                :class="warningTimeClass(etapa, 'etapa', 'horas_estimadas_etapa')">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-cente">
                                        Tiempo Planeado Etapa:
                                    </h2>
                                    <div class="flex flex-row justify-center items-center">
                                        <h2 class="text-sm text-center dark:text-gray-300">
                                            {{ formatHours(calculatePlannedTime(etapa.etapa_id, 'etapa')) }}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <!-- Fila 2: Tiempo Real Etapa -->
                            <div class="flex flex-row items-center px-3 py-1 rounded-lg mb-2"
                                :class="warningTimeClass(etapa, 'ingenieria', 'horas_estimadas_ingenieria')">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-center">
                                        Tiempo Planeado Ingeniería:
                                    </h2>
                                    <div class="flex flex-row justify-center items-center">
                                        <h2 class="text-sm text-center  dark:text-gray-300">
                                            {{ formatHours(calculatePlannedTime(etapa.etapa_id, 'ingenieria')) }}
                                        </h2>
                                    </div>

                                </div>
                            </div>

                            <!-- Fila 3: Progreso Etapa -->
                            <div class="flex flex-row items-center px-3 py-1 rounded-lg"
                                :class="warningTimeClass(etapa, 'dibujo', 'horas_estimadas_dibujo')">
                                <div class="flex flex-col justify-center w-full">
                                    <h2 class="text-sm text-center">
                                        Tiempo Planeado Dibujo:
                                    </h2>
                                    <div class="flex flex-row justify-center items-center">
                                        <h2 class="text-sm text-center  dark:text-gray-300">
                                            {{ formatHours(calculatePlannedTime(etapa.etapa_id, 'dibujo')) }}
                                        </h2>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-row justify-center items-center my-4">
            <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-cyan-100 border border-cyan-600">
                <h2 class="text-sm font-semibold text-cyan-800">
                    No hay etapas para mostrar
                </h2>
            </div>
        </div>
        <!-- Divider -->
        <hr>
        <!------------Ganntt------------>
        <div>
            <Gantt v-if="tasks.length > 0" :tasks="tasks" :etapas-on-order="etapasOnOrder"
                :responsables-on-order="responsablesOnOrderIncludingOwnNotAvailableDates"
                :show-general-info-suggested-planning="true" @apply-changes="applyChanges"
                @open-modal="openAddTaskModal" />
        </div>
    </main>
</template>
<script setup>
import AppLoader from "@/components/loader/AppLoader.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, defineProps, onMounted } from 'vue';
import { useIconStore } from '@/stores/icons';
import { useMomentStore } from '@/stores/moment';
import { useBusinessStore } from '@/stores/business';
import Gantt from "@/components/gantt/Gantt.vue";

const router = useRouter();
const route = useRoute();

const { formatPrettyDate, formatStoreDate, parseStoreDate, isDateBetweenDates, compareRangeDates, addDaysToDate, compareDatesIsSame } = useMomentStore();
const { formatHours, parseStringToIntHours, getResponsables, getOrdenTrabajo, getOrdenTrabajoSkipingNotAvailableDates, getOrdenEtapas, getOrdenEtapaTasks, getOrdenEtapasGeneralTasks, formatStringHours, formatIntHours, getLaboralHoursPerDay, confirmSuggestedPlanning } = useBusinessStore();

const formIconNames = ref(['IconSave', 'IconBack']);
const { iconsForm, loadFormIcons } = useIconStore();

const isLoadingApp = ref(false);

const responsablesOnOrderIncludingOwnNotAvailableDates = ref([])
const responsablesOnOrderExcludingOwnNotAvailableDates = ref([])

const etapasOnOrder = ref([])

const ordenTrabajo = ref(null)

const infoProyecto = computed(() => {
    return ordenTrabajo.value?.estructura_proyecto?.proyecto?.codigo + ' - ' + ordenTrabajo.value?.estructura_proyecto?.proyecto?.nombre_proyecto;
});

const infoEstructura = computed(() => {
    return ordenTrabajo.value?.estructura_proyecto?.codigo_estructura + ' - ' + ordenTrabajo.value?.estructura_proyecto?.tipo_estructura.nombre + ' - ' + ordenTrabajo.value?.estructura_proyecto?.tipo_cimentacion.nombre;
});

const tasks = ref([]);

const ordenId = ref(route.params.orden_id);

const isCollapsedInfoEtapas = ref(true);

const toggleCollapseInfoEtapas = () => {
    isCollapsedInfoEtapas.value = !isCollapsedInfoEtapas.value;
};

onMounted(async () => {
    isLoadingApp.value = true;
    await loadFormIcons(formIconNames.value)
    await setEtapasOnOrder(ordenId.value)
    await setOrdenTrabajo(ordenId.value)
    await getTasks(ordenTrabajo.value);
    isLoadingApp.value = false;
});

const getTasks = async (ordenTrabajo) => {
    //Se traen las tareas sean pasadas como parámetro (no aplicadas ó sugeridas) ó las tareas ya aplicadas de la orden.

    // tasks.value = await getOrdenEtapasGeneralTasks(ordenId); //Tareas con los cambios aplicados.
    tasks.value = JSON.parse(ordenTrabajo.suggested_planning.tasks);

    console.log('Suggested Tasks: ', tasks.value);
}

const setEtapasOnOrder = async (ordenId) => {
    etapasOnOrder.value = await getOrdenEtapas(ordenId);
}

const setOrdenTrabajo = async (ordenId) => {
    const data = await getOrdenTrabajo(ordenId);
    ordenTrabajo.value = data.ordenTrabajo
    console.log('Orden de Trabajo: ', ordenTrabajo.value);
    setResponsablesOnOrderIncludingOwnNotAvailableDates(data.responsablesOnOrderIncludingOwnNotAvailableDates);
    setResponsablesOnOrderExcludingOwnNotAvailableDates(data.responsablesOnOrderExcludingOwnNotAvailableDates);
}

const setResponsablesOnOrderIncludingOwnNotAvailableDates = async (responsables) => {
    responsablesOnOrderIncludingOwnNotAvailableDates.value = responsables;
}

const setResponsablesOnOrderExcludingOwnNotAvailableDates = async (responsables) => {
    responsablesOnOrderExcludingOwnNotAvailableDates.value = responsables;
}

const applyChanges = async (tareas) => {
    if (validateCorrectDates(tareas)) {
        tasks.value = tareas;
        console.log('Las fechas son correctas', tasks.value);
        await confirmSuggestedPlanning(ordenId.value, tasks.value);

        // ordenSelected.value = await getOrdenTrabajo(ordenSelected.value.id);
        // closeGanttModal();
    }
}
// ---------------------------------------------------------------
const validateCorrectDates = (tasks) => {
    return validateFechasNoDisponibles(tasks);
}
const validateFechasNoDisponibles = (tasks) => {
    let correctDates = true;
    const saturday = 6, sunday = 0;

    for (const task of tasks) {
        let currentDate = parseStoreDate(task.start);
        const endDate = parseStoreDate(task.end);

        while (currentDate <= endDate) {
            if (isNotDateAvailable(task.responsables, currentDate, task.no_available_days) && currentDate.getDay() !== saturday && currentDate.getDay() !== sunday) {
                Swal.fire({
                    title: `El día ${formatPrettyDate(currentDate)} no está disponible para algunos de los responsables:\n${task.responsables.map(r => `• ${r.nombre_completo}`).join('\n')}. \n En la actividad: \n [ ${task.task} ] `,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#EC7522'
                });
                correctDates = false;
                return;
            }
            // Incrementa la fecha de currentDate dentro del bucle
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return correctDates; // Devuelve el resultado de la validación
}
const isNotDateAvailable = (responsables, currentDate, no_available_days) => {
    const isNotDayAvailable = isNotAvailableDay(no_available_days, currentDate);
    return responsables.some(responsable => {
        return responsable.fechas_no_disponibles.some(rango => {
            const startDate = parseStoreDate(rango.start);
            const endDate = parseStoreDate(rango.end);
            return currentDate >= startDate && currentDate <= endDate && !isNotDayAvailable;
        });
    });
}
const isNotAvailableDay = (no_available_days, date) => {
    const saturday = 6, sunday = 0;
    const columnDate = parseStoreDate(date);
    const isNotAvailableDay = no_available_days.some(date => {
        return compareDatesIsSame(parseStoreDate(date), columnDate) && columnDate.getDay() !== saturday && columnDate.getDay() !== sunday;
    });
    return isNotAvailableDay;
};
// ---------------------------------------------------------------

const openAddTaskModal = (data) => {
    console.log('openAddTaskModal data', data);
    // isAddTaskModalOpen.value = true;
    // indexNewTask.value = data.index;
    // startNewTaskDate.value = data.start;
}

const warningTimeClass = (etapa, area, key) => {
    return {
        'text-red-800 bg-red-100 border border-red-600': calculatePlannedTime(etapa.etapa_id, area) > parseStringToIntHours(etapa[key]),
        'text-teal-800 bg-teal-100 border border-teal-600': calculatePlannedTime(etapa.etapa_id, area) <= parseStringToIntHours(etapa[key]),
    }
}

const calculatePlannedTime = (etapa_id, type) => {
    const etapaTasks = tasks.value.filter(task => task.belongs_to_etapa === etapa_id);
    const totalPlannedTime = etapaTasks.reduce((acc, task) => {
        if (type === 'etapa') {
            return acc + task.duration;
        } else if (type === 'ingenieria' && task.area_responsable === 'INGENIERIA') {
            return acc + task.duration;
        } else if (type === 'dibujo' && task.area_responsable === 'DIBUJO') {
            return acc + task.duration;
        }
        return acc;
    }, 0);
    return totalPlannedTime;
}

const goBack = () => {
    router.go(-1);
};
</script>