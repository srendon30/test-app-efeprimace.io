<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <!-- Title -->
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Dashboard</h1>
        </div>

        <!-- Tabs -->
        <div class="flex flex-wrap justify-center items-center w-full my-4">
            <button v-for="(tab, index) in tabs" @click="showTab = index"
                class="inline-flex items-center justify-center h-12 px-2 py-2 text-center sm:px-4 rounded-t-md dark:text-white whitespace-nowrap focus:outline-none w-1/4"
                :class="[showTab === index ? (isDarkMode ? 'bg-orange-700 text-gray-300' : 'bg-identity-dark text-identity') : (isDarkMode ? 'text-gray-300' : 'text-identity-dark'), showTab === index ? 'border border-b-0' : 'border-b']">
                <component :is="iconsForm[tab.icon]" class="w-6 h-6 mx-1" />
                <span v-if="!isMobile" class="mx-1 text-sm sm:text-base">
                    {{ tab.title }}
                </span>
            </button>
        </div>

        <!-- Fields Options -->
        <div class="flex flex-row items-end justify-center my-8 gap-4">
            <div v-for="(field, index) in fieldsOptions" :key="index" v-show="showField(field.name)" class="basis-1/3">

                <!-- Label -->
                <div class="flex flex-row items-center">
                    <label :for="'projects'" class="block text-sm text-identity-dark dark:text-gray-300 max-w-full">
                        <div class="flex flex-row max-w-full">
                            <span v-if="field.required" class="relative flex h-2 w-2 mt-1.5 max-w-full">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span class="ml-1 max-w-full truncate"> {{ field.label }} :</span>
                        </div>
                    </label>
                </div>
                <!-- Type Tag -->
                <multiselect v-if="field.type === 'tag'" :id="field.name" v-model="fieldsOptionsSelected[field.name]"
                    tag-placeholder="Nuevo tag" :placeholder="field.placeholder" selected-label="Seleccionado"
                    select-label="Seleccionar" deselect-label="Deseleccionar" :track-by="'id'" :options="field.options"
                    :multiple="true" :taggable="false" :disabled="isFieldDisabled(field.name)" label="show_data">
                    <template #noResult> No hay resultados </template>
                </multiselect>
                <!-- {{ fieldsOptionsSelected[field.name] }} -->
            </div>
            <div class="basis-1/12 flex justify-center">
                <button @click="apply()" :disabled="isApplyDisabled"
                    class="flex gap-1 px-4 py-3 text-sm text-identity capitalize transition-colors duration-200 border rounded-md dark:text-gray-200 dark:border-gray-200"
                    :class="['bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800', isApplyDisabled ? 'opacity-50 cursor-not-allowed' : '']">
                    <span>
                        Aplicar
                    </span>
                    <component :is="iconsForm['IconSearch']" :class="['w-5 h-5']" />
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-if="!isLoadingApp">
            <div v-for="(tab, index) in tabs" :key="index" class="tab-container">
                <div v-if="showTab === index" class="chart-wrapper flex flex-wrap p-2">

                    <div v-for="(dataChart, indexData) in dataCharts[tab.name]" :key="indexData"
                        v-show="isShowTab(tab.name)" class="basis-1/2"
                        :class="[tab.name !== 'equipos' ? 'border-color-identity-dark-gold rounded-lg p-4' : '']">

                        <div v-if="tab.type === 'BaseTable'" class="flex flex-col justify-center items-center">
                            <div
                                class="my-2 inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                <span class="text-sm font-semibold text-green-800">
                                    {{ dataChart.show_data }}
                                </span>
                            </div>
                            <component :is="components[tab.type]" :table="tab.table" :icons-view="[]"
                                :show-search="false" :row-selected="dataChart" />
                        </div>
                        <div v-else class="flex flex-col justify-center items-center">
                            <div
                                class="my-2 inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100 border border-green-600">
                                <span class="text-sm font-semibold text-green-800">
                                    {{ dataChart.name }}
                                </span>
                            </div>
                            <!-- {{ dataChart }} -->
                            <component :is="components[tab.type]" :data="dataChart.data" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!---------------->

    </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { useIconStore } from '@/stores/icons'
