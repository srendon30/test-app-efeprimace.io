<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="flex flex-col items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300 mb-10">Gantt Planeación</h1>
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
        <!------------Ganntt------------>
        <div>
            <Gantt v-if="tasks.length > 0" :tasks="tasks" :etapas-on-order="etapasOnOrder"
                :responsables-on-order="responsablesOnOrderExcludingOwnNotAvailableDates"
                :show-general-info-suggested-planning="false" @apply-changes="applyChanges"
                @open-modal="openAddTaskModal" />
        </div>
    </main>
</template>
<script setup>
import AppLoader from "@/components/loader/AppLoader.vue";
import { ref, computed, defineProps, onMounted } from 'vue';
import { useMomentStore } from '@/stores/moment';
import { useBusinessStore } from '@/stores/business';
import { useIconStore } from '@/stores/icons';
import Gantt from "@/components/gantt/Gantt.vue";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const { formatHours, parseStringToIntHours, getResponsables, getOrdenTrabajo, getOrdenTrabajoSkipingNotAvailableDates, getOrdenEtapas, getOrdenEtapaTasks, getOrdenEtapasGeneralTasks, formatStringHours, formatIntHours, getLaboralHoursPerDay, confirmSuggestedPlanning } = useBusinessStore();
const { iconsForm, loadFormIcons } = useIconStore();

const formIconNames = ref(['IconSave', 'IconBack']);
const ordenId = ref(route.params.orden_id);
const tasks = ref([]);
const ordenTrabajo = ref(null);
const responsablesOnOrderIncludingOwnNotAvailableDates = ref([]);
const responsablesOnOrderExcludingOwnNotAvailableDates = ref([]);
const isLoadingApp = ref(false);
const etapasOnOrder = ref([]);

onMounted(async () => {
    isLoadingApp.value = true;
    await loadFormIcons(formIconNames.value)
    await setEtapasOnOrder(ordenId.value)
    await setOrdenTrabajo(ordenId.value)
    await getTasks(ordenId.value);
    isLoadingApp.value = false;
});

const infoProyecto = computed(() => {
    return ordenTrabajo.value?.estructura_proyecto?.proyecto?.codigo + ' - ' + ordenTrabajo.value?.estructura_proyecto?.proyecto?.nombre_proyecto;
});

const infoEstructura = computed(() => {
    return ordenTrabajo.value?.estructura_proyecto?.codigo_estructura + ' - ' + ordenTrabajo.value?.estructura_proyecto?.tipo_estructura.nombre + ' - ' + ordenTrabajo.value?.estructura_proyecto?.tipo_cimentacion.nombre;
});

const setEtapasOnOrder = async (ordenId) => {
    etapasOnOrder.value = await getOrdenEtapas(ordenId);
}

const getTasks = async (ordenId) => {
    tasks.value = await getOrdenEtapasGeneralTasks(ordenId); //Tareas con los cambios aplicados.
    console.log('Applied Tasks: ', tasks.value);
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
    // if (validateCorrectDates(tareas)) {
    //     tasks.value = tareas;
    //     console.log('Las fechas son correctas', tasks.value);
    //     await confirmSuggestedPlanning(ordenId.value, tasks.value);

    //     // ordenSelected.value = await getOrdenTrabajo(ordenSelected.value.id);
    //     // closeGanttModal();
    // }
}

const openAddTaskModal = (data) => {
    console.log('openAddTaskModal data', data);
    // isAddTaskModalOpen.value = true;
    // indexNewTask.value = data.index;
    // startNewTaskDate.value = data.start;
}

const goBack = () => {
    router.go(-1);
};
</script>
