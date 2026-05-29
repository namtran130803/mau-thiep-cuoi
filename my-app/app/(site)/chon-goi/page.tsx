import { redirect } from "next/navigation";

type ChonGoiPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ChonGoiPage({ searchParams }: ChonGoiPageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      qs.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => qs.append(key, item));
    }
  }

  const query = qs.toString();
  redirect(query ? `/tao-thiep?${query}` : "/tao-thiep");
}
