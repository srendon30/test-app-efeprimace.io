<template>
    <div class="footer flex items-center justify-center p-2">
        <div class="text-identity flex flex-row items-center">
            <strong class="mr-2">Plataforma PIIAC ® {{ currentYear }}</strong> |
            <strong class="ml-2">Medellín, Colombia</strong>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="1em" height="1em" class="ml-1">
                <rect width="120" height="80" fill="#FCD116" />
                <rect y="40" width="120" height="20" fill="#003893" />
                <rect y="60" width="120" height="20" fill="#CE1126" />
            </svg>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMomentStore } from "@/stores/moment"
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main'

const router = useRouter()
onMounted(() => { })
const { currentYear, locale } = storeToRefs(useMomentStore())

</script>
<style>
/* la clase .footer toma el valor de --sidebar-width de la clase aplicada ya sea .hide-sidebar, .collapsed-sidebar, .expanded-sidebar. PD: estás clases vienen aplicadas por herencia desde App.vue */
.footer {
    height: 5rem;
    background-color: black;
    bottom: 0;
    position: absolute;
    width: calc(100% - var(--sidebar-width));
    transition: width 0.3s;
    /* border: 1.5px solid red; */
}

.hide-sidebar {
    --sidebar-width: 0px;
}

.collapsed-sidebar {
    --sidebar-width: 65px;
}

.expanded-sidebar {
    --sidebar-width: 290px;
}
</style>
