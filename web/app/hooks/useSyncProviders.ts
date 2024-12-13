import { useSyncExternalStore } from "react";
import { store } from "../lib/store";

export const useSyncProviders = () =>
  useSyncExternalStore(store.subscribe, store.value, store.value);
