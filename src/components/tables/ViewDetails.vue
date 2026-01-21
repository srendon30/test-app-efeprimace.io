<template>
    <table v-if="!isMobile" class="min-w-full divide-y divide-gray-700 dark:divide-gray-200"
        :class="!isMobile ? 'table-fixed' : 'flex flex-col'">
        <thead class="bg-identity-dark dark:bg-gray-900">
            <tr>
                <th v-for="column in columns" :key="column.key"
                    class="py-3.5 px-4 text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                    <span>
                        {{ column.header }}
                    </span>
                </th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-700 dark:divide-gray-200">
            <tr>
                <!-- Itera sobre las columnas para mostrar los valores de cada celda -->
                <td v-for="column in columns" :key="column.key"
                    class=" px-2 py-2 text-sm text-center font-medium text-gray-700 dark:text-gray-200 overflow-auto">

                    <!-- Persona -->
                    <template v-if="column.key.startsWith('persona') || column.key.startsWith('jefe')">
                        <div class="flex flex-row items-center justify-center">
                            <span class="text-sm font-medium text-identity-dark dark:text-gray-300">
                                {{ rowSelected[column.key].nombre_completo }}
                            </span>
                        </div>
                    </template>

                    <!-- Estado -->
                    <template v-else-if="column.key.startsWith('estado')">
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                            :class="[statusClass(rowSelected[column.key].color)]">
                            <component class="w-4 h-4" :is="statusIcon(rowSelected[column.key].color)" />
                            <h2 class="text-sm font-normal">{{ rowSelected[column.key].estado }}</h2>
                        </div>
                    </template>

                    <!-- Fecha -->
                    <template v-else-if="column.key.startsWith('fecha')">
                        <div v-if="rowSelected[column.key]">
                            <span class="text-identity-dark dark:text-gray-300">
                                {{ formatPrettyDate(rowSelected[column.key]) }}
                            </span>
                        </div>
                        <div v-else>
                            <span class="text-identity-dark dark:text-gray-300">
                                Sin fecha.
                            </span>
                        </div>
                    </template>

                    <!-- Cantidad Total -->
                    <template v-else-if="column.key.startsWith('cantidad_total')">
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                            :class="[rowSelected[column.key] === 0 ? 'text-red-800 bg-red-100/60 border border-red-500' : rowSelected[column.key] <= 5 ? 'text-yellow-800 bg-yellow-100/60 border border-yellow-500' : 'text-emerald-800 bg-emerald-100/60 border border-emerald-500']">
                            <h2 class="text-sm font-normal">
                                {{ rowSelected[column.key] }}
                            </h2>
                        </div>
                    </template>
                    <!-- Etapas -->
                    <template v-else-if="column.key === 'etapas'">
                        <VDropdown :triggers="['click']" :placement="'top'">
                            <button :title="'Etapas'"
                                :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                <component :is="iconsForm['IconStep']" :class="['w-5 h-5', 'text-cyan-800']" />
                            </button>
                            <template #popper>
                                <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                    <div v-for="etapa in rowSelected[column.key]" :key="column.key"
                                        class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                        <div class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                            <span class="text-identity-dark font-semibold dark:text-gray-300">
                                                • {{ etapa.nombre }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </template>
                        </VDropdown>
                    </template>

                    <!-- Responsables -->
                    <template v-else-if="column.key === 'responsables'">
                        <VDropdown :triggers="['click']" :placement="'top'">
                            <button :title="'Etapas'"
                                :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                <component :is="iconsForm['IconPeople']" :class="['w-5 h-5', 'text-cyan-800']" />
                            </button>
                            <template #popper>
                                <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                    <div v-show="rowSelected[column.key].length > 0"
                                        v-for="responsable in rowSelected[column.key]" :key="column.key"
                                        class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                        <div class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                            <span class="text-identity-dark font-semibold dark:text-gray-300">
                                                • {{ responsable.nombre_completo }}
                                            </span>
                                        </div>
                                    </div>
                                    <div v-show="rowSelected[column.key].length === 0"
                                        class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100 border border-red-600">
                                        <h2 class="text-sm font-semibold text-red-800">
                                            Sin responsables.
                                        </h2>
                                    </div>
                                </div>
                            </template>
                        </VDropdown>
                    </template>

                    <!-- Area Responsable -->
                    <template v-else-if="column.key === 'area_responsable'">
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2" :class="{
        'bg-orange-100 border border-orange-600': rowSelected[column.key] === 'INGENIERIA',
        'bg-gray-100 border border-gray-600': rowSelected[column.key] === 'DIBUJO',
        'bg-white border border-gray-200': rowSelected[column.key] === 'CANTIDADES',
    }">
                            <h2 class="text-sm font-normal" :class="{
        'text-orange-800': rowSelected[column.key] === 'INGENIERIA',
        'text-gray-800': rowSelected[column.key] === 'DIBUJO' || rowSelected[column.key] === 'CANTIDADES',

    }">
                                {{ rowSelected[column.key] }}
                            </h2>
                        </div>
                    </template>
                    <!-- Horas Estimadas -->
                    <template v-else-if="column.key === 'horas_estimadas'">
                        <div>
                            <span class="text-identity-dark dark:text-gray-300">
                                {{ formatStringHours(rowSelected[column.key]) }}
                            </span>
                        </div>
                    </template>
                    <!-- Tiempo Planeado -->
                    <template v-else-if="column.key === 'tiempo_planeado'">
                        <div>
                            <span class="text-identity-dark dark:text-gray-300">
                                {{ formatStringHours(rowSelected[column.key]) }}
                            </span>
                        </div>
                    </template>

                    <!-- Tiempo Real -->
                    <template v-else-if="column.key === 'tiempo_real'">
                        <div>
                            <span class="text-identity-dark dark:text-gray-300">
                                {{ formatStringHours(rowSelected[column.key]) }}
                            </span>
                        </div>
                    </template>

                    <!-- Progreso -->
                    <template v-else-if="column.key === 'progreso'">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                            <div class="relative h-6 flex items-center justify-center">
                                <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                    :style="{ width: `${rowSelected[column.key]}%` }" :class="{
        'bg-green-200': rowSelected[column.key] >= 90,
        'bg-blue-200': rowSelected[column.key] >= 50 && rowSelected[column.key] < 90,
        'bg-yellow-200': rowSelected[column.key] >= 25 && rowSelected[column.key] < 50,
        'bg-red-200': rowSelected[column.key] < 25
    }">
                                </div>
                                <div class="relative font-medium text-sm" :class="{
        'text-green-800': rowSelected[column.key] >= 90,
        'text-blue-800': rowSelected[column.key] >= 50 && rowSelected[column.key] < 90,
        'text-yellow-800': rowSelected[column.key] >= 25 && rowSelected[column.key] < 50,
        'text-red-800': rowSelected[column.key] < 25
    }">
                                    {{ rowSelected[column.key] }}%
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Muestra el valor de la celda para otras columnas -->
                    <template v-else>
                        {{ rowSelected[column.key] }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="isMobile">
        <div v-for="column in columns" :key="column.key"
            class="basis-full p-2 text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
            <div class="mb-1 bg-identity-dark dark:bg-gray-200">
                <span class="text-identity dark:text-gray-900">
                    {{ column.header }}
                </span>
            </div>
            <!-- Persona -->
            <template v-if="column.key.startsWith('persona') || column.key.startsWith('jefe')">
                <div class="flex flex-row items-center justify-center">
                    <span class="text-sm font-medium text-identity-dark dark:text-gray-300">
                        {{ rowSelected[column.key].nombre_completo }}
                    </span>
                </div>
            </template>

            <!-- Estado -->
            <template v-else-if="column.key.startsWith('estado')">
                <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                    :class="[statusClass(rowSelected[column.key].color)]">
                    <component class="w-4 h-4" :is="statusIcon(rowSelected[column.key].color)" />
                    <h2 class="text-sm font-normal">{{ rowSelected[column.key].estado }}</h2>
                </div>
            </template>
            <!-- Fecha -->
            <template v-else-if="column.key.startsWith('fecha')">
                <div v-if="rowSelected[column.key]" class="py-1">
                    <span class="text-identity-dark dark:text-gray-300">
                        {{ formatPrettyDate(rowSelected[column.key]) }}
                    </span>
                </div>
                <div v-else>
                    <span class="text-identity-dark dark:text-gray-300">
                        Sin fecha.
                    </span>
                </div>
            </template>
            <!-- Cantidad Total -->
            <template v-else-if="column.key.startsWith('cantidad_total')">
                <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                    :class="[rowSelected[column.key] === 0 ? 'text-red-800 bg-red-100/60 border border-red-500' : rowSelected[column.key] <= 5 ? 'text-yellow-800 bg-yellow-100/60 border border-yellow-500' : 'text-emerald-800 bg-emerald-100/60 border border-emerald-500']">
                    <h2 class="text-sm font-normal">
                        {{ rowSelected[column.key] }}
                    </h2>
                </div>
            </template>
            <!-- Etapas -->
            <template v-else-if="column.key === 'etapas'">
                <VDropdown :triggers="['click']" :placement="'top'">
                    <button :title="'Etapas'"
                        :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                        <component :is="iconsForm['IconStep']" :class="['w-5 h-5', 'text-cyan-800']" />
                    </button>
                    <template #popper>
                        <div class="p-4 bg-identity-2 dark:bg-gray-800">
                            <div v-for="etapa in rowSelected[column.key]" :key="column.key"
                                class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                <div class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                    <span class="text-identity-dark font-semibold dark:text-gray-300">
                                        • {{ etapa.nombre }}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </template>
                </VDropdown>
            </template>
            <!-- Responsables -->
            <template v-else-if="column.key === 'responsables'">
                <VDropdown :triggers="['click']" :placement="'top'">
                    <button :title="'Etapas'"
                        :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                        <component :is="iconsForm['IconPeople']" :class="['w-5 h-5', 'text-cyan-800']" />
                    </button>
                    <template #popper>
                        <div class="p-4 bg-identity-2 dark:bg-gray-800">
                            <div v-show="rowSelected[column.key].length > 0"
                                v-for="responsable in rowSelected[column.key]" :key="column.key"
                                class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                <div class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                    <span class="text-identity-dark font-semibold dark:text-gray-300">
                                        • {{ responsable.nombre_completo }}
                                    </span>
                                </div>
                            </div>
                            <div v-show="rowSelected[column.key].length === 0"
                                class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100 border border-red-600">
                                <h2 class="text-sm font-semibold text-red-800">
                                    Sin responsables.
                                </h2>
                            </div>
                        </div>
                    </template>
                </VDropdown>
            </template>
            <!-- Area Responsable -->
            <template v-else-if="column.key === 'area_responsable'">
                <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2" :class="{
        'bg-orange-100 border border-orange-600': rowSelected[column.key] === 'INGENIERIA',
        'bg-gray-100 border border-gray-600': rowSelected[column.key] === 'DIBUJO',
        'bg-white border border-gray-200': rowSelected[column.key] === 'CANTIDADES',
    }">
                    <h2 class="text-sm font-normal" :class="{
        'text-orange-800': rowSelected[column.key] === 'INGENIERIA',
        'text-gray-800': rowSelected[column.key] === 'DIBUJO' || rowSelected[column.key] === 'CANTIDADES',

    }">
                        {{ rowSelected[column.key] }}
                    </h2>
                </div>
            </template>
            <!-- Horas Estimadas -->
            <template v-else-if="column.key === 'horas_estimadas'">
                <div>
                    <span class="text-identity-dark dark:text-gray-300">
                        {{ formatStringHours(rowSelected[column.key]) }}
                    </span>
                </div>
            </template>
            <!-- Tiempo Planeado -->
            <template v-else-if="column.key === 'tiempo_planeado'">
                <div>
                    <span class="text-identity-dark dark:text-gray-300">
                        {{ formatStringHours(rowSelected[column.key]) }}
                    </span>
                </div>
            </template>

            <!-- Tiempo Real -->
            <template v-else-if="column.key === 'tiempo_real'">
                <div>
                    <span class="text-identity-dark dark:text-gray-300">
                        {{ formatStringHours(rowSelected[column.key]) }}
                    </span>
                </div>
            </template>

            <!-- Progreso -->
            <template v-else-if="column.key === 'progreso'">
                <div class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                    <div class="relative h-6 flex items-center justify-center">
                        <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                            :style="{ width: `${rowSelected[column.key]}%` }" :class="{
        'bg-green-200': rowSelected[column.key] >= 90,
        'bg-blue-200': rowSelected[column.key] >= 50 && rowSelected[column.key] < 90,
        'bg-yellow-200': rowSelected[column.key] >= 25 && rowSelected[column.key] < 50,
        'bg-red-200': rowSelected[column.key] < 25
    }">
                        </div>
                        <div class="relative font-medium text-sm" :class="{
        'text-green-800': rowSelected[column.key] >= 90,
        'text-blue-800': rowSelected[column.key] >= 50 && rowSelected[column.key] < 90,
        'text-yellow-800': rowSelected[column.key] >= 25 && rowSelected[column.key] < 50,
        'text-red-800': rowSelected[column.key] < 25
    }">
                            {{ rowSelected[column.key] }}%
                        </div>
                    </div>
                </div>
            </template>
            <!-- Muestra el valor de la celda para otras columnas -->
            <template v-else>
                <div class="py-1">
                    <span class="text-identity-dark dark:text-gray-300">
                        {{ rowSelected[column.key] }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, defineAsyncComponent, markRaw } from 'vue';
