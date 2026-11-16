import { createContext, useContext } from "react";

export const ArtisanToastContext = createContext(null);

export function useArtisanToast() {
  const notify = useContext(ArtisanToastContext);
  if (!notify) {
    throw new Error("useArtisanToast phải được sử dụng bên trong ArtisanToastProvider.");
  }
  return notify;
}
