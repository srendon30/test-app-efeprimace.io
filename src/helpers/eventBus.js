// eventBus.js
import { reactive } from "vue";

export const eventBus = reactive({
  data: null,
});

export function sendDataViaEventBus(data) {
  localStorage.setItem("eventBusData", JSON.stringify(data));
  // console.log("-Data stored via eventBus");
}

export function getDataFromEventBus() {
  const data = localStorage.getItem("eventBusData");
  // console.log("-Data get from eventBus", data ?? null);
  eventBus.data = data ? JSON.parse(data) : null;
  return
}

export function clearDataFromEventBus() {
  localStorage.removeItem("eventBusData");
  eventBus.data = null;
  // console.log("-Data cleared from eventBus", eventBus.data);
}
