<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Planeación</h1>
        </div>
        <BaseForm :type-form="'planeacion'" :icons-view="['IconPlanning']" :action-selected="'planning'" />

        <div v-if="showTable">
            <div class="bg-orange-100 border border-orange-600 my-4 rounded-lg">
                <!-- Título con botón para expandir/retraer -->
                <div class="flex justify-center items-center p-4 text-center cursor-pointer rounded-lg border-b border-orange-600"
                    style="border-bottom-width: 0.5px;" @click="toggleCollapseInfoEstructura">
                    <h2 class="text-2xl text-orange-800 dark:text-gray-300 flex items-center">
                        Información Estructura
                    </h2>
                    <!-- Botón de flecha para expandir/retraer -->
                    <span class="text-sm text-orange-500 ml-4">
                        <svg v-if="isCollapsedInfoEstructura" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M14.707 10.707a1 1 0 01-1.414 0L10 7.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </span>
                </div>
                <!-- Contenido retraíble -->
                <div v-show="!isCollapsedInfoEstructura" class="transition-all duration-300 grid grid-cols-4 gap-4">
                    <div v-for="(key, index) in getInfoEstructura" :key="index"
                        class="border-r border-b border-orange-600 p-2" style="border-bottom-width: 0.5px;">
                        <div>
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                {{ formatKey(key) }}:
                            </h2>
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                {{ formatValue(key, infoEstructura[key]) }}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Asignación ó Desasignación de Responsables -->
            <div class="flex flex-col justify-center my-4">
                <div
                    class="flex flex-row flex-wrap justify-center my-3 p-4 bg-identity-dark dark:border-gray-200 rounded-lg">
                    <div v-for="(option, index) in selectionOptions" :key="index"
                        class="flex flex-col items-center my-2 p-2 border rounded-lg">
                        <!-- Elementos internos en fila -->
                        <div class="flex flex-row items-center">
                            <input type="radio" :id="`option-radio-${index}-${option}`" v-model="optionSelected"
                                :value="option" :name="`options-${index}-responsables`"
                                class="cursor-pointer w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-orange-500" />
                            <label :for="`option-radio-${index}-${option}`"
                                class="cursor-pointer ml-2 text-sm font-medium text-gray-300 dark:text-gray-300">
                                <span class="font-semibold">
                                    {{ option }}
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-center basis-full text-center mt-4">
                        <div :class="['basis-full']">
                            <label :for="'responsables'"
                                class="block text-sm text-identity dark:text-gray-300 max-w-full">
                                <div class="flex justify-center flex-row max-w-full">
                                    <span class="relative flex h-2 w-2 mt-1.5 max-w-full">
                                        <span
                                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span class="ml-2 max-w-full truncate"> Responsables :</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <!-- Type Tag -->
                    <multiselect v-model="responsablesSelected" tag-placeholder="Nuevo tag"
                        placeholder="Selecciona una o más opciones" selected-label="Seleccionado"
                        select-label="Seleccionar" deselect-label="Deseleccionar" :track-by="'id'"
                        :options="getResponsablesOptionsBy" :multiple="true" :disabled="amountRowsSelected === 0"
                        label="show_data" class="mb-4">
                        <template #noResult> No hay resultados </template>
                    </multiselect>
                    <div v-for="(option_action, index_action) in actionsOptionsAssignDesassignResponsables"
                        :key="index_action" class="flex flex-col items-center my-2 p-2 border rounded-lg">
                        <!-- Cada opción como columna -->
                        <!-- Elementos internos en fila -->
                        <div class="flex flex-row items-center">
                            <input type="radio" :id="`option-radio-${index_action}-${option_action}`"
                                v-model="actionAssignDesassignResponsables" :value="option_action"
                                :name="`options-${index_action}-actions`"
                                class="cursor-pointer w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-orange-500" />
                            <label :for="`option-radio-${index_action}-${option_action}`"
                                class="cursor-pointer ml-2 text-sm font-medium text-gray-300 dark:text-gray-300">
                                <span class="font-semibold">
                                    {{ option_action }}
                                </span>
                            </label>
                        </div>
                    </div>
                    <!-- Botón ajustado para nueva disposición -->
                    <div class="basis-full text-center">
                        <button @click="assignResponsables"
                            class="mt-4 px-4 py-2 text-sm text-identity-dark capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200"
                            :class="[amountRowsSelected === 0 || responsablesSelected.length === 0 ? 'bg-gray-400' : 'bg-identity hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-800']"
                            :disabled="amountRowsSelected === 0 || responsablesSelected.length === 0">
                            <span>
                                {{ actionAssignDesassignResponsablesTitle }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Generación de planeación automática y Gantt General -->
            <div class="flex flex-row my-4 justify-between">
                <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2"
                    :class="['bg-cyan-100 border border-cyan-600']">
                    <h2 class="text-sm text-center font-normal" :class="['text-cyan-800']">
                        {{ amountRowsSelected }} Actividades seleccionadas.
                    </h2>
                </div>

                <!-- Regenerar Planeación Automática -->
                <button v-if="isAppliedPlanningSuggested" @click="handleRegeneratePlanningClick"
                    class="px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md dark:text-gray-200 dark:border-gray-200"
                    :class="[buttonRegenerateConfig.class]" :disabled="buttonRegenerateConfig.disabled">
                    <div class="flex flex-row items-center">
                        <div class="mr-2">
                            <component :is="iconsForm[buttonRegenerateConfig.icon]"
                                v-if="!buttonRegenerateConfig.loading"
                                class="text-identity dark:text-gray-300 w-5 h-5" />
                            <svg v-else class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        </div>
                        <span>{{ buttonRegenerateConfig.text }}</span>
                    </div>
                </button>

                <!-- Generar Planeación Autómatica -->
                <button v-if="buttonConfig.show" @click="handlePlanningClick"
                    class="px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md dark:text-gray-200 dark:border-gray-200"
                    :class="[buttonConfig.class]" :disabled="buttonConfig.disabled">
                    <div class="flex flex-row items-center">
                        <div class="mr-2">
                            <component :is="iconsForm[buttonConfig.icon]" v-if="!buttonConfig.loading"
                                class="text-identity dark:text-gray-300 w-5 h-5" />
                            <svg v-else class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        </div>
                        <span>{{ buttonConfig.text }}</span>
                    </div>
                </button>

                <!-- Botón para ver diagrama de Gantt General -->
                <button @click="!isLoadingGantt ? goToPlaneacionAplicada() : null"
                    class="px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border-color-identity-dark rounded-md dark:text-gray-200 dark:border-gray-200"
                    :class="[isAppliedPlanningSuggested && !showGeneralGantt ? 'bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-400' : 'bg-gray-400']"
                    :disabled="!isAppliedPlanningSuggested || isLoadingGantt">
                    <div class="flex flex-row items-center">
                        <div class="mr-2">
                            <component v-if="!isLoadingGantt" :is="iconsForm['IconGantt']"
                                class="text-identity dark:text-gray-200 w-5 h-5" />
                            <component :is="iconsForm['IconLoading']" v-else />
                        </div>
                        <span>
                        </span>
                        <span v-if="!isLoadingGantt">
                            {{ showGeneralGantt ? 'Ocultar Gantt Planeación' : 'Ver Gantt Planeación' }}
                        </span>
                        <span v-else>
                            Cargando...
                        </span>
                    </div>
                </button>
            </div>
            <div v-show="ordenEtapas.length > 0" v-for="(ordenEtapa, index) in ordenEtapas" :key="index"
                class="bg-gray-300 mb-4 rounded-lg border border-solid border-gray-600">
                <!-- Título con botón para expandir/retraer -->
                <div class="flex justify-between items-center py-4 px-10 text-center cursor-pointer rounded-lg border-b border-gray-600"
                    style="border-bottom-width: 0.5px;" @click="toggleCollapse(index)">
                    <h2 class="text-2xl text-identity-dark dark:text-gray-300 flex items-center">
                        {{ ordenEtapa.show_data }}
                        <div class="inline-flex items-center px-3 py-1 rounded-full ml-4"
                            :class="['bg-cyan-100 border border-cyan-600']">
                            <h2 class="text-sm text-center font-normal" :class="['text-cyan-800']">
                                {{ amountRowsSelectedByEtapa(index) }} Actividades seleccionadas.
                            </h2>
                        </div>
                    </h2>
                    <!-- Botón de flecha para expandir/retraer -->
                    <span class="text-sm text-gray-500">
                        <svg v-if="isCollapsed[index]" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M14.707 10.707a1 1 0 01-1.414 0L10 7.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </span>
                </div>
                <!-- Contenido retraíble -->
                <div v-show="!isCollapsed[index]" class="transition-all duration-300 px-4 py-2">
                    <!-- Fechas planeadas de inicio y fin -->
                    <div
                        class="flex flex-row items-center px-3 py-1 rounded-lg my-4 bg-amber-100 border border-amber-600">
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-amber-800 dark:text-gray-300">
                                Fecha Inicio Planeada Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-amber-800 dark:text-gray-300">
                                {{ formatPrettyDate(ordenEtapa.fecha_inicio_planeada) }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-amber-800 dark:text-gray-300">
                                Fecha Entrega Planeada Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-amber-800 dark:text-gray-300">
                                {{ formatPrettyDate(ordenEtapa.fecha_entrega_planeada) }}
                            </h2>
                        </div>
                    </div>
                    <!-- Fechas reales de inicio, entrega y responsables -->
                    <div
                        class="flex flex-row items-center px-3 py-1 rounded-lg my-4 bg-cyan-100 border border-cyan-600">
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-cyan-800 dark:text-gray-300">
                                Fecha Inicio Real Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-cyan-800 dark:text-gray-300">
                                {{ formatPrettyDate(ordenEtapa.fecha_inicio_real) }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-cyan-800 dark:text-gray-300">
                                Responsables Etapa:
                            </h2>
                            <VDropdown :triggers="['hover']" :placement="'top'" class="flex justify-center">
                                <button :title="'Responsables'"
                                    :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                    <component :is="iconsForm['IconPeople']" :class="['w-5 h-5', 'text-cyan-800']" />
                                </button>
                                <template #popper>
                                    <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                        <div v-show="ordenEtapa.responsables.length > 0"
                                            v-for="responsable in ordenEtapa.responsables" :key="responsable.id"
                                            class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                            <div class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                                <span class="text-identity-dark font-semibold dark:text-gray-300">
                                                    • {{ responsable.nombre_completo }}
                                                </span>
                                            </div>
                                        </div>
                                        <div v-show="ordenEtapa.responsables.length === 0"
                                            class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100 border border-red-600">
                                            <h2 class="text-sm font-semibold text-red-800">
                                                Sin responsables.
                                            </h2>
                                        </div>
                                    </div>
                                </template>
                            </VDropdown>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-cyan-800 dark:text-gray-300">
                                Fecha Entrega Real Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-cyan-800 dark:text-gray-300">
                                {{ formatPrettyDate(ordenEtapa.fecha_entrega_real) }}
                            </h2>
                        </div>
                    </div>
                    <!-- Horas estimadas por etapa -->
                    <div
                        class="flex flex-row items-center px-3 py-1 rounded-lg my-4 bg-orange-100 border border-orange-600">
                        <div class="flex flex-col justify-center basis-1/3 ">
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                Horas Estimadas Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                {{ ordenEtapa.horas_estimadas_etapa }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                Horas Estimadas Ingeniería:
                            </h2>
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                {{ ordenEtapa.horas_estimadas_ingenieria }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3 ">
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                Horas Estimadas Dibujo:
                            </h2>
                            <h2 class="text-lg text-center text-orange-800 dark:text-gray-300">
                                {{ ordenEtapa.horas_estimadas_dibujo }}
                            </h2>
                        </div>
                    </div>
                    <!-- Tiempo planeado, tiempo real y progreso -->
                    <div
                        class="flex flex-row items-center px-3 py-1 rounded-lg my-4 bg-teal-100 border border-teal-600">
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-teal-800 dark:text-gray-300">
                                Tiempo Planeado Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-teal-800 dark:text-gray-300">
                                {{ formatStringHours(ordenEtapa.tiempo_planeado) }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-teal-800 dark:text-gray-300">
                                Tiempo Real Etapa:
                            </h2>
                            <h2 class="text-lg text-center text-teal-800 dark:text-gray-300">
                                {{ formatStringHours(ordenEtapa.tiempo_real) }}
                            </h2>
                        </div>
                        <div class="flex flex-col justify-center basis-1/3">
                            <h2 class="text-lg text-center text-teal-800 dark:text-gray-300">
                                Progreso Etapa:
                            </h2>
                            <div class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                                <div class="relative h-6 flex items-center justify-center">
                                    <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                        :style="{ width: `${ordenEtapa.progreso}%` }"
                                        :class="getClassProgress(ordenEtapa.progreso)">
                                    </div>
                                    <div class="relative font-medium text-sm"
                                        :class="getClassProgressText(ordenEtapa.progreso)">
                                        {{ ordenEtapa.progreso }}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Tabla de actividades de cada Etapa -->
                    <BaseTable :ref="el => setBaseTableRef(el, ordenEtapa)" :table="'actividadesOrdenEtapa'"
                        :icons-view="[]" :row-selected="ordenEtapa" :show-search="false"
                        @selected-rows="onSelectedRows(index, $event)" :select-rows-by="selectRowsBy" />
                </div>
            </div>
            <div v-show="ordenEtapas.length === 0">
                <h2 class="my-4 text-2xl text-identity-dark dark:text-gray-300 text-center">
                    No hay actividades para mostrar
                </h2>
            </div>
        </div>

        <!-- <Modal :is-modal-open="isAddTaskModalOpen" @close-modal="closeAddTaskModal" :max-width="'max-w-6xl'"
            :max-height="'max-h-modal'">
            <template #icon>
                <component :is="iconsForm['IconPlus']" class="text-identity-dark dark:text-gray-300 w-10 h-10" />
            </template>
            <template #title>
                <h3 class="text-lg font-semibold text-center text-identity-dark dark:text-gray-300 max-h-">
                    Agregar Actividad
                </h3>
            </template>
            <template #content>
                <div class="flex flex-col justify-center items-center">
                    <BaseForm :type-form="'addTask'" :icons-view="[]" :action-selected="'add_task'" @add-task="addTask"
                        @close-modal="closeAddTaskModal" />
                </div>
            </template>
        </Modal> -->
    </main>
</template>
<script setup>
import AppLoader from "@/components/loader/AppLoader.vue";
import Modal from "@/components/helpers/Modal.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import { ref, onUnmounted, watch, onMounted, watchEffect, onBeforeMount, computed, nextTick } from 'vue';
import { eventBus, getDataFromEventBus, clearDataFromEventBus, sendDataViaEventBus } from "@/helpers/eventBus";
import { useMainStore } from '@/stores/main';
import { useAuthStore } from '@/stores/auth';
import { useIconStore } from '@/stores/icons';
import { useBusinessStore } from "@/stores/business";
import { useMomentStore } from "@/stores/moment";
import { HttpError, showErrorMessage } from "@/helpers/errors";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Gantt from "@/components/gantt/Gantt.vue";
import { toast } from 'vue3-toastify';
import router from "@/router";

const isLoadingApp = ref(false)

function setLoadingApp(value, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            isLoadingApp.value = value;
            resolve();
        }, delay);
    });
}

const notifyPlanningGenerated = () => {
    toast("Planificación Generada con Éxito", {
        // onOpen: () => window.alert('Called when I open'),
        // onClose: () => window.alert('Called when I close'),
        position: toast.POSITION.TOP_CENTER,
        toastClassName: 'custom-toast',
        // progressClassName: 'custom-progress-bar',
    });
};

const indexNewTask = ref(null);
const startNewTaskDate = ref(null);
const endNewTaskDate = ref(null);

const HOURS_PER_DAY = ref(null);

const addTask = (data) => {
    console.log('addTask data', data);
    endNewTaskDate.value = addDaysToDate(parseStoreDate(startNewTaskDate.value), data.duracion - 1);

    const newTask = {
        id: data.actividad_id.id,
        task: data.actividad_id.titulo_actividad,
        start: formatStoreDate(startNewTaskDate.value),
        end: formatStoreDate(endNewTaskDate.value),
        duration: null,
        area_responsable: 'OTRO',
        progress: 0,
        responsables: data.responsables,
        no_working_days: data?.no_working_days ?? [],
        extra_data: data,
    }

    let totalDuration = 0;
    const startDate = parseStoreDate(newTask.start);
    const endDate = parseStoreDate(newTask.end);

    // Recorre cada día entre el inicio y el fin de la tarea
    while (startDate <= endDate) {
        // Verifica si el día es laborable (no sábado ni domingo)
        if (startDate.getDay() !== 6 && startDate.getDay() !== 0) {

            // Suma las horas laborables del día actual a la duración total
            const duration = HOURS_PER_DAY.value[startDate.getDay()];
            totalDuration += duration;
        }
        // Avanza al día siguiente
        startDate.setDate(startDate.getDate() + 1);
    }
    newTask.duration = totalDuration;

    console.log('newTask', newTask);

    //Incluir despues de indexNewTask y correr las tareas siguientes.
    tasks.value.splice(indexNewTask.value + 1, 0, newTask);
}

const formIconNames = ref(['IconGantt', 'IconPeople', 'IconPlanning', 'IconCalendar', 'IconLoading']);
const { iconsForm, loadFormIcons } = useIconStore();

const { formatPrettyDate, formatStoreDate, parseStoreDate, isDateBetweenDates, compareRangeDates, addDaysToDate, compareDatesIsSame } = useMomentStore();

let eventBusWatch;

const authStore = useAuthStore();
const { backendUrlFC } = useMainStore();

const { formatHours, parseStringToIntHours, getResponsables, getOrdenTrabajo, getOrdenEtapas, getOrdenEtapaTasks, getOrdenEtapasGeneralTasks, formatStringHours, formatIntHours, getLaboralHoursPerDay } = useBusinessStore();

onUnmounted(async () => {
    eventBusWatch();
    clearDataFromEventBus();
    if (intervalRequest.value) {
        clearInterval(intervalRequest.value);
    }
});

onMounted(async () => {
    responsablesAll.value = await getResponsables('all');
    responsablesIngenieria.value = await getResponsables('ingenieria');
    responsablesDibujo.value = await getResponsables('dibujo');
    responsablesCantidades.value = await getResponsables('cantidades');
    responsablesCoordinadoresIngenieria.value = await getResponsables('coordinador-ingenieria');
    responsablesCoordinadoresDibujo.value = await getResponsables('coordinador-dibujo');

    await loadFormIcons(formIconNames.value)
    HOURS_PER_DAY.value = await getLaboralHoursPerDay();
});


const goToPlaneacionAplicada = () => {
    router.push({ name: 'planeacion-aplicada', params: { orden_id: ordenSelected.value.id } });
}


const isCollapsed = ref([]);
const showGeneralGantt = ref(false);
const isCollapsedInfoEstructura = ref(true);
const infoEstructura = ref({});

const getInfoEstructura = computed(() => {
    let dontShowData = ['id', 'show_data', 'estado'];
    return Object.keys(infoEstructura.value).filter(key => !dontShowData.includes(key));
});

const formatKey = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
const valueMap = {
    proyecto: ['codigo', 'nombre_proyecto'],
    tipoEstructura: ['codigo', 'nombre'],
    tipoCimentacion: ['codigo', 'nombre'],
}

const formatValue = (key, value) => {
    //Formato de las horas
    if (key === 'horas_ingenieria_estimadas' || key === 'horas_dibujo_estimadas') {
        let keyMap = {
            'horas_ingenieria_estimadas': 'horas_estimadas_ingenieria',
            'horas_dibujo_estimadas': 'horas_estimadas_dibujo'
        }
        let horasEstimadasEstructura = 0;
        ordenEtapas.value.forEach(etapa => {
            horasEstimadasEstructura += parseStringToIntHours(etapa[keyMap[key]]);

        });
        return formatHours(horasEstimadasEstructura);
    }

    //Formato de las horas totales estimadas
    if (key === 'horas_totales_estimadas') {
        let horasEstimadasTotales = 0;
        ordenEtapas.value.forEach(etapa => {
            horasEstimadasTotales += parseStringToIntHours(etapa['horas_estimadas_etapa']);
        });
        return formatHours(horasEstimadasTotales);
    }

    //Velocidades de ingeniería y dibujo
    if (['velocidad_ingenieria', 'velocidad_dibujo'].includes(key)) {
        return infoEstructura.value['tipoEstructura'][key];
    }

    if (value === null) {
        return 'Sin información';
    }

    if (valueMap[key]) {
        return valueMap[key].map(mapKey => value[mapKey]).join(' - ');
    }

    return value;
}

eventBusWatch = watch(() => eventBus.data, async (newEventBusData) => {
    if (newEventBusData) {
        if (newEventBusData.actionSelected === 'show_planning_table') {
            clearDataPlaneacion();
            showDataTable(false);
            await setLoadingApp(true);

            ordenId.value = newEventBusData.ordenId;

            ordenEtapas.value = await getOrdenEtapas(ordenId.value);
            console.log('Orden Etapas: ', ordenEtapas.value);

            infoEstructura.value = newEventBusData.infoEstructura;
            console.log('Info Estructura: ', infoEstructura.value);

            const data = await getOrdenTrabajo(ordenId.value);
            ordenSelected.value = data.ordenTrabajo;
            responsablesOnOrder.value = ordenSelected.value.responsablesOnOrderWithOwnNotAvailableDates;

            setEtapasCollapsed(ordenEtapas.value);

            await setLoadingApp(false, 750);
            showDataTable(true);
            clearDataFromEventBus();
        }
    }
}, { immediate: false });

const setEtapasCollapsed = (ordenEtapas) => {
    isCollapsed.value = [];
    isCollapsed.value = new Array(ordenEtapas.length).fill(true);
}

const toggleCollapse = (index) => {
    isCollapsed.value[index] = !isCollapsed.value[index];
}

const toggleCollapseInfoEstructura = () => {
    isCollapsedInfoEstructura.value = !isCollapsedInfoEstructura.value;
}

const showTable = ref(false);

const showDataTable = (value) => {
    showTable.value = value;
}

const ordenId = ref(null);
const ordenSelected = ref(null);

const ordenEtapas = ref(null);

const optionSelected = ref(null);
const selectionOptions = [
    'TODO',
    'INGENIERIA',
    'DIBUJO',
    'CANTIDADES',
    'REVISION (DE)',
    'REVISION (DI)'
];

const selectRowByMap = {
    'TODO': {
        key: 'all',
        value: true
    },
    'INGENIERIA': {
        key: 'area_responsable',
        value: 'INGENIERIA'
    },
    'DIBUJO': {
        key: 'area_responsable',
        value: 'DIBUJO'
    },
    'CANTIDADES': {
        key: 'area_responsable',
        value: 'CANTIDADES'
    },
    'REVISION (DE)': {
        key: 'titulo_actividad',
        value: 'REVISION (DE)'
    },
    'REVISION (DI)': {
        key: 'titulo_actividad',
        value: 'REVISION (DI)'
    }
}
const responsablesOnOrder = ref([]);

const responsablesAll = ref([]);
const responsablesIngenieria = ref([]);
const responsablesDibujo = ref([]);
const responsablesCantidades = ref([]);
const responsablesCoordinadoresIngenieria = ref([]);
const responsablesCoordinadoresDibujo = ref([]);

const responsablesSelected = ref([]);

//Obtener los responsables según el tipo de filas seleccionadas.
const getResponsablesOptionsBy = computed(() => {
    const responsablesOptions = new Set();

    for (const key in selectedRows.value) {
        const rows = selectedRows.value[key];

        if (rows.length > 0) {
            if (rows.some(row => row.area_responsable === 'INGENIERIA' && !isRevisionActivity('REVISION', row.titulo_actividad))) {
                responsablesIngenieria.value.forEach(option => responsablesOptions.add(option));
            }
            if (rows.some(row => row.area_responsable === 'DIBUJO' && !isRevisionActivity('REVISION', row.titulo_actividad))) {
                responsablesDibujo.value.forEach(option => responsablesOptions.add(option));
            }
            if (rows.some(row => row.area_responsable === 'CANTIDADES' && !isRevisionActivity('REVISION', row.titulo_actividad))) {
                responsablesCantidades.value.forEach(option => responsablesOptions.add(option));
            }
            if (rows.some(row => isRevisionActivity('REVISION', row.titulo_actividad) && row.area_responsable === 'INGENIERIA')) {
                responsablesCoordinadoresIngenieria.value.forEach(option => responsablesOptions.add(option));
            }
            if (rows.some(row => isRevisionActivity('REVISION', row.titulo_actividad) && row.area_responsable === 'DIBUJO')) {
                responsablesCoordinadoresDibujo.value.forEach(option => responsablesOptions.add(option));
            }
        }
    }

    return Array.from(responsablesOptions);
});

const isRevisionActivity = (value, titulo_actividad) => {
    const titulo = titulo_actividad
        .normalize('NFD') // Normaliza el string a la forma de descomposición canónica
        .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres diacríticos (acentos)
        .toUpperCase(); // Convierte a mayúsculas

    return titulo.includes(value);
}

watch(() => optionSelected.value, (newOptionSelected) => {
    if (newOptionSelected) {
        selectRowsBy.value = selectRowByMap[newOptionSelected];
    }
})
const baseTableRefs = ref({});
const setBaseTableRef = (el, ordenEtapa) => {
    if (el) {
        baseTableRefs.value['actividades-' + ordenEtapa.id] = el;
    }
};
const baseTableRows = ref({});
const requestActivitiesParentEvent = () => {
    for (const key in baseTableRefs.value) {
        const baseTable = baseTableRefs.value[key];
        const rows = baseTable.sendRows();
        baseTableRows.value[key] = rows;
    }
};
const selectRowsBy = ref({});
const selectedRows = ref({});

const onSelectedRows = (index, rows) => {
    selectedRows.value[findOrdenEtapaIdByIndex(index)] = rows;
}

const amountRowsSelected = computed(() => {
    let length = 0;
    if (!selectedRows.value) return length;

    for (const key in selectedRows.value) {
        length += selectedRows.value[key].length;
    }
    return length;
})

const amountRowsSelectedByEtapa = (index) => {
    if (!selectedRows.value) return 0;
    return selectedRows.value[findOrdenEtapaIdByIndex(index)]?.length || 0;
}

const findOrdenEtapaIdByIndex = (index) => {
    return ordenEtapas.value[index].id;
}

const actionAssignDesassignResponsables = ref('Asignar');
const actionAssignDesassignResponsablesTitle = computed(() => {
    return actionAssignDesassignResponsables.value === 'Asignar' ? 'Asignar Responsables' : 'Desasignar Responsables';
})

const actionsOptionsAssignDesassignResponsables = [
    'Asignar',
    'Desasignar'
]

const actionMapAssignDesassignResponsables = {
    'asignar': 'asignarActividadesOrdenEtapaMasiva',
    'desasignar': 'desasignarActividadesOrdenEtapaMasiva'
}

const assignResponsables = async () => {

    try {
        const url = new URL(`api/massive/edit/form/${actionMapAssignDesassignResponsables[actionAssignDesassignResponsables.value.toLowerCase()]}`, backendUrlFC);

        const data = {
            ordenId: ordenId.value,
            ordenEtapas: selectedRows.value,
            responsables: responsablesSelected.value
        }

        console.log('Data a enviar: ', data);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        });
        if (response.status === 401) {
            throw new HttpError(
                "Unauthorized: Porfavor vuelve a Iniciar Sesión",
                response.status
            );
        }
        if (!response.ok) {
            throw new HttpError("Error al asignar responsables.", response.status);
        }
        const responseData = await response.json();

        Swal.fire({
            title: responseData.message,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522'
        });
        clearDataPlaneacion();

        if (responseData.newRows && responseData.newOrdenEtapas) {
            updateRowsOrdenEtapas(responseData.newRows);
            updateOrdenEtapas(responseData.newOrdenEtapas);
        }
    } catch (error) {
        showErrorMessage(error);
    }
}

