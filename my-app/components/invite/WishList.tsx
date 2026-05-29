import type { Wish } from "@/lib/invite/types";

export default function WishList({ wishes }: { wishes: Wish[] }) {
  return (
    <div className="wish-list" aria-live="polite">
      {wishes.map((wish) => (
        <article key={wish.createdAt + wish.name} className="wish-item" data-aos="fade-up">
          <strong>
            {wish.name} · {wish.attend}
          </strong>
          <p>{wish.message}</p>
        </article>
      ))}
    </div>
  );
}
