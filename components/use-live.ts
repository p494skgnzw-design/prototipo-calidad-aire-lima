"use client";

import { useEffect, useState } from "react";
import { buildSnapshot } from "@/lib/simulator";
import { staticSite } from "@/lib/runtime";
import type { LiveSnapshot } from "@/lib/types";

export type LiveStatus = "connecting" | "live" | "reconnecting";

export function useLiveSnapshot(): { snapshot: LiveSnapshot | null; status: LiveStatus } {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(() =>
    staticSite ? buildSnapshot() : null,
  );
  const [status, setStatus] = useState<LiveStatus>(staticSite ? "live" : "connecting");

  useEffect(() => {
    if (!staticSite) return;
    const timer = setInterval(() => {
      setSnapshot(buildSnapshot());
      setStatus("live");
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (staticSite) return;
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
