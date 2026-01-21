<template>
	<main class="flex justify-center items-center">
		<div class="wrapper flex items-center justify-center w-full">
			<img alt="F'C logo" class="w-full md:w-1/4 h-42 " :src="currentLogo" />
		</div>
	</main>
</template>
<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main'
import logoWhite from '@/assets/logo-fc-white.svg';
import logoBlack from '@/assets/logo-fc-black.svg';
import logoGray from '@/assets/logo-fc-gray.svg';
import logoOrange from '@/assets/logo-fc-orange.svg';
const { isDarkMode, isMobile } = storeToRefs(useMainStore())

const currentLogo = computed(() => {
	return isDarkMode.value ? logoOrange : logoGray;
})
</script>

<style scoped>
.btn-whatsapp {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	background-color: #25d366;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.btn-whatsapp:hover {
	background-color: #128c7e;
}

.btn-whatsapp-disabled {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	background-color: #128c7e;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: not-allowed;
	transition: background-color 0.3s ease;
	opacity: 0.6;
	pointer-events: none;
}
</style>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background-color: #ffffff;
	padding: 20px;
	border-radius: 8px;
	width: 50%;
}

.bg-modal {
	background-color: #F6EEEA;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.spinner {
	display: inline-block;
	border: 2px solid #f3f3f3;
	border-radius: 50%;
	border-top: 2px solid #3498db;
	width: 16px;
	height: 16px;
	animation: spin 1s linear infinite;
}
</style>
