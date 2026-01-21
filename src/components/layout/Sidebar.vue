<template>
	<div :class="['sidebar', { 'collapsed': collapsed }]">
		<sidebar-menu :menu="menu" :collapsed="collapsed" @update:collapsed="onToggleCollapse" @item-click="onItemClick"
			@show-child="false">
			<template v-slot:header>
				<div class="flex items-center justify-center">
					<button class="vsm--toggle-btn" @click="toggleSidebar">
						<span class="vsm--toggle-btn_default"></span><br>
					</button>
				</div>
				<div class="flex flex-row flex-wrap bg-black rounded-xl"
					:class="[!collapsed ? 'mx-2 my-4' : 'mt-4 mb-4']">
					<div class="flex justify-center basis-full">
						<img class="object-cover rounded-full ring ring-gray-300"
							:class="collapsed ? 'w-12 h-12' : 'w-20 h-20'"
							src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
							alt="">
					</div>
					<div v-if="!collapsed" class="flex flex-wrap justify-center items-center basis-full">
						<div class="basis-full flex justify-center pt-2">
							<h1 class="text-identity text-md font-semibold capitalize">
								{{ userName }}
							</h1>
						</div>
						<div class="basis-full flex justify-center">
							<p class="text-xs text-identity-orange">{{ userEmail }}</p>
						</div>
					</div>
				</div>
			</template>
			<!-- <template v-slot:footer>footer</template> -->
			<!-- <template v-slot:toggle-icon>toggle-icon</template> -->
		</sidebar-menu>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw } from 'vue'
import { defineProps } from 'vue';
import { useMainStore } from "@/stores/main"
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia";

defineProps({
	collapsed: Boolean
})

onMounted(() => {
	structureMenu()
})
const { toggleSidebar } = useMainStore()

const { isMobile } = storeToRefs(useMainStore())

const { userAuth } = storeToRefs(useAuthStore())

const userName = computed(() => {
	const user = JSON.parse(userAuth.value)
	return user.user.name
})

const userEmail = computed(() => {
	const user = JSON.parse(userAuth.value)
	return user.user.email
})

const menu = ref([])

const structureMenu = async () => {
	const user = JSON.parse(userAuth.value)

	for (const moduleKey in user.permissions.modules) {

		menu.value.push({
			header: moduleKey,
			hiddenOnCollapse: true
		})

		const module = user.permissions.modules[moduleKey];

		for (const optionKey in module) {
			const option = module[optionKey];

			if (option.has_child && option.child_options.length > 0) {

				const childs = []
				for (const child of option.child_options) {

					const childIcon = await import(`@/components/icons/${child.icon}.vue`)

					childs.push({
						href: '/' + option.slug + '/' + child.slug,
						title: child.name,
						icon: {
							element: markRaw(childIcon?.default)
							// element: 'font-awesome-icon',
							// attributes: {
							// 	icon: child.icon
							// }
							// // text: ''
						}
					})
				};

				const optionIcon = await import(`@/components/icons/${option.icon}.vue`)

				menu.value.push({
					title: option.name,
					child: childs,
					icon: {
						element: markRaw(optionIcon?.default),
						// attributes: {
						// 	icon: option.icon
						// }
						// text: ''
					}
				})
			} else {
				const optionIcon = await import(`@/components/icons/${option.icon}.vue`)

				menu.value.push({
					href: '/' + option.slug,
					title: option.name,
					icon: {
						element: markRaw(optionIcon?.default),
						// attributes: {
						// 	icon: option.icon,
						// }
						// text: ''
					}
				})
			}
		}
	}
}

const onToggleCollapse = () => {
	toggleSidebar()
}

const onItemClick = (event, item) => {
	if (event.isTrusted) {
		setTimeout(() => {
			const sidebarMenu = event.target.closest('ul');
			const menuItems = sidebarMenu.getElementsByClassName("vsm--item")
			Array.from(menuItems)
				.map(menuItem => ({
					menuItem: menuItem,
					itemLink: menuItem.getElementsByTagName('a')[0],
				}))
				.filter(({ itemLink }) => itemLink?.hasAttribute('aria-expanded') && itemLink?.getAttribute('aria-expanded') === 'true' && itemLink.innerText !== item.title)
				.map(({ itemLink }, index) => {
					itemLink.click();
				});
		}, 300);
	}
}
</script>

