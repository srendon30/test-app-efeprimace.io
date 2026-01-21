import app from "@/main.js";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

export class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}

export function showErrorMessage(error) {
  const authStore = useAuthStore();

  if (error instanceof HttpError) {
    app.config.globalProperties.$swal({
      icon: "error",
      title: `Error ${error.status}`,
      text: error.message,
      showConfirmButton: true,
    });

    if (error.status === 401) {
      authStore.clearAuthData();
      router.push({ name: "login" });
    }
    
  } else {
    console.log(`Error: ${error.message}`);
    app.config.globalProperties.$swal({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}
