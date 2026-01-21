<template>
    <div :class="['main-content']">
        <vue-navigation-bar ref="vnb2" :options="navbarOptions" @vnb-item-clicked="vnbItemClicked">
            <template #custom-section>
                <div v-if="isMobile ? true : false" class="pb-2 flex justify-center items-center">
                    <img class="object-cover rounded-full ring"
                        :class="['profile-width', 'profile-height', isDarkMode ? 'ring-gray-300' : 'ring-gray-900']"
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                        alt="">
                </div>
                <div class="flex flex-wrap justify-end w-full rounded-xl"
                    :class="isMobile ? 'bg-black border-color-identity flex-row-reverse' : 'flex-row items-center'">
                    <!-- Dark mode -->
                    <div class="md:m-2"
                        :class="isMobile ? 'basis-1/4 flex justify-center items-center border-l border-gray-200' : ''">
                        <button @click="toggleDarkMode"
                            class="relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 flex items-center p-1">
                            <!-- Switch Circle -->
                            <div :class="{ 'translate-x-8': isDarkMode }"
                                class="relative w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center">
                                <!-- Sun Icon for Light Mode -->
                                <component :is="iconsForm['IconSun']" v-if="!isDarkMode"
                                    class="w-4 h-4 transition-opacity duration-300 absolute text-yellow-500" />
                                <!-- Moon Icon for Dark Mode -->
                                <component :is="iconsForm['IconMoon']" v-else
                                    class="w-4 h-4 transition-opacity duration-300 absolute text-orange-500" />
                            </div>
                        </button>
                    </div>
                    <!-- Usuario Menu -->
                    <div id="myUserMenu" class="relative inline-block md:m-2"
                        :class="isMobile ? 'basis-3/4 flex justify-center' : ''">
                        <!-- Usuario -->
                        <div @click="toggleUserMenu"
                            class="flex justify-center items-center w-full p-2 gap-x-2 cursor-pointer bg-black rounded-xl"
                            :class="!isMobile ? 'border-color-identity' : ''">
                            <!-- Foto Perfil -->
                            <div v-if="isMobile ? false : true">
                                <img class="object-cover rounded-full ring ring-gray-300"
                                    :class="['profile-width', 'profile-height']"
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                                    alt="">
                            </div>
                            <!-- Nombre y Email -->
                            <div>
                                <div class="flex flex-row justify-center items-center">
                                    <!-- User Name -->
                                    <h1 class="text-identity basis-4/5 text-sm md:text-lg font-semibold capitalize">
                                        {{ userName }}
                                    </h1>
                                    <!-- Icon Dropdown -->
                                    <svg class="text-identity basis-1/5 w-5 h-5" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path v-if="isOpen"
                                            d="M12 8.28799L5.98999 14.70199L7.40399 16.115L12 11.513L16.597 16.115L18.01 14.70199L12 8.28799Z"
                                            fill="currentColor"></path>
                                        <path v-else
                                            d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                                <p class="text-xs text-identity-orange">{{ userEmail }}</p>
                            </div>
                        </div>
                        <!-- Dropdown menu -->
                        <transition name="fade">
                            <div v-if="isOpen"
                                class="w-full absolute right-0 z-20 py-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-black"
                                :class="[isDarkMode ? 'border-color-orange' : 'border-color-identity-dark', isMobile ? 'margin-top-dropdown' : 'mt-2']">
                                <!-- Perfil -->
                                <a href="#"
                                    class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-orange-600 dark:hover:text-white">
                                    <component :is="iconsForm['IconProfile']" class="w-5 h-5 mx-1" />
                                    <span class="mx-1">
                                        Perfil
                                    </span>
                                </a>
                                <!-- Configuración -->
                                <a @click="goTo('/configuracion')"
                                    class="cursor-pointer flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-orange-600 dark:hover:text-white">
                                    <component :is="iconsForm['IconSettings']" class="w-5 h-5 mx-1" />

                                    <span class="mx-1">
                                        Configuración
                                    </span>
                                </a>
                                <!-- Divider -->
                                <hr class="border-gray-200 dark:border-gray-700 ">
                                <!-- Refresh Token -->
                                <!-- <a @click="refreshToken"
                                    class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-indigo-600 dark:hover:text-white">
                                    <component :is="iconsForm['IconRefresh']" class="w-5 h-5 mx-1" />
                                    <span class="mx-1">Refresh Token</span>
                                </a> -->

                                <!-- Logout -->
                                <a href="#" @click="logout"
                                    class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-orange-600 dark:hover:text-white">
                                    <div v-show="isLogingOut" class="flex flex-row">
                                        <svg class="animate-spin w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z">
                                            </path>
                                        </svg>
                                        <span class="mx-1">
                                            Cerrando sesión...
                                        </span>
                                    </div>
                                    <div v-show="!isLogingOut" class="flex flex-row">
                                        <svg class="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
                                                fill="currentColor"></path>
                                        </svg>
                                        <span class="mx-1">
                                            Cerrar sesión
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </transition>
                    </div>
                </div>
            </template>
        </vue-navigation-bar>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, defineAsyncComponent, markRaw } from 'vue'
