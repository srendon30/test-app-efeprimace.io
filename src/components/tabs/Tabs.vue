<template>
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
    <hr class="my-4">
    <div v-for="(tab, index) in tabs">
        <div v-if="showTab === index">
            <component v-if="tab.component" :is="tab.component" v-bind="tab.props"
                v-on="hasDynamicEvent(tab.component) ? { 'dynamicEvent': handleDynamicEvent } : {}" />

            <div v-else-if="tab.childs">
                <div v-for="(child, childIndex) in tab.childs" :key="childIndex"
                    class="flex flex-col mb-4 justify-center items-center">
                    <h3 class="text-gray-800 my-4">{{ child.title }}</h3>
                    <component :is="child.component" v-bind="child.props" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, markRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main'
import { useIconStore } from '@/stores/icons'

const { isDarkMode, isMobile } = storeToRefs(useMainStore())

const { iconsForm, loadFormIcons } = useIconStore();

const showTab = ref(0);

onMounted(() => {
    loadFormIcons(props.icons);
});

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    icons: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['dynamicEvent']);

const handleDynamicEvent = (event) => {
    emit('dynamicEvent', event);
};

const hasDynamicEvent = (component) => {
    return component?.emits?.includes('dynamicEvent');
};

</script>