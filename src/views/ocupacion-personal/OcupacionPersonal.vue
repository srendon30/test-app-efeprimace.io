<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Ocupación Personal</h1>
        </div>
        <div class="flex overflow-x-auto whitespace-nowrap justify-center items-center w-full my-4">
            <button v-for="(tab, index) in tabs" @click="showTab = index"
                class="inline-flex items-center h-12 px-2 py-2 text-center sm:px-4 border-gray-900 dark:border-gray-300 rounded-t-md -px-1 dark:text-white whitespace-nowrap focus:outline-none"
                :class="[showTab === index ? (isDarkMode ? 'bg-orange-700 text-gray-300' : 'bg-identity-dark text-identity') : (isDarkMode ? 'text-gray-300' : 'text-identity-dark'), showTab === index ? 'border border-b-0' : 'border-b']">
                <component :is="iconsForm[tab.icon]" class="w-6 h-6 mx-1" />
                <span v-if="!isMobile" class="mx-1 text-sm sm:text-base">
                    {{ tab.title }}
                </span>
            </button>
        </div>
        <div v-for="(tab, index) in tabs">
            <div v-if="showTab === index">
                <BaseForm v-if="tab.type === 'form'" :type-form="tab.form" :icons-view="[]"
                    :action-selected="tab.action_selected" :row-selected="tab.row_selected" />
                <BaseTable v-if="tab.type === 'table'" :table="tab.form" :icons-view="[]" />
            </div>
        </div>
    </main>
</template>
<script setup>
import { ref, onMounted, defineAsyncComponent, markRaw } from 'vue';
import { storeToRefs } from 'pinia';
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { useIconStore } from '@/stores/icons'

const { isDarkMode, isMobile } = storeToRefs(useMainStore())
const { userAuth } = storeToRefs(useAuthStore())

const { iconsForm, loadFormIcons } = useIconStore();
const formIconNames = ref(['IconProject', 'IconArea', 'IconCharge', 'IconProfile', 'IconCalendar2', 'IconCalendar', 'IconCompass']);

onMounted(async () => {
    await loadFormIcons(formIconNames.value);
});
const user = JSON.parse(userAuth.value)

const showTab = ref(0);

const tabs = ref([
    {
        title: 'Ingenieros',
        icon: 'IconProject',
        type: 'table',
        form: 'ingenieros',
        // row_selected: user.user.model
    },
    {
        title: 'Delineantes',
        icon: 'IconCompass',
        type: 'table',
        form: 'delineantes',
        // row_selected: user.user.model
    },
    {
        title: 'Cantidades',
        icon: 'IconArea',
        type: 'table',
        form: 'cantidadesObra',
        // row_selected: user.user.model
    },
    {
        title: 'Practicantes Ingeniería',
        icon: 'IconProject',
        type: 'table',
        form: 'practicantesIngenieria',
        // row_selected: user.user.model
    },
    {
        title: 'Practicantes Dibujo',
        icon: 'IconCompass',
        type: 'table',
        form: 'practicantesDibujo',
        // row_selected: user.user.model
    },
])
</script>