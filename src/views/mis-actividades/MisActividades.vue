<template>
    <main>
        <BaseForm :type-form="'misActividades'" :icons-view="[]" :action-selected="'my_activities'" />
        <div v-if="showTable">
            <div v-for="(ordenEtapa, index) in ordenEtapasPorResponsable" :key="index">
                <h2 class="my-6 text-2xl text-identity-dark dark:text-gray-300 text-center">
                    {{ ordenEtapa.show_data }}
                </h2>
                <BaseTable :table="'actividadesResponsableOrdenEtapa'" :icons-view="[]" :row-selected="ordenEtapa"
                    :show-search="false" />
            </div>
        </div>
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import { ref, onUnmounted, watch, onMounted } from 'vue';
import { eventBus, getDataFromEventBus, clearDataFromEventBus } from "@/helpers/eventBus";
import { useMainStore } from '@/stores/main';
import { useAuthStore } from '@/stores/auth';
import { HttpError, showErrorMessage } from "@/helpers/errors";

let eventBusWatch;

const authStore = useAuthStore();
const { backendUrlFC } = useMainStore();

onUnmounted(() => {
    if (eventBusWatch) {
        eventBusWatch();
        clearDataFromEventBus();
    }
});

eventBusWatch = watch(() => eventBus.data, async (newEventBusData) => {
    if (newEventBusData) {
        if (newEventBusData.actionSelected === 'show_my_activities_table') {
            showDataTable(false);
            estructura.value = newEventBusData.estructura;
            ordenEtapasPorResponsable.value = await getordenEtapasPorResponsable();
            showDataTable(true);
            clearDataFromEventBus();
        }
    }
}, { immediate: false });

const showTable = ref(false);

const showDataTable = (value) => {
    showTable.value = value;
}
const estructura = ref(null);

const ordenEtapasPorResponsable = ref(null);

async function getordenEtapasPorResponsable() {
    const url = new URL('api/list/ordenEtapasPorResponsable/' + estructura.value.id, backendUrlFC);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new HttpError(data.message, response.status);
    }

    return data;
}
</script>