const updateRowsOrdenEtapas = async (newRows) => {
    sendDataViaEventBus({
        actionSelected: 'update_rows_orden_etapas',
        newRows: newRows
    });
    await getDataFromEventBus()
}

const updateOrdenEtapas = async (newOrdenEtapas) => {
    newOrdenEtapas.forEach((newOrdenEtapa, index) => {
        const indexOrdenEtapaActual = ordenEtapas.value.findIndex(ordenEtapa => ordenEtapa.id === newOrdenEtapa.id);
        if (indexOrdenEtapaActual >= 0) {
            ordenEtapas.value[indexOrdenEtapaActual] = newOrdenEtapa;
        }
    });
}

const clearDataPlaneacion = () => {
    selectedRows.value = {};
    responsablesSelected.value = [];
    optionSelected.value = null;
    selectRowsBy.value = {};
}

const isLoadingRequest = ref(false);
const isLoadingGantt = ref(false);

const suggestedTasks = computed(() => {
    return ordenSelected.value?.suggested_planning.tasks;
});

const isNotAvailablePlanningSuggested = computed(() => {
    return ordenSelected.value?.suggested_planning.estado !== 'GENERATED' && !suggestedTasks.value;
})

const isRequestedPlanningSuggested = computed(() => {
    return ordenSelected.value?.suggested_planning.estado === 'REQUESTED' && !suggestedTasks.value;
})

