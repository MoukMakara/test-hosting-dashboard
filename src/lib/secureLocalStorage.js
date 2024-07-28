import secureLocalStorage from "react-secure-storage";

// add accessToken to local storage
export const storeAccessToken = (accessToken) => {
  secureLocalStorage.setItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX,
    accessToken
  );
};

// get accessToken
export const getAccessToken = () => {
  return secureLocalStorage.getItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX
  );
};

// remove accessToken
export const removeAccessToken = () => {
  secureLocalStorage.removeItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX
  );
};
