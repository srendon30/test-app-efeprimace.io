<template>
	<img :alt="alt" :src="imageURL" :style="styles" :width="width" :height="height"/>
</template>
  
<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps(["alt", "imageName", "styles", "width", "height"])

const imageURL = computed(() => new URL("/images/" + props.imageName, import.meta.url).href)
</script>