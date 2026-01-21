import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import VideoBackground from "vue-responsive-video-background-player";

//FontAwesomeIcons
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fas, fab, far);

//Sidebar
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

//Navbar
import VueNavigationBar from "vue-navigation-bar";
import "vue-navigation-bar/dist/vue-navigation-bar.css";

//Sweetalert2
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

//Multiselect
import Multiselect from "vue-multiselect";
import "./assets/css/custom-multiselect.css";

//VueDatePicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "./assets/css/custom-vuedatepicker.css";

//Moment
import momentPlugin from "./plugins/moment";

//FloatingVue
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

//Notifier
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

//Vue scroll horizontal 
import VueHorizontal from "vue-horizontal";

//Vue ApexCharts
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
const pinia = createPinia();

// Plugins
app.use(momentPlugin);

app.use(pinia);
app.use(router);

app.use(VueSidebarMenu);
app.use(VueSweetalert2);
app.use(FloatingVue);
app.use(Vue3Toastify);
app.use(VueApexCharts);

// Components
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("vue-navigation-bar", VueNavigationBar);
app.component("Multiselect", Multiselect);
app.component("VideoBackground", VideoBackground);
app.component("VueDatePicker", VueDatePicker);
app.component("vue-horizontal", VueHorizontal);

//Mount
app.mount("#app");

export default app;
