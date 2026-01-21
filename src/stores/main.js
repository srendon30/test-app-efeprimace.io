import { ref, computed, watch, getCurrentInstance } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export const useMainStore = defineStore("main", () => {
  const isDarkMode = ref(localStorage.getItem("theme") === "dark" || false);
  const mobileBreakpoint = ref(768);
  const { isAppReady } = storeToRefs(useAuthStore());
  //const backendUrlFC = import.meta.env.VITE_APP_BACKEND_URL_FC;
  const backendUrlFC = import.meta.env.VITE_API_URL;
  const isSidebarCollapsed = ref(true);
  const currentScreenWidth = ref(window.innerWidth);

  const router = useRouter();
  const currentRouteName = computed(() => router.currentRoute.value.name);

  const currentBackground = isAppReady.value
    ? ref("")
    : ref("/videos/fc-bg-login.webm");

  const isMobile = computed(() => {
    return currentScreenWidth.value < mobileBreakpoint.value;
  });

  const updateScreenWidth = () => {
    currentScreenWidth.value = window.innerWidth;
  };

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    isDarkMode.value ? applyDarkMode() : removeDarkMode();
  };

  const applyDarkMode = () => {
    localStorage.setItem("theme", "dark");
    addRemoveDarkClass("add");
  };

  const removeDarkMode = () => {
    localStorage.setItem("theme", "light");
    addRemoveDarkClass("remove");
  };

  const addRemoveDarkClass = (action) => {
    action === "add"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  };

  watch(isAppReady, (newValue, oldValue) => {
    currentBackground.value = newValue ? "" : "/videos/fc-bg-login.webm";
  });

  watch(currentRouteName, (newValue, oldValue) => {
    if (isAppReady.value && newValue === "home") {
      currentBackground.value = "/videos/home.webm";
    } else if (isAppReady.value) {
      currentBackground.value = "";
    }
  });
  // watch(isDarkMode, (newValue) => {
  //   currentBackground.value = newValue ? "" : "";
  // });
  const slug = (string) => {
    string = string.normalize("NFD");
    string = string.replace(/[\u0300-\u036f]/g, "");
    string = string.replace(/[^a-zA-Z0-9\s]/g, "");
    return string.replace(/\s+/g, "-").toLowerCase();
  };
  
  return {
    mobileBreakpoint,
    backendUrlFC,
    isSidebarCollapsed,
    isMobile,
    currentBackground,
    currentScreenWidth,
    isDarkMode,
    toggleSidebar,
    toggleDarkMode,
    applyDarkMode,
    removeDarkMode,
    updateScreenWidth,
    slug,
  };
});

//export const backendUrlFC = import.meta.env.VITE_APP_BACKEND_URL_FC;