const isAvailablePlanningSuggested = computed(() => {
    return ordenSelected.value?.suggested_planning.estado === 'GENERATED' && suggestedTasks.value;
})

const isAppliedPlanningSuggested = computed(() => {
    return ordenSelected.value?.suggested_planning.estado === 'APPLIED' && suggestedTasks.value;
})

const timeoutRequest = ref(10000)
let intervalRequest = ref(null);

watch(isRequestedPlanningSuggested, (newValue) => {
    if (newValue) {
        console.log('Requesting Orden Selected...');
        intervalRequest.value = setInterval(async () => {

            const data = await getOrdenTrabajo(ordenId.value);
            ordenSelected.value = data.ordenTrabajo;
            responsablesOnOrder.value = ordenSelected.value.responsablesOnOrder;

            console.log('Orden Seleccionada... ', ordenSelected.value);
            console.log('Responsables Orden... ', responsablesOnOrder.value);
        }, timeoutRequest.value);
    } else {
        console.log('No se ha solicitado generación de planeación automática');
        if (intervalRequest.value) {
            notifyPlanningGenerated()
            clearInterval(intervalRequest.value);
            intervalRequest.value = null;
        }
    }
}, { immediate: true });

const buttonConfig = computed(() => {
    // Estado: Generando
    if (intervalRequest.value && isRequestedPlanningSuggested.value) {
        return {
            text: 'Generando...',
            class: 'bg-cyan-600 hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
            icon: 'IconLoading',
            loading: true,
            disabled: true,
            show: true
        }
    }

    // Estado: Planeación sugerida disponible.
    if (isAvailablePlanningSuggested.value) {
        return {
            text: isLoadingRequest.value ? 'Cargando...' : 'Ver Planeación Sugerida',
            class: 'bg-emerald-500 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-800',
            icon: isLoadingRequest.value ? 'IconLoading' : 'IconPlanning',
            loading: isLoadingRequest.value,
            disabled: isLoadingRequest.value,
            show: true
        }
    }

    // Estado: Planeación sugerida aplicada.
    if (isAppliedPlanningSuggested.value) {
        return {
            text: 'Planeación Aplicada',
            class: 'bg-emerald-500 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-800',
            icon: 'IconPlanning',
            loading: false,
            disabled: true,
            show: false
        }
    }

    // Estado: Solicitando
    if (isLoadingRequest.value) {
        return {
            text: 'Solicitando...',
            class: 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
            icon: 'IconLoading',
            loading: true,
            disabled: true,
            show: true
        }
    }

    // Estado inicial
    return {
        text: 'Solicitar Planeación Automática',
        class: 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
        icon: 'IconPlanning',
        loading: false,
        disabled: false,
        show: true
    }
})

