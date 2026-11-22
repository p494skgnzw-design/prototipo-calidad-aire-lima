"use client";

import { useEffect, useState } from "react";
import type { LiveSnapshot } from "@/lib/types";

export type LiveStatus = "connecting" | "live" | "reconnecting";

export function useLiveSnapshot(): { snapshot: LiveSnapshot | null; status: LiveStatus } {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [status, setStatus] = useState<LiveStatus>("connecting");

  useEffect(() => {
    const source = new EventSource("/api/live");
    const onSnapshot = (event: Event) => {
      try {
        const data = JSON.parse((event as MessageEvent<string>).data) as LiveSnapshot;
        setSnapshot(data);
        setStatus("live");
      } catch {
        setStatus("reconnecting");
      }
    };
    source.addEventListener("snapshot", onSnapshot);
    source.onerror = () => setStatus("reconnecting");
    return () => {
      source.removeEventListener("snapshot", onSnapshot);
      source.close();
    };
  }, []);

  return { snapshot, status };
}
