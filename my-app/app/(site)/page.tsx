import type { Metadata } from "next";
import Link from "next/link";
import { listInviteTemplates } from "@/lib/templates/registry";
import "./site.css";

export const metadata: Metadata = {
  title: "Mẫu thiệp cưới online",
  description: "Danh sách mẫu thiệp mời cưới trực tuyến",
};

export default function HomePage() {
  const templates = listInviteTemplates();

  return (
    <main className="site-home">
      <header className="site-home__header">
        <h1 className="site-home__title">Mẫu thiệp cưới online</h1>
        <p className="site-home__lead">Chọn một mẫu để xem trước. Mỗi mẫu có bố cục và phong cách riêng.</p>
      </header>

      <ul className="site-home__list">
        {templates.map((template) => (
          <li key={template.slug}>
            <Link className="site-home__card" href={`/${template.slug}`}>
              <span className="site-home__card-label">{template.label}</span>
              {template.couple ? (
                <span className="site-home__card-couple">{template.couple}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