const isLoadingRegenerateRequest = ref(false);

const buttonRegenerateConfig = computed(() => {
    // Estado: Generando
    if (intervalRequest.value && isRequestedPlanningSuggested.value) {
        return {
            text: 'Generando...',
            class: 'bg-cyan-600 hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
            icon: 'IconLoading',
            loading: true,
            disabled: true
        }
    }

    // Estado: Planeación disponible
    if (isAvailablePlanningSuggested.value) {
        return {
            text: isLoadingRegenerateRequest.value ? 'Cargando...' : 'Regenerar Planeación Sugerida',
            class: 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
            icon: isLoadingRegenerateRequest.value ? 'IconLoading' : 'IconPlanning',
            loading: isLoadingRegenerateRequest.value,
            disabled: isLoadingRegenerateRequest.value
        }
    }

    // Estado: Solicitando
    if (isLoadingRegenerateRequest.value) {
        return {
            text: 'Solicitando...',
            class: 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
            icon: 'IconLoading',
            loading: true,
            disabled: true
        }
    }

    // Estado inicial
    return {
        text: 'Regenerar Planeación Automática',
        class: 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800',
        icon: 'IconPlanning',
        loading: false,
        disabled: isAvailablePlanningSuggested.value ? true : false
    }
})

const handleRegeneratePlanningClick = () => {
    if (!buttonRegenerateConfig.value.disabled) {
        console.log('Regenerar Planeación Automática');
        regenerarPlaneacionAutomatica();
    }
}

