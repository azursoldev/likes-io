import { notFound } from "next/navigation";
import LegalPageEditor from "@/app/components/LegalPageEditor";

export default function Page({ params }: { params: { slug: string } }) {
  if (params.slug !== "terms" && params.slug !== "privacy") {
    notFound();
  }

  return <LegalPageEditor slug={params.slug} />;
}
