import { createContext, useContext } from "react";

export const FontContext = createContext(false);

export function useFontsLoaded() {
  return useContext(FontContext);
}