const regenerarPlaneacionAutomatica = async () => {
    showIsLoadingRegenerateRequest();

    const data = await getOrdenTrabajo(ordenId.value);
    ordenSelected.value = data.ordenTrabajo;
    responsablesOnOrder.value = ordenSelected.value.responsablesOnOrderWithOwnNotAvailableDates;

    console.log('Orden Seleccionada: ', ordenSelected.value);
    console.log('Responsables Orden: ', responsablesOnOrder.value);

    if (isRequestedPlanningSuggested.value) {
        Swal.fire({
            title: 'Ya se ha solicitado una planeación automática',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522'
        });
        hideIsLoadingRegenerateRequest();
        return;
    }

    if (isNotAvailablePlanningSuggested.value) {
        Swal.fire({
            title: 'No se ha generado una planeación automática para este proyecto.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2563EB',
        });
        hideIsLoadingRegenerateRequest();
        return;
    }

    Swal.fire({
        title: '¿Estás seguro de re-generar una planeación automática?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EC7522',
        cancelButtonColor: '#6B7280'
    }).then(async (result) => {
        if (result.isConfirmed) {

            try {
                const url = new URL('api/re-generate-automatic-planning', backendUrlFC);

                const data = {
                    orden_id: ordenSelected.value.id,
                    ordenEtapas: ordenEtapas.value
                }

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(data)
                });
                if (response.status === 401) {
                    hideIsLoadingRegenerateRequest();
                    throw new HttpError(
                        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
                        response.status
                    );
                }
                if (!response.ok) {
                    hideIsLoadingRegenerateRequest();
                    throw new HttpError("Error al generar la planeación automática.", response.status);
                }

                //Carga la orden seleccionada con la planeación automática. //REQUESTED
                const orden = await getOrdenTrabajo(ordenId.value);
                ordenSelected.value = orden.ordenTrabajo;
                responsablesOnOrder.value = ordenSelected.value.responsablesOnOrderWithOwnNotAvailableDates;


                const responseData = await response.json();

                Swal.fire({
                    title: responseData.message,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#EC7522'
                });
                hideIsLoadingRegenerateRequest();

            } catch (error) {
                showErrorMessage(error);
            }
        } else {
            hideIsLoadingRegenerateRequest();
        }
    });
}

