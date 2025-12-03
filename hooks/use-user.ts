/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { User } from "@/lib/session";
import { fetchCurrentUser } from "@/lib/api/user";

interface UseUserState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: Error | null;
}

interface UseUserOptions {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number; // ms - prevent multiple requests within this time
  focusThrottleInterval?: number; // ms - throttle revalidation on focus
}

const DEFAULT_OPTIONS: Required<UseUserOptions> = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 60_000,
  focusThrottleInterval: 5_000,
};

// Module-level cache & dedupe
let cachedUser: User | null = null;
let cacheTimestamp = 0;
let fetchPromise: Promise<User | null> | null = null;
let lastFocusRevalidation = 0;

export function clearUserCache() {
  cachedUser = null;
  cacheTimestamp = 0;
  fetchPromise = null;
  lastFocusRevalidation = 0;
}

function isUserLoggedIn(user: unknown): boolean {
  // If user is an object and explicitly has isLoggedIn, use that.
  if (user && typeof user === "object" && "isLoggedIn" in (user as any)) {
    return Boolean((user as any).isLoggedIn);
  }
  // Otherwise consider presence of a user object truthy => logged in
  return !!user;
}

export function useUser(options?: UseUserOptions) {
  const opts = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...(options ?? {}) }),
    [options]
  );

  const isMountedRef = useRef(false);

  const [state, setState] = useState<UseUserState>(() => {
    const initial = cachedUser ?? null;
    return {
      user: initial,
      isLoading: initial === null,
      isLoggedIn: isUserLoggedIn(initial),
      error: null,
    };
  });

  const fetchUser = useCallback(
    async (skipCache = false) => {
      const now = Date.now();

      // Serve cached user if fresh and not skipping cache
      if (
        !skipCache &&
        cachedUser &&
        now - cacheTimestamp < opts.dedupingInterval
      ) {
        if (!isMountedRef.current) return;
        setState({
          user: cachedUser,
          isLoading: false,
          isLoggedIn: isUserLoggedIn(cachedUser),
          error: null,
        });
        return;
      }

      // If a fetch is already in-flight, await it (dedupe)
      if (fetchPromise) {
        try {
          const user = await fetchPromise;
          if (!isMountedRef.current) return;
          setState({
            user,
            isLoading: false,
            isLoggedIn: isUserLoggedIn(user),
            error: null,
          });
        } catch (err) {
          if (!isMountedRef.current) return;
          const error = err instanceof Error ? err : new Error(String(err));
          setState({ user: null, isLoading: false, isLoggedIn: false, error });
        }
        return;
      }

      // Show loading only if we don't already have cached data
      if (!cachedUser) {
        if (!isMountedRef.current) return;
        setState((s) => ({ ...s, isLoading: true, error: null }));
      }

      // start the fetch and store promise for deduping
      fetchPromise = (async () => {
        try {
          const user = await fetchCurrentUser();
          // update cache on success
          cachedUser = user;
          cacheTimestamp = Date.now();
          return user;
        } catch (err) {
          // don't overwrite cache on failure; rethrow to be handled below
          throw err;
        }
      })();

      try {
        const user = await fetchPromise;
        if (!isMountedRef.current) return;
        setState({
          user,
          isLoading: false,
          isLoggedIn: isUserLoggedIn(user),
          error: null,
        });
      } catch (err) {
        if (!isMountedRef.current) return;
        const error = err instanceof Error ? err : new Error(String(err));
        // keep cachedUser as-is (may be stale); reflect error in state
        setState({
          user: cachedUser ?? null,
          isLoading: false,
          isLoggedIn: isUserLoggedIn(cachedUser),
          error,
        });
      } finally {
        // clear in-flight marker
        fetchPromise = null;
      }
    },
    [opts.dedupingInterval]
  );

  useEffect(() => {
    isMountedRef.current = true;
    // initial fetch — allow using fresh cache
    fetchUser(false).catch(() => {
      /* handled in fetchUser */
    });
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchUser]);

  // Storage event: conservative approach (clear and revalidate)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      // When other tabs change auth-related storage, clear local cache and revalidate.
      // Optionally you can check ev.key for specific auth keys to be less aggressive.
      clearUserCache();
      void fetchUser(true);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [fetchUser]);

  // Revalidate on window focus (throttled)
  useEffect(() => {
    if (typeof window === "undefined" || !opts.revalidateOnFocus) return;
    const onFocus = () => {
      const now = Date.now();
      if (now - lastFocusRevalidation > opts.focusThrottleInterval) {
        lastFocusRevalidation = now;
        void fetchUser(true);
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUser, opts.revalidateOnFocus, opts.focusThrottleInterval]);

  // Revalidate on reconnect
  useEffect(() => {
    if (typeof window === "undefined" || !opts.revalidateOnReconnect) return;
    const onOnline = () => {
      void fetchUser(true);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [fetchUser, opts.revalidateOnReconnect]);

  const mutate = useCallback(async () => {
    // allow immediate re-fetch: reset timestamp so dedupe/cache won't block it
    cacheTimestamp = 0;
    await fetchUser(true);
  }, [fetchUser]);

  return useMemo(
    () => ({
      ...state,
      mutate,
    }),
    [state, mutate]
  );
}