import { useBusinessStore } from '@/stores/business'
import { watch } from 'vue';
import { computed } from 'vue';
import AppLoader from '@/components/loader/AppLoader.vue';

const { isDarkMode, isMobile } = storeToRefs(useMainStore())
const { userAuth } = storeToRefs(useAuthStore())

const { iconsForm, loadFormIcons } = useIconStore();
const formIconNames = ref(['IconOccupation', 'IconProject', 'IconArea', 'IconCharge', 'IconProfile', 'IconLineChart', 'IconCalendar', 'IconBarChart', 'IconPieChart', 'IconUsers', 'IconSearch']);

const { components, loadComponents, getListProyectos, getEstructurasProyectoActivas, fetchDataTabDashboard } = useBusinessStore();

onMounted(async () => {
    await loadFormIcons(formIconNames.value);
    await loadComponents(componentsObjects.value);
    await getProyectos()
});

const showTab = ref(0);
const isLoadingApp = ref(false);

const fieldsOptions = ref([
    {
        name: 'projects',
        label: 'Proyectos',
        type: 'tag',
        placeholder: 'Selecciona uno o más proyectos',
        required: true,
        disabled: false,
        options: [],
    },
    {
        name: 'structures',
        label: 'Estructuras',
        type: 'tag',
        placeholder: 'Selecciona uno o más estructuras',
        required: true,
        disabled: false,
        options: [],
    }
]);

const fieldsOptionsSelected = ref({});

const getProyectos = async () => {
    const data = await getListProyectos();
    const projectsObject = fieldsOptions.value.find((field) => field.name === 'projects');
    projectsObject.options = [...data];
}

const getEstructurasProyecto = async (selectedProjects) => {

    if (!selectedProjects || selectedProjects.length === 0) {
        return;
    }

    let mergedStructures = [];

    // Iterar sobre los proyectos seleccionados y obtener sus estructuras
    for (const project of selectedProjects) {
        const data = await getEstructurasProyectoActivas(project.id);
        mergedStructures = [...mergedStructures, ...data];
    }

    // Actualizar las opciones de estructuras en fieldsOptions
    const structuresObject = fieldsOptions.value.find((field) => field.name === 'structures');
    structuresObject.options = mergedStructures;
};

// Watcher para obtener estructuras al seleccionar proyectos
watch(
    () => fieldsOptionsSelected.value['projects'],
    (newValue, oldValue) => {
        if (newValue?.length > 0) {
            // Ejecutar la búsqueda solo para los proyectos seleccionados
            getEstructurasProyecto(fieldsOptionsSelected.value['projects']);
        }
    },
    { immediate: false }
);

const componentsObjects = ref([
    {
        name: 'BaseTable',
        folder: 'tables',
    },
    {
        name: 'BaseForm',
        folder: 'forms',
    },
    {
        name: 'SimpleBarChart',
        folder: 'charts',
    },
    {
        name: 'SimplePieChart',
        folder: 'charts',
    },
    {
        name: 'SimpleColumnChart',
        folder: 'charts',
    },
    {
        name: 'GroupedBarChart',
        folder: 'charts',
    },
    {
        name: 'GroupedColumnChart',
        folder: 'charts',
    },
    {
        name: 'AdvancedTimelineChart',
        folder: 'charts',
    },
    {
        name: 'BarChartWithMarkets',
        folder: 'charts',
    },
    {
        name: 'BarChartWithNegativeValues',
        folder: 'charts',
    },
    {
        name: 'ColumnChartWithMarkets',
        folder: 'charts',
    },
]);

const dataCharts = ref({});