import { useMainStore } from '@/stores/main';
import { useAuthStore } from '@/stores/auth';
import { useIconStore } from '@/stores/icons';
import { useMomentStore } from '@/stores/moment';
import { useBusinessStore } from '@/stores/business';
import { onMounted } from 'vue';

const { isMobile, isDarkMode } = useMainStore();
const { formatStoreDate, formatPrettyDate, compareRangeDates } = useMomentStore()
const { formatStringHours } = useBusinessStore()

const props = defineProps({
    rowSelected: Object,
    columns: Array,
});

onMounted(async () => {
    await loadFormIcons(formIconNames.value);
});

const formIconNames = ref([])
const { iconsForm, loadFormIcons } = useIconStore();

//Status
const colorsIconMap = {
    green: 'IconCheck',
    red: 'IconX',
    yellow: 'IconWarning',
    neutro: 'IconRefound'
};
const statusIcon = (color) => {
    const iconName = getStatusIconName(color)
    return defineAsyncComponent(() => import(`@/components/icons/${iconName}.vue`));
}
const getStatusIconName = (color) => {
    return colorsIconMap[color] || 'IconWarning'
};
const statusClass = (color) => ({
    'text-red-500 bg-red-100/60 border border-red-500': color === 'red',
    'text-emerald-500 bg-emerald-100/60 border border-emerald-500': color === 'green',
    'text-yellow-600 bg-yellow-100/60 border border-yellow-500': color === 'yellow',
    'text-identity-dark bg-gray-100/60 border border-gray-500': color === 'neutro'
});
</script>