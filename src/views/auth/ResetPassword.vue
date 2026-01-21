<template>
    <main>
        <div class="h-full flex justify-between border-blue-500">
            <div class="w-0 md:w-1/3 wrapper flex items-center justify-center border-orange-500">
            </div>
            <div class="w-full md:w-3/4 wrapper flex items-center justify-center border-red-500">
                <div class="w-full flex-2/3 wrapper flex items-center justify-center border-yellow-500">
                    <div class="w-full max-w-md p-8 rounded-xl shadow-md border border-solid border-color-identity">
                        <img alt="Vue logo" class="w-full h-28" src="@/assets/logo-fc-orange.svg" />
                        <br>
                        <h2 class="text-2xl font-bold text-center text-identity">Restablecer Contraseña</h2>
                        <h6 class="font-semi-bold text-center text-identity">Ingresa tu correo para recibir
                            instrucciones</h6>
                        <form @submit.prevent="resetPassword" class="mt-8 space-y-6">
                            <!-- Email -->
                            <div class="relative">
                                <label for="email" class="block text-sm font-medium text-identity">Email</label>
                                <input id="email" name="email" v-model="email" type="email" required autocomplete="on"
                                    class="text-gray-900 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>

                            <!-- Error Message -->
                            <div v-if="errorMessage"
                                class="flex items-center justify-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                                role="alert">
                                <span class="font-medium">{{ errorMessage }}</span>
                            </div>

                            <!-- Success Message -->
                            <div v-if="successMessage"
                                class="flex items-center justify-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
                                role="alert">
                                <span class="font-medium">{{ successMessage }}</span>
                            </div>

                            <!-- Submit -->
                            <div class="grid justify-items-center">
                                <button v-if="isLoading" type="button"
                                    class="mb-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    disabled>
                                    <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Enviando...
                                </button>
                                <button v-else type="submit"
                                    class="mb-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                    Enviar Instrucciones
                                </button>
                            </div>
                        </form>
                        <div class="flex justify-center text-sm">
                            <button @click="goToLogin" class="font-medium text-orange-600 hover:text-orange-500">
                                Volver al inicio de sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { ref } from 'vue';
import { useMainStore } from "@/stores/main";
import { HttpError } from '@/helpers/errors';
import { useRouter } from "vue-router";

const { backendUrlFC } = useMainStore()
const router = useRouter();

const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const resetPassword = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    if (!validateEmail(email.value)) {
        errorMessage.value = 'Por favor, ingresa un correo electrónico válido';
        isLoading.value = false;
        return;
    }

    try {
        const response = await fetch(`${backendUrlFC}/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new HttpError(data.message, response.status);
        }

        successMessage.value = data.message;
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const goToLogin = () => {
    console.log('goToLogin');
    router.push({ name: 'login' });
};
</script>