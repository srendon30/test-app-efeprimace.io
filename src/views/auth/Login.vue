<template>
    <main>
        <div class="h-full flex justify-between  border-blue-500">
            <div class="w-0 md:w-1/3 wrapper flex items-center justify-center  border-orange-500">
            </div>
            <div class="w-full md:w-3/4 wrapper flex items-center justify-center  border-red-500">
                <div class="w-full flex-2/3 wrapper flex items-center justify-center  border-yellow-500">
                    <div class="w-full max-w-md p-8 rounded-xl shadow-md border border-solid border-color-identity">
                        <img alt="Vue logo" class="w-full h-28 " src="@/assets/logo-fc-orange.svg" />
                        <br>
                        <h2 class="text-2xl font-bold text-center text-identity">PIIAC 3.0</h2>
                        <h6 class="font-semi-bold text-center text-identity">Plataforma Inteligente Interactiva de
                            Acción y Control</h6>
                        <form @submit.prevent="login" class="mt-8 space-y-6">
                            <!-- Email -->
                            <div class="relative">
                                <label for="email" class="block text-sm font-medium text-identity">Email</label>
                                <input id="email" name="email" v-model="email" type="email" required autocomplete="on"
                                    class="text-gray-900 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <!-- Password -->
                            <div class="relative">
                                <label for="password" class="block text-sm font-medium text-identity">Password</label>
                                <div class="relative">
                                    <input id="password" name="password" v-model="password"
                                        :type="showPassword ? 'text' : 'password'" required autocomplete="on"
                                        class="text-gray-900 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm pr-10" />
                                    <span class="absolute top-0 right-0 mt-2 mr-4 cursor-pointer">
                                        <IconEye v-if="!showPassword" class="text-gray-900 w-6 h-6 cursor-pointer"
                                            @click="showPassword = !showPassword" />
                                        <IconEyeHide v-else class="text-gray-900 w-6 h-6 cursor-pointer"
                                            @click="showPassword = !showPassword" />
                                    </span>
                                </div>
                            </div>
                            <!-- Error Message -->
                            <div v-if="errorMessage"
                                class="flex items-center justify-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                                role="alert">
                                <span class="font-medium">{{ errorMessage }}</span>
                            </div>
                            <!-- Remember Me -->
                            <!-- <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember_me" type="checkbox" v-model="rememberMe"
                                        class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                                    <label for="remember_me"
                                        class="ml-2 block text-sm text-orange-400">Recuérdame</label>
                                </div>
                            </div> -->
                            <!-- Sign in -->
                            <div class="grid justify-items-center">
                                <button v-if="isLoadingAuth" type="button"
                                    class="mb-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    disabled>
                                    <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Iniciando Sesión...
                                </button>
                                <button v-else type="submit"
                                    class="mb-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                        <div class="flex justify-center text-sm">
                            <button @click="goToResetPassword"
                                class="font-medium text-orange-600 hover:text-orange-500">¿Olvidaste tu
                                contraseña?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth"
import { useFeatureFlagsStore } from "@/stores/featureFlags";
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import IconEye from "@/components/icons/IconEye.vue";
import IconEyeHide from "@/components/icons/IconEyeHide.vue";

const router = useRouter();
const authStore = useAuthStore();
const featureFlagsStore = useFeatureFlagsStore();
const { isLoadingAuth } = storeToRefs(useAuthStore())

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('')
const showPassword = ref(false);

const login = async () => {
    isLoadingAuth.value = true

    const response = await authStore.login({ email: email.value, password: password.value });

    if (authStore.isAuthenticated) {
        await authStore.fetchUser();
        await featureFlagsStore.loadFeatureFlags();
    }

    setTimeout(async () => {
        if (response.success && authStore.isAuthenticated) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: response.message,
                showConfirmButton: false,
                timer: 2000,
            });
            router.push({ name: "home" });

        } else if (!response.success) {
            errorMessage.value = response.message
            setTimeout(() => {
                errorMessage.value = ''
            }, 2000);
        }
        isLoadingAuth.value = false
    }, 500);
};


const register = async () => {
    await authStore.register({ email: email.value, password: password.value });
}

const goToResetPassword = () => {
    router.push({ name: "reset-password" });
}
</script>
