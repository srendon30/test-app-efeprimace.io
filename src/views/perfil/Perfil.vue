<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Perfil Usuario</h1>
        </div>
        <div class="py-8 flex justify-center items-center">
            <img class="object-cover rounded-full ring"
                :class="['w-32', 'h-32', isDarkMode ? 'ring-gray-300' : 'ring-gray-900']"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt="">
        </div>
        <BaseForm :type-form="'persona'" :icons-view="['IconUserPlus']" />
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
</script>