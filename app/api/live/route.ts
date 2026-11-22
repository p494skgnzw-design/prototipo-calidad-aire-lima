import { connection } from "next/server";
import { buildSnapshot } from "@/lib/simulator";
import { tickMs } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  await connection();
  const encoder = new TextEncoder();
  const interval = tickMs();
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          const payload = JSON.stringify(buildSnapshot());
          controller.enqueue(encoder.encode(`event: snapshot\ndata: ${payload}\n\n`));
        } catch {
          if (timer) clearInterval(timer);
        }
      };
      controller.enqueue(encoder.encode(`: conectado\n\n`));
      send();
      timer = setInterval(send, interval);
      const close = () => {
        if (timer) clearInterval(timer);
        try {
          controller.close();
        } catch {
          /* la conexión ya se cerró */
        }
      };
      request.signal.addEventListener("abort", close);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
