<template>
    <div
        class="wrapper flex items-center justify-center bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg shadow-md">
        <div class="flex items-center">
            <svg class="w-6 h-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
            </svg>
            <p class="text-yellow-700 font-semibold">{{ props.description }}</p>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    description: {
        type: String,
        default: 'Acceso a esta funcionalidad no disponible.'
    }
});
</script>