const handleClick = () => {
    console.log('handleClick');


}

const goToPlaneacionSugerida = () => {
    router.push({
        name: 'planeacion-sugerida',
        params: {
            orden_id: ordenSelected.value.id,
        }
    })
}

const handlePlanningClick = async () => {

    if (!buttonConfig.value.disabled) {
        //Si no está cargando la solicitud, muestra el loader.
        showIsLoadingRequest();

        if (isAvailablePlanningSuggested.value) {

            //Ya tiene una planeación automática generada.
            const tasks = JSON.parse(ordenSelected.value.suggested_planning.tasks);
            console.log('Original PLANNING TASKS RESPONSE Tasks: ', tasks);

            goToPlaneacionSugerida();

            hideIsLoadingRequest();
            return
        }

        await solicitarPlaneacionAutomatica()
        hideIsLoadingRequest();
    }
}

const solicitarPlaneacionAutomatica = async () => {

    if (etapasHasNotResponsables()) {
        Swal.fire({
            title: 'Existen etapas sin responsables asignados',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522'
        });
        return;
    }

    if (activitiesHasNotResponsables()) {
        Swal.fire({
            title: 'Existen actividades sin responsables asignados',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522'
        });
        return;
    }

    if (isRequestedPlanningSuggested.value) {
        Swal.fire({
            title: 'Ya se ha solicitado una planeación automática',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522'
        });
        return;
    }

    return Swal.fire({
        title: '¿Estás seguro de generar una planeación automática?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EC7522',
        cancelButtonColor: '#6B7280'
    }).then(async (result) => {
        if (result.isConfirmed) {

            let fechaTentativa;

            await Swal.fire({
                title: '¿Deseas asignar una fecha tentativa de inicio?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, asignar',
                cancelButtonText: 'No, continuar',
                confirmButtonColor: '#EC7522',
                cancelButtonColor: '#6B7280'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { value: fecha } = await Swal.fire({
                        title: 'Selecciona la fecha',
                        html: `<input type="date" id="fechaInput" class="swal2-input" required>`,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#EC7522',
                        cancelButtonColor: '#6B7280',
                        preConfirm: () => {
                            return document.getElementById('fechaInput').value;
                        },
                        inputValidator: (value) => {
                            if (!value) return '¡Debes seleccionar una fecha!';
                        }
                    });

                    if (fecha) {
                        // Convertir la fecha en un objeto { year, month, day }
                        const [year, month, day] = fecha.split('-');
                        fechaTentativa = {
                            year: parseInt(year, 10),
                            month: parseInt(month, 10),
                            day: parseInt(day, 10)
                        };
                    }
                }
            });

            if (fechaTentativa) {
                console.log('Fecha Tentativa: ', fechaTentativa);
            } else {
                console.log('No se seleccionó fecha tentativa');
            }

            try {
                const url = new URL('api/generate-automatic-planning', backendUrlFC);

                const data = {
                    orden_id: ordenSelected.value.id,
                    ordenEtapas: ordenEtapas.value,
                    fecha_tentativa_inicio: fechaTentativa
                }

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(data)
                });
                if (response.status === 401) {
                    throw new HttpError(
                        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
                        response.status
                    );
                }
                if (!response.ok) {
                    throw new HttpError("Error al generar la planeación automática.", response.status);
                }

                //Carga la orden seleccionada con la planeación automática. //REQUESTED
                const orden = await getOrdenTrabajo(ordenId.value);
                ordenSelected.value = orden.ordenTrabajo;
                responsablesOnOrder.value = ordenSelected.value.responsablesOnOrderWithOwnNotAvailableDates;


                const responseData = await response.json();

                Swal.fire({
                    title: responseData.message,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#EC7522'
                });

            } catch (error) {
                showErrorMessage(error);
            }
        }
    });
}

const showIsLoadingRegenerateRequest = () => {
    isLoadingRegenerateRequest.value = true;
}

const hideIsLoadingRegenerateRequest = () => {
    isLoadingRegenerateRequest.value = false;
}

const showIsLoadingRequest = () => {
    isLoadingRequest.value = true;
}

const hideIsLoadingRequest = () => {
    isLoadingRequest.value = false;
}

const etapasHasNotResponsables = () => {
    for (const etapa of ordenEtapas.value) {
        if (etapa.responsables.length === 0) {
            return true;
        }
    }
    return false;
}

