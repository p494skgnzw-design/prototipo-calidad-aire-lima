export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warmSimulator } = await import("./lib/simulator");
    warmSimulator();
  }
}
