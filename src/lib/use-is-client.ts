import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during the static build and hydration, true once running in the browser. */
export const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
