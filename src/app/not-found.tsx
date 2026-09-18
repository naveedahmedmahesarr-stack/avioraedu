import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="This route doesn't exist." intro="The page you are looking for may have moved." />
      <section className="bg-ivory py-20">
        <div className="container-x">
          <Link href="/" className="btn btn-navy">
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