import brandImage from '../../assets/logo-fc-orange.svg'
import { storeToRefs } from 'pinia';
import { useMainStore } from "@/stores/main"
import { useAuthStore } from "@/stores/auth"
import { useIconStore } from "@/stores/icons"
import { watch } from 'vue';
import { computed } from 'vue';
import { showErrorMessage } from '@/helpers/errors';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const { userAuth } = storeToRefs(useAuthStore())
const { mobileBreakpoint, isMobile, isDarkMode } = storeToRefs(useMainStore())
const { toggleDarkMode } = useMainStore()

const formIconNames = ref(['IconSettings', 'IconSun', 'IconMoon', 'IconProfile'])
const { iconsForm, loadFormIcons } = useIconStore()

onMounted(async () => {
    await loadFormIcons(formIconNames.value);
    isMobile.value ? structureMenu() : clearMenu()
    document.addEventListener('click', handleClickOutside);
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const isLogingOut = ref(false)
const isOpen = ref(false)

const userName = computed(() => {
    const user = JSON.parse(userAuth.value)
    return user.user.name
})

const userEmail = computed(() => {
    const user = JSON.parse(userAuth.value)
    return user.user.email
})

const toggleUserMenu = () => {
    isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
    nextTick(() => {
        const myUserMenuDiv = document.getElementById('myUserMenu');
        if (myUserMenuDiv && !myUserMenuDiv.contains(event.target)) {
            isOpen.value = false;
        }
    })
};

const structureMenu = () => {
    const user = JSON.parse(userAuth.value)

    for (const moduleKey in user.permissions.modules) {
        const module = user.permissions.modules[moduleKey];

        for (const optionKey in module) {
            const option = module[optionKey]
            if (option.has_child && option.child_options.length > 0) {

                const childs = []
                option.child_options.forEach(child => {
                    childs.push({
                        // isLinkAction: true,
                        type: "link",
                        text: child.name,
                        // subText: "Stupid corporate wet blankets. Like booze ever killed anyone.",
                        path: '/' + option.slug + '/' + child.slug,
                        iconLeft: '<i class="fa fa-user fa-fw"></i>'
                    })
                    childs.push({
                        type: "hr",
                    })
                });
                // Add the parent option
                navbarOptions.value.menuOptionsLeft.push({
                    type: "link",
                    text: option.name,
                    subMenuOptions: childs
                })

            } else {
                navbarOptions.value.menuOptionsLeft.push({
                    type: "link",
                    text: option.name,
                    path: { name: option.slug },
                    iconRight: '<i class="fa fa-user fa-fw"></i>',
                })
            }
        }
    }
}

const clearMenu = () => {
    navbarOptions.value.menuOptionsRight = []
    navbarOptions.value.menuOptionsLeft = []
}

watch(isMobile, (newValue) => {
    newValue ? structureMenu() : clearMenu()
})

const vnb2 = ref(null)

const navbarOptions = ref({
    elementId: "main-navbar",
    isUsingVueRouter: true,
    mobileBreakpoint: mobileBreakpoint,
    brandImagePath: "/home",
    brandImage,
    brandImageAltText: "brand-image",
    collapseButtonOpenColor: "#F6EEEA",
    collapseButtonCloseColor: "#F6EEEA",
    showBrandImageInMobilePopup: true,
    ariaLabelMainNav: "Home",
    tooltipAnimationType: "shift-away",
    tooltipPlacement: "bottom",
    menuOptionsLeft: [],
    menuOptionsRight: [
        // {
        //     type: "button",
        //     text: "logout",
        //     isLinkAction: true,
        //     iconRight: '<svg id="i-arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"> <path d="M22 6 L30 16 22 26 M30 16 L2 16" /> </svg>',
        //     class: "button-red"
        // }
    ]
})

const vnbItemClicked = async (text) => { }

const goTo = (path) => {
    router.push(path)
    vnb2.value.closeMobilePopup()
}

const logout = async () => {
    try {
        isLogingOut.value = true
        await authStore.logout()
        setTimeout(() => {
            isLogingOut.value = false
        }, 500)
    } catch (error) {
        showErrorMessage(error)
    }
}

const refreshToken = async () => {
    try {
        await authStore.refreshToken()
    } catch (error) {
        showErrorMessage(error)
    }
}

const invalidateToken = async () => {
    try {
        await authStore.invalidateToken()
    } catch (error) {
        showErrorMessage(error)
    }
}
</script>

<style lang="scss">
@use "sass:color";

.vnb {
    background-color: black !important;

    .button-red {
        background: #ff3b30;

        &:hover {
            // background: darken(#ff3b30, 10%);
            background: color.adjust(#ff3b30, $lightness: -10%);
        }
    }

    .button-orange {
        background: #EC7522;

        &:hover {
            // background: darken(orange, 10%);
            background: color.adjust(#EC7522, $lightness: -10%);
        }
    }

    &__brand-image-wrapper {
        &__link {
            &__image {
                height: 70px !important;
                max-height: 200px !important;
                width: 200px !important;
                max-width: 200px !important;
            }
        }
    }

    &__menu-options {
        &--left {}

        &--right {}

        &__option {
            &__link {
                &:hover {}

                &__icon {
                    svg {}

                    &--left {}

                    &--right {}
                }
            }

            &__arrow {
                &--hover {}
            }

            &__button {
                &__icon {
                    svg {}

                    &--left {}

                    &--right {}
                }
            }

            &__spacer {}
        }
    }

    &__sub-menu-options {
        background-color: #F6EEEA !important; // Cambiar el fondo de los submenús

        &__option {
            &__link {
                background-color: #F6EEEA !important; // Cambiar el fondo de cada opción de submenú
                border-left: 3px solid #DBC7AC !important;

                &:hover {
                    // background-color: darken(#DBC7AC, 10%) !important; // Hacer más oscuro el fondo al pasar el cursor (opcional)
                    background-color: color.adjust(#DBC7AC, $lightness: -10%) !important; // Hacer más oscuro el fondo al pasar el cursor (opcional)
                    border-left: 3px solid #615C59 !important;
                }

                &__icon {
                    svg {
                        fill: #262423; // Cambiar el color del ícono si es necesario
                    }

                    &--left,
                    &--right {
                        color: #262423;
                    }
                }

                &__text-wrapper {

                    &__text,
                    &__sub-text {
                        color: #615C59; // Cambiar el color del texto
                    }
                }
            }

            &__hr {
                border-color: white; // Cambiar el color del separador si es necesario
            }
        }
    }
}
</style>

<style lang="scss">
.vnb {

    &__collapse-button {
        &:hover {}

        &__image {}
    }

    &__popup {
        @apply h-full flex flex-col;

        border-radius: 10%;

        &__top {
            @apply flex-shrink-0;

            background-color: black;

            &__image {
                margin: auto auto !important;
                padding: 0.2rem;
                height: 70px !important;
                max-height: 140px !important;
                width: 100 !important;
                max-width: 200px !important;
            }

            &__close-button {
                &:hover {}

                &__image {}
            }
        }

        &__bottom {
            @apply flex-grow overflow-y-auto;

            background-color: var(--background-popup-nav-bar, #F6EEEA) !important;

            &__custom-section {}

            &__menu-options {
                &__option {
                    &:not(:last-child) {}

                    &__link {
                        &:hover {
                            color: black !important;
                            background-color: var(--hover-background-option-popup) !important;
                            border-left: 3px solid #615C59 !important;
                        }

                        & {
                            color: var(--color-option-link-popup) !important;
                        }


                        &--no-highlight {
                            color: black !important;

                            background-color: var(--section-background);

                            &:hover {}
                        }

                        &__icon {
                            svg {}

                            &--left {}

                            &--right {}
                        }
                    }
                }
            }

            &__sub-menu-options {
                &__option {
                    &__link {
                        color: var(--color-sub-option-link-popup) !important;

                        &:hover {
                            color: black !important;
                            background-color: var(--hover-background-option-popup) !important;
                            border-left: 3px solid #615C59 !important;
                        }

                        &__sub-text {}
                    }
                }
            }
        }


    }
}

.vnb-button {
    &:hover {}
}
</style>


<style>
.main-content {
    flex: 1;
    transition: margin-left 0.3s;
}

.profile-width {
    widows: 4.25rem;
}

.profile-height {
    height: 4.25rem;
}

.margin-top-dropdown {
    margin-top: 4.750rem;
}
</style>