<style>
.v-sidebar-menu {}

.v-sidebar-menu.vsm_expanded {}

.v-sidebar-menu.vsm_collapsed {}

.v-sidebar-menu.vsm_rtl {}

.v-sidebar-menu .vsm--item {}

.v-sidebar-menu .vsm--link {}

.v-sidebar-menu .vsm--link_active {}

.v-sidebar-menu .vsm--link_hover {}

.v-sidebar-menu .vsm--link_open {}

.v-sidebar-menu .vsm--link_mobile {}

.v-sidebar-menu .vsm--link_level-[n] {}

.v-sidebar-menu .vsm--link_disabled {}

.v-sidebar-menu .vsm--title {}

.v-sidebar-menu .vsm--icon {
	padding: 0px !important;
}

.v-sidebar-menu .vsm--arrow {}

.v-sidebar-menu .vsm--arrow_open {}

.v-sidebar-menu .vsm--badge {}

.v-sidebar-menu .vsm--badge_default {}

.v-sidebar-menu .vsm--header {
	border-top: 0.5px solid #7A7878;
	border-bottom: 0.5px solid #7A7878;
	font-style: italic;
	background-color: #1b1b1b;
}

.v-sidebar-menu .vsm--dropdown .vsm--icon {
	height: 20px;
	width: 20px;
}

.v-sidebar-menu .vsm--dropdown {
	font-style: italic;
	border-bottom: 0.5px solid #7A7878;
}

.v-sidebar-menu .vsm--dropdown .vsm--item .vsm--link_active .vsm--icon {
	color: black;
}

.v-sidebar-menu .vsm--mobile-bg {}

.v-sidebar-menu .vsm--toggle-btn {}
</style>

<style>
.v-sidebar-menu {
	--vsm-primary-color: #F97316 !important;
	/* --vsm-base-bg: linear-gradient(90deg, rgba(219,199,172,1) 30%, rgba(181,165,145,1) 60%, rgba(97,92,89,1) 100%) !important; */
	--vsm-base-bg: black !important;
	--vsm-item-color: #F6EEEA !important;
	--vsm-item-active-color: black !important;
	--vsm-item-active-bg: #BABDBA !important;
	/* --vsm-item-active-line-color: var(--vsm-primary-color); */
	--vsm-item-active-line-color: #F6EEEA !important;
	--vsm-item-open-color: white !important;
	--vsm-item-hover-color: white !important;
	/* --vsm-item-open-bg: var(--vsm-primary-color); */
	--vsm-item-open-bg: #F97316 !important;
	/* --vsm-item-open-bg: #978778 !important; */
	--vsm-item-hover-bg: #F97316 !important;
	--vsm-icon-color: var(--vsm-item-color);
	--vsm-icon-bg: black !important;
	--vsm-icon-active-color: black !important;
	--vsm-icon-active-bg: #BABDBA !important;
	/* icono */
	--vsm-icon-open-color: black !important;
	--vsm-icon-open-bg: white !important;
	--vsm-mobile-item-color: #fff !important;
	--vsm-mobile-item-bg: var(--vsm-primary-color);
	--vsm-mobile-icon-color: var(--vsm-mobile-item-color);
	--vsm-mobile-icon-bg: transparent;
	--vsm-dropdown-bg: black !important;
	--vsm-header-item-color: #BABDBA !important;
	--vsm-toggle-btn-color: #F6EEEA !important;
	--vsm-toggle-btn-bg: orange !important;
	--vsm-item-font-size: 16px;
	--vsm-item-line-height: 35px;
	--vsm-item-padding: 10px 15px;
	--vsm-icon-height: 35px !important;
	--vsm-icon-width: 35px !important;
}

.vsm--toggle-btn {
	background-color: #1b1b1b !important;
}
</style>

<style>
.sidebar {
	width: 290px;
	transition: width 0.3s;
}

.sidebar.collapsed {
	width: 65px;
}
</style>
