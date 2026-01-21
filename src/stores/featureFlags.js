import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

export const useFeatureFlagsStore = defineStore("featureFlags", () => {

  const { token } = storeToRefs(useAuthStore());

  const featureFlags = ref(
    JSON.parse(localStorage.getItem("featureFlags") || "{}")
  );

  const loadFeatureFlags = async () => {
    try {
      const response = await fetch(
        `${useMainStore().backendUrlFC}/api/feature-flags`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch feature flags");
      }

      const data = await response.json();

      // Transform the API response into the desired format
      const flags = data.reduce((acc, flag) => {
        acc[flag.nombre] = flag.is_active;
        return acc;
      }, {});

      // Update the reactive featureFlags and persist to localStorage
      featureFlags.value = flags;
      localStorage.setItem("featureFlags", JSON.stringify(flags));

      console.log("Feature flags loaded:", featureFlags.value);
    } catch (error) {
      console.error("Error loading feature flags:", error);
      throw new Error("Failed to load feature flags.");
    }
  };

  const setFeatureFlag = (flagName, value) => {
    // Ensure featureFlags.value is an object
    if (typeof featureFlags.value !== "object" || featureFlags.value === null) {
      console.warn(
        "featureFlags.value is not an object, initializing to empty object."
      );
      featureFlags.value = {};
    }

    // Update the flag
    featureFlags.value[flagName] = value;

    // Persist the updated flags to localStorage
    localStorage.setItem("featureFlags", JSON.stringify(featureFlags.value));
  };

  const isFeatureActive = (flagName) => {
    return featureFlags.value[flagName] === true;
  };

  return {
    featureFlags,
    loadFeatureFlags,
    setFeatureFlag,
    isFeatureActive,
  };
});