const tabs = ref([
    {
        name: 'equipos',
        title: 'Equipos',
        icon: 'IconUsers',
        type: 'BaseTable',
        table: 'equipos',
    },
    {
        name: 'fechas_entrega',
        title: 'Fechas de entrega',
        icon: 'IconCalendar',
        type: 'BarChartWithMarkets',
    },
    {
        name: 'avance_proyectos',
        title: 'Avance Proyectos',
        icon: 'IconPieChart',
        type: 'SimplePieChart',
    },
    {
        name: 'avance_estructuras',
        title: 'Avance Estructuras',
        icon: 'IconBarChart',
        type: 'GroupedColumnChart',
    },
    {
        name: 'avance_etapas',
        title: 'Avance Etapas',
        icon: 'IconLineChart',
        type: 'GroupedBarChart',
    },
    {
        name: 'cumplimiento_actividades',
        title: 'Cumplimiento Actividades',
        icon: 'IconBarChart',
        type: 'ColumnChartWithMarkets',
    },
    {
        name: 'ocupacion_personal',
        title: 'Ocupación Personal',
        icon: 'IconOccupation',
        type: 'AdvancedTimelineChart',
    },

])

//Watch para actualizar las estructuras cuando cambian los proyectos seleccionados
watch(() => fieldsOptionsSelected.value['projects'], (newValue) => { // Getter que devuelve el valor reactivo () => 

    if (newValue?.length > 0) {

        fieldsOptionsSelected.value['structures'] = (fieldsOptionsSelected.value['structures'] && fieldsOptionsSelected.value['structures'].length > 0) ? fieldsOptionsSelected.value['structures'].filter((structure) => {
            return newValue.some((project) => project.id === structure.proyecto_id);
        }) : [];
    }

    if (newValue?.length === 0) {
        fieldsOptionsSelected.value['structures'] = [];
    }

}, { immediate: false });


const isFieldDisabled = (fieldName) => {
    if ((fieldName === 'structures' && (!fieldsOptionsSelected.value['projects'] || fieldsOptionsSelected.value['projects']?.length === 0))) {
        return true
    }
    return false
}

const isApplyDisabled = computed(() => {
    return (!fieldsOptionsSelected.value['projects'] || fieldsOptionsSelected.value['projects'].length === 0) || ((!fieldsOptionsSelected.value['structures'] || fieldsOptionsSelected.value['structures'].length === 0) && isNecessaryStructures.value);
});


watch(showTab, (newValue, oldValue) => {
    dataCharts.value[tabs.value[newValue].name] = []
    dataCharts.value[tabs.value[oldValue].name] = []
});

const apply = async () => {
    try {
        setAppLoader(true);
        if (tabs.value[showTab.value].name === 'equipos') {
            dataCharts.value[tabs.value[showTab.value].name] = fieldsOptionsSelected.value['projects']
            setAppLoader(false);
            return
        }

        const response = await fetchDataTabDashboard(tabs.value[showTab.value].name, fieldsOptionsSelected.value)

        console.log('Respuesta de la API:', response.data);

        dataCharts.value[tabs.value[showTab.value].name] = response.data
        setTimeout(() => {
            setAppLoader(false);
        }, 1000);

    } catch (error) {
        console.error('Error al aplicar los filtros:', error);
        setAppLoader(false);
    }

};

const showField = (fieldName) => {
    if (fieldName === 'structures') {
        return isNecessaryStructures.value
    }
    return true;
};

const necessaryStructuresOnTabsMap = ['avance_estructuras', 'avance_etapas'];
const isNecessaryStructures = computed(() => {
    return necessaryStructuresOnTabsMap.includes(tabs.value[showTab.value].name);
});

const isShowTab = (tabName) => {
    return dataCharts.value[tabName].length > 0
};

const setAppLoader = (value) => {
    isLoadingApp.value = value;
};
</script>
<style>
.tab-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>