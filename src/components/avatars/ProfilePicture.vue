<template>
  <ImageProfile alt="Profile" :styles="profile" imageName="dr.andrescanchica.png" width="150" height="0"/>
</template>

<script setup>
import ImageProfile from '@/components/avatars/ImageProfile.vue'
import { ref, reactive } from "vue"

const profile = reactive({
  'margin' : 'auto auto',
  'display': 'flex',
})
</script>