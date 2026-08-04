import { fetchBenchmark } from "@/lib/benchmarks";

export const revalidate = 86400; // 하루 캐시

export async function GET() {
  const b = await fetchBenchmark();
  return Response.json(b);
}
