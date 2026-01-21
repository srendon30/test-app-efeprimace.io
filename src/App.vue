<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import Footer from "./components/helpers/Footer.vue";
import AppLayout from "./components/layout/AppLayout.vue";
import { useMainStore } from "@/stores/main"
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from 'pinia';

const { isSidebarCollapsed, currentBackground, currentScreenWidth, isMobile, isDarkMode } = storeToRefs(useMainStore())
const { updateScreenWidth, applyDarkMode, removeDarkMode } = useMainStore()
const { isAppReady, isLoadingAuth, isAuthenticated, userAuth, token } = storeToRefs(useAuthStore())

const env = ref(import.meta.env.VITE_APP_ENV);

onMounted(() => {
	console.log('Environment:', env.value);
	window.addEventListener('resize', function () {
		updateScreenWidth()
	});
	getCurrentTheme()
	getCurrentBackground()
});

onUnmounted(() => {
	window.removeEventListener('resize', function () {
		updateScreenWidth()
	});
});

const currentBackgroundClass = computed(() => {
	return isAppReady.value ? (isDarkMode.value ? 'background-app-dark' : 'background-app-light') : 'background-app-dark'
})

const sidebarClass = computed(() => ({
	'hide-sidebar': !isAppReady.value || isMobile.value,
	'collapsed-sidebar': isAppReady.value && !isMobile.value && isSidebarCollapsed.value,
	'expanded-sidebar': isAppReady.value && !isMobile.value && !isSidebarCollapsed.value
}));

const getCurrentTheme = () => {
	isDarkMode.value ? applyDarkMode() : removeDarkMode();
}

const getCurrentBackground = () => {
	document.body.className = `main-app ${currentBackgroundClass.value}`;
}

watch(currentBackgroundClass, (newClass) => {
	document.body.className = `main-app ${newClass}`;
});
</script>

<template>
	<video-background class="video-background" :src="currentBackground" poster="" :sources="[
		{ src: currentBackground, res: 900, autoplay: true },
		{ src: currentBackground, res: 638, autoplay: true, poster: '' }
	]">
		<div class="app-container">
			<AppLayout />
			<div :class="sidebarClass" class="main-content">
				<router-view v-slot="{ Component }" class="router-view"
					:class="[!isAppReady ? 'p-0' : 'p-12 border-color-identity']">
					<transition name="fade" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
				<Footer v-if="isAppReady" />
			</div>
		</div>
	</video-background>
</template>

<style scoped>
.app-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	/* Asegura que el contenedor ocupe toda la altura de la pantalla */
}

.main-content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding-bottom: calc(5rem);
	/* Ajusta este valor a la altura del footer */
	overflow: auto;
}

.hide-sidebar {
	margin-left: 0px;
}

.collapsed-sidebar {
	margin-left: 65px;
}

.expanded-sidebar {
	margin-left: 290px;
}

.router-view {
	flex-grow: 1;
	width: calc(100%);
	height: calc(100% - 5rem);
	/* Ajusta la altura considerando el footer */
	overflow: auto;
	/* Permite el desplazamiento si es necesario */
}

header {
	line-height: 1.5;
	max-height: 100vh;
	padding: 3rem;
}

.video-background {
	min-height: 100vh;
	min-width: 100vw;
}

nav {
	width: 100%;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	/* .logo {
    margin: 0 2rem 0 0;
  } */

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		/* font-size: 1rem; */
		padding: 1rem 0;
		margin-top: 1rem;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
