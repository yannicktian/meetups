"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

export type StageNavHandlers = {
  /** Called when the user requests "next slide". Return true if the slide
   * handled the press internally (e.g. advanced to the next stage) and the
   * deck should stay put. Return false to let the deck advance normally. */
  onNextRequest?: () => boolean;
  /** Symmetric — return true to consume the prev press, false to let the
   * deck move back a slide. */
  onPrevRequest?: () => boolean;
};

type StageNavContextValue = {
  register: (slideId: string, handlers: StageNavHandlers) => void;
  unregister: (slideId: string) => void;
  getHandlers: (slideId: string) => StageNavHandlers | undefined;
};

const StageNavContext = createContext<StageNavContextValue | null>(null);

/** Provider for the stage-nav mechanism. Lets slides register interceptors
 * for the deck's next/prev key presses so they can advance internal stages
 * before the deck moves to the next slide.
 *
 * Intentional: handlers live in a ref (not state) so registering does not
 * re-render the tree. The key handler in use-slide-nav reads the ref at
 * press time, so the most recently registered handler always wins.
 */
export function StageNavProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef<Map<string, StageNavHandlers>>(new Map());

  const register = useCallback((slideId: string, handlers: StageNavHandlers) => {
    handlersRef.current.set(slideId, handlers);
  }, []);

  const unregister = useCallback((slideId: string) => {
    handlersRef.current.delete(slideId);
  }, []);

  const getHandlers = useCallback((slideId: string) => {
    return handlersRef.current.get(slideId);
  }, []);

  return (
    <StageNavContext.Provider value={{ register, unregister, getHandlers }}>
      {children}
    </StageNavContext.Provider>
  );
}

/** Returns the stage-nav context. Returns null if not inside a provider
 * (slides outside a StageNavProvider still work — they just can't
 * intercept nav). */
export function useStageNav() {
  return useContext(StageNavContext);
}