const activitiesHasNotResponsables = () => {
    requestActivitiesParentEvent();
    for (const key in baseTableRows.value) {
        const rows = baseTableRows.value[key];
        if (rows.some(row => row.responsables.length === 0)) {
            return true;
        }
    }
    return false;
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

const tasks = ref([]);

// const isAddTaskModalOpen = ref(false);

// const openAddTaskModal = (data) => {
//     console.log('openAddTaskModal data', data);
//     isAddTaskModalOpen.value = true;
//     indexNewTask.value = data.index;
//     startNewTaskDate.value = data.start;
// }

// const closeAddTaskModal = () => {
//     isAddTaskModalOpen.value = false;
// }

// const tasksWithDates = computed(() => {
//     return tasks.value.length && tasks.value.every(task => task.start != null && task.end != null);
// });

// Muestra el diagrama de Gantt General, tanto para la planeación automática como para ver el diagrama de Gantt General del proyecto.
// const showHideGanttGeneral = async (tareas = [], skipNotAvailableDates = false, showGeneralInfo = true) => {
//     showGeneralInfoSuggestedPlanning.value = showGeneralInfo;

//     //Si no está cargando la solicitud, muestra el loader.
//     if (!isLoadingRequest.value) {
//         showIsLoadingGantt()
//     }

//     ordenSelected.value = skipNotAvailableDates ? await getOrdenTrabajoSkipNotAvailableDatesOwnOrder(ordenSelected.value.id) : await getOrdenTrabajo(ordenSelected.value.id);
//     responsablesOnOrder.value = ordenSelected.value.responsablesOnOrder; //Check


//     if (isNotAvailablePlanningSuggested.value) {
//         Swal.fire({
//             title: 'No se ha generado una planeación automática para este proyecto.',
//             icon: 'warning',
//             confirmButtonText: 'Aceptar',
//             confirmButtonColor: '#2563EB',
//         });
//         hideIsLoadingGantt()
//         return;
//     }

//     //Se traen las tareas sean pasadas como parámetro (no aplicadas, sugeridas) o las tareas ya aplicadas de la orden.
//     tasks.value = tareas.length > 0 ? tareas : await getOrdenEtapasGeneralTasks(ordenSelected.value.id); //Tareas con los cambios aplicados.

//     console.log('Tareas: ', tasks.value);

//     if (!tasksWithDates.value && !tareas.length) {
//         Swal.fire({
//             title: 'No se han asignado fechas a las actividades.',
//             icon: 'warning',
//             confirmButtonText: 'Aceptar',
//             confirmButtonColor: '#2563EB',
//         });
//         hideIsLoadingGantt()
//         return;
//     }

//     showGeneralGantt.value = !showGeneralGantt.value;

//     hideIsLoadingGantt()
//     return;
// }

// const verificarFechaDisponibleResponsable = (date, idResponsable) => {
//     const fechasNoDisponibles = responsablesOnOrder.value.find(r => r.id === idResponsable)?.fechas_no_disponibles || [];

//     if (fechasNoDisponibles.length === 0) {
//         console.log(fechasNoDisponibles.length)
//         console.log(`Fecha ${date} disponible para el responsable ${idResponsable}`);
//         return true;
//     }

//     // Verificar que tanto start como end no estén en fechas no disponibles
//     for (let i = 0; i < fechasNoDisponibles.length; i++) { //Fechas no disponibles ejemplo: start: 2022-01-10, end: 2021-01-15
//         const fechaNoDisponible = fechasNoDisponibles[i];
//         const startNoDisponible = fechaNoDisponible.start;
//         const endNoDisponible = fechaNoDisponible.end;

//         if (compareRangeDates(date, startNoDisponible, endNoDisponible)) {
//             console.log(`Fecha ${date} NO disponible para el responsable ${idResponsable}`);
//             return false;
//         } else {
//             console.log(`Fecha ${date} disponible para el responsable ${idResponsable}`);
//             return true;
//         }
//     }
// }

// const tasksAux = ref([{ 'id': 1, 'task': 'Definición plan de trabajo y configuración estructural', 'start': '2025-02-12', 'end': '2025-02-12', 'duration': 5, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 1, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 5 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': null, 'titulo_actividad': 'Definición plan de trabajo y configuración estructural', 'no_working_days': [], 'no_available_days': [] }, { 'id': 2, 'task': 'Modelo de losa maciza', 'start': '2025-02-12', 'end': '2025-02-13', 'duration': 13, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 2, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 13 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [1] }, 'titulo_actividad': 'Modelo de losa maciza', 'no_working_days': [], 'no_available_days': [] }, { 'id': 3, 'task': 'Modelo de superestructura', 'start': '2025-02-13', 'end': '2025-02-17', 'duration': 13, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 2, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 13 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [2] }, 'titulo_actividad': 'Modelo de superestructura', 'no_working_days': [], 'no_available_days': [] }, { 'id': 4, 'task': 'Dibujo de plantas predimensionamiento', 'start': '2025-02-17', 'end': '2025-02-18', 'duration': 13, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 2, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 13 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [3] }, 'titulo_actividad': 'Dibujo de plantas predimensionamiento', 'no_working_days': [], 'no_available_days': [] }, { 'id': 5, 'task': 'Revisión (CDE) - Modelos de Superestructura', 'start': '2025-02-17', 'end': '2025-02-18', 'duration': 13, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 2, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 13 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [3] }, 'titulo_actividad': 'Revisión (CDE) - Modelos de Superestructura', 'no_working_days': [], 'no_available_days': [] }, { 'id': 264, 'task': 'Modelo de cimentación vigas con pilotes', 'start': '2025-02-18', 'end': '2025-02-20', 'duration': 21, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 3, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 21 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [3] }, 'titulo_actividad': 'Modelo de cimentación vigas con pilotes', 'no_working_days': [], 'no_available_days': [] }, { 'id': 265, 'task': 'Revisión N°1 (CDE\\/ID) - Modelo de cimentación', 'start': '2025-02-20', 'end': '2025-02-24', 'duration': 21, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 3, 'responsables': [{ 'id': 1, 'nombre_completo': 'José Rafael Cano Pabón', 'tiempo_planeado': 21 }], 'responsables_ids': [1], 'actividades_antecesoras_ids': { 'and': [264] }, 'titulo_actividad': 'Revisión N°1 (CDE\\/ID) - Modelo de cimentación', 'no_working_days': [], 'no_available_days': [] }, { 'id': 266, 'task': 'Despiece de pilotes y vigas de cimentación', 'start': '2025-02-24', 'end': '2025-02-26', 'duration': 21, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 3, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 21 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [265] }, 'titulo_actividad': 'Despiece de pilotes y vigas de cimentación', 'no_working_days': [], 'no_available_days': [] }, { 'id': 267, 'task': 'Dibujo de cimentación en vigas con pilotes', 'start': '2025-02-26', 'end': '2025-02-28', 'duration': 21, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 3, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 21 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [266] }, 'titulo_actividad': 'Dibujo de cimentación en vigas con pilotes', 'no_working_days': [], 'no_available_days': [] }, { 'id': 268, 'task': 'Revisión N°2 (ID) Paquete de planos de cimentación', 'start': '2025-02-28', 'end': '2025-03-11', 'duration': 21, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 3, 'responsables': [{ 'id': 1, 'nombre_completo': 'José Rafael Cano Pabón', 'tiempo_planeado': 21 }], 'responsables_ids': [1], 'actividades_antecesoras_ids': { 'and': [267] }, 'titulo_actividad': 'Revisión N°2 (ID) Paquete de planos de cimentación', 'no_working_days': [], 'no_available_days': ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04', '2025-03-05', '2025-03-06', '2025-03-07', '2025-03-08', '2025-03-09'] }, { 'id': 6, 'task': 'Diseño y despiece de muros y acoples', 'start': '2025-02-20', 'end': '2025-02-28', 'duration': 36, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 36 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [3] }, 'titulo_actividad': 'Diseño y despiece de muros y acoples', 'no_working_days': ['2025-02-24', '2025-02-25'], 'no_available_days': [] }, { 'id': 7, 'task': 'Dibujo de muros y acoples', 'start': '2025-02-28', 'end': '2025-03-05', 'duration': 36, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 36 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [6] }, 'titulo_actividad': 'Dibujo de muros y acoples', 'no_working_days': [], 'no_available_days': [] }, { 'id': 8, 'task': 'Diseño de losa maciza', 'start': '2025-02-28', 'end': '2025-03-06', 'duration': 36, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 36 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [2] }, 'titulo_actividad': 'Diseño de losa maciza', 'no_working_days': [], 'no_available_days': [] }, { 'id': 9, 'task': 'Diseño detalles complementarios (Escaleras, Sobrerrecoridos, Losas tecnicas)', 'start': '2025-03-06', 'end': '2025-03-12', 'duration': 36, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 36 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [3] }, 'titulo_actividad': 'Diseño detalles complementarios (Escaleras, Sobrerrecoridos, Losas tecnicas)', 'no_working_days': [], 'no_available_days': [] }, { 'id': 10, 'task': 'Dibujo de losas', 'start': '2025-03-06', 'end': '2025-03-11', 'duration': 36, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 36 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [8] }, 'titulo_actividad': 'Dibujo de losas', 'no_working_days': [], 'no_available_days': [] }, { 'id': 11, 'task': 'Dibujo detalles complementarios', 'start': '2025-03-12', 'end': '2025-03-17', 'duration': 36, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 4, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 36 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [9] }, 'titulo_actividad': 'Dibujo detalles complementarios', 'no_working_days': [], 'no_available_days': [] }, { 'id': 12, 'task': 'Revisión (CD)', 'start': '2025-03-05', 'end': '2025-03-05', 'duration': 9, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 5, 'responsables': [{ 'id': 6, 'nombre_completo': 'Manuela Juliana Jiménez Cano', 'tiempo_planeado': 9 }], 'responsables_ids': [6], 'actividades_antecesoras_ids': { 'or': [7, 10, 11] }, 'titulo_actividad': 'Revisión (CD)', 'no_working_days': [], 'no_available_days': [] }, { 'id': 13, 'task': 'Revisión (CDE)', 'start': '2025-03-11', 'end': '2025-03-12', 'duration': 9, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 5, 'responsables': [{ 'id': 1, 'nombre_completo': 'José Rafael Cano Pabón', 'tiempo_planeado': 9 }], 'responsables_ids': [1], 'actividades_antecesoras_ids': { 'or': [6, 8, 9] }, 'titulo_actividad': 'Revisión (CDE)', 'no_working_days': [], 'no_available_days': [] }, { 'id': 14, 'task': 'Corrección de observaciones en planos', 'start': '2025-03-12', 'end': '2025-03-13', 'duration': 9, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 5, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 9 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'or': [7, 10, 11] }, 'titulo_actividad': 'Corrección de observaciones en planos', 'no_working_days': [], 'no_available_days': [] }, { 'id': 15, 'task': 'Elaboración de documentos técnicos (memorias de cálculo, informes para Ing. de suelos, presupuesto, revisor)', 'start': '2025-03-13', 'end': '2025-03-13', 'duration': 7, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 6, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 7 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'or': [3, 264] }, 'titulo_actividad': 'Elaboración de documentos técnicos (memorias de cálculo, informes para Ing. de suelos, presupuesto, revisor)', 'no_working_days': [], 'no_available_days': [] }, { 'id': 16, 'task': 'Elaboración plano 00 (sheet list matacho, listado de planos y detalle generales)', 'start': '2025-03-05', 'end': '2025-03-18', 'duration': 7, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 6, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 7 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'or': [7, 10, 11] }, 'titulo_actividad': 'Elaboración plano 00 (sheet list matacho, listado de planos y detalle generales)', 'no_working_days': ['2025-03-06', '2025-03-07', '2025-03-10', '2025-03-12', '2025-03-13', '2025-03-14'], 'no_available_days': [] }, { 'id': 17, 'task': 'Postentrega Diseño (Observación curaduría, revisor, detalle para obra)', 'start': '2025-03-18', 'end': '2025-03-18', 'duration': 0, 'progress': 0, 'area_responsable': 'INGENIERIA', 'belongs_to_etapa': 7, 'responsables': [{ 'id': 3, 'nombre_completo': 'María Fernanda Manrique Acevedo', 'tiempo_planeado': 0 }], 'responsables_ids': [3], 'actividades_antecesoras_ids': { 'and': [14, 16] }, 'titulo_actividad': 'Postentrega Diseño (Observación curaduría, revisor, detalle para obra)', 'no_working_days': [], 'no_available_days': [] }, { 'id': 18, 'task': 'Postentrega Dibujo (Observación curaduría, revisor, detalle para obra)', 'start': '2025-03-18', 'end': '2025-03-18', 'duration': 0, 'progress': 0, 'area_responsable': 'DIBUJO', 'belongs_to_etapa': 7, 'responsables': [{ 'id': 4, 'nombre_completo': 'Carlos Andrés Muñoz López', 'tiempo_planeado': 0 }], 'responsables_ids': [4], 'actividades_antecesoras_ids': { 'and': [14, 16] }, 'titulo_actividad': 'Postentrega Dibujo (Observación curaduría, revisor, detalle para obra)', 'no_working_days': [], 'no_available_days': [] }]);
</script>
<style>
.modal {
    overflow-y: auto;
    max-height: 100vh;
}
</style>