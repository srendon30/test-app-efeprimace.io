<template>
    <main>
        <div class="flex flex-col items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Ordenes de Trabajo</h1>
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
        <div class="flex justify-between">
            <button @click="goBack"
                :class="'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800 mb-2'"
                class="flex items-center px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>

                <span>
                    Atrás
                </span>
            </button>
            <button v-if="estructura" @click="addOrder()"
                class="flex items-center px-4 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200"
                :disabled="isAddOrderDisabled"
                :class="[isAddOrderDisabled ? 'bg-gray-400' : 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800', 'mb-2']">

                <span>
                    Nueva Orden
                </span>
                <IconPlus class="w-5 h-5" />
            </button>
        </div>
        <BaseTable v-if="rowSelected" :table="'ordenTrabajos'" :icons-view="isMobile ? [] : ['IconWorkOrder']"
            :row-selected="rowSelected" />
        <!-- Modal Action-->
        <Modal :is-modal-open="isModalOpen" @close-modal="closeActionModal" max-height="max-entity-height"
            max-width="max-w-5xl">
            <template #icon>
                <IconWorkOrder class="w-6 h-6 text-gray-800 dark:text-white" />
            </template>
            <template #title>
                <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                    Agregar Orden
                </h3>
            </template>
            <template #content>
                <BaseForm v-if="actionSelected === 'add_order'" :type-form="'ordenTrabajo'"
                    :action-selected="actionSelected" :row-selected="rowSelected" @close-modal="closeActionModal" />
            </template>
        </Modal>
    </main>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import BaseTable from "@/components/tables/BaseTable.vue";
import { onMounted, ref, watch } from 'vue';
import IconPlus from "@/components/icons/IconPlus.vue";
import { useMainStore } from '@/stores/main'
import Modal from "@/components/helpers/Modal.vue"
import BaseForm from "@/components/forms/BaseForm.vue";
import IconWorkOrder from '@/components/icons/IconWorkOrder.vue';
import { storeToRefs } from 'pinia';
import { eventBus, sendDataViaEventBus, getDataFromEventBus } from '@/helpers/eventBus';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();
const { isMobile } = storeToRefs(useMainStore());

const isModalOpen = ref(false);
const actionSelected = ref('add_order');

const goBack = () => {
    sendDataViaEventBus({
        actionSelected: 'view_structures',
        rowSelected: estructura.value?.proyecto
    })
    router.go(-1);
};

const defaultSelection = {
    id: route.params.estructura_id,
    object: 'estructura'
};
const rowSelected = ref(null);

const estructura = ref({});

let eventBusWatch;

onMounted(() => {
    rowSelected.value = defaultSelection;
    getDataFromEventBus();
});

eventBusWatch = watch(() => eventBus.data, (newEventBusData) => {
    if (newEventBusData) {
        if (newEventBusData.actionSelected === 'view_orders') {
            estructura.value = newEventBusData.rowSelected;
        }
    }
}, { immediate: false });

const addOrder = () => {
    isModalOpen.value = true;
};

const isAddOrderDisabled = computed(() => {
    return estructura.value.estado?.estado !== 'ACTIVA';
});

const infoProyecto = computed(() => {
    return estructura.value?.proyecto?.codigo + ' - ' + estructura.value?.proyecto?.nombre_proyecto;
});

const infoEstructura = computed(() => {
    return estructura.value?.codigo_estructura + ' - ' + estructura.value?.tipo_estructura + ' - ' + estructura.value?.tipo_cimentacion;
});

const closeActionModal = () => {
    isModalOpen.value = false;
    rowSelected.value = null;
    setTimeout(() => {
        rowSelected.value = defaultSelection;
    }, 500);
};
</script>