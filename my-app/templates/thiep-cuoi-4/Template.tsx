"use client";

import "./styles.css";
import FamilyAddress from "@/components/invite/FamilyAddress";
import InviteShell, { useInvitePage } from "@/components/invite/InviteShell";
import WishList from "@/components/invite/WishList";
import type { InviteTemplateProps } from "@/lib/invite/types";

function Ornament({ className = "ornament" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 32" fill="none" aria-hidden="true">
      <path d="M8 16H64" stroke="currentColor" strokeWidth="1" />
      <path d="M96 16H152" stroke="currentColor" strokeWidth="1" />
      <path
        d="M80 6C86 10 86 22 80 26C74 22 74 10 80 6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M72 16C74 12 78 10 80 10C82 10 86 12 88 16C86 20 82 22 80 22C78 22 74 20 72 16Z"
        fill="currentColor"
        opacity=".35"
      />
    </svg>
  );
}

function buildMonogram(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.[0] ?? "").toUpperCase();
}

function ThiepCuoi4Content({ data, derived }: InviteTemplateProps) {
  const {
    guestName,
    wishes,
    qrPreviewUrl,
    openGiftModal,
    handleQrUploadChange,
    handleWishSubmit,
  } = useInvitePage();

  const weddingDate = new Date(data.weddingAt);
  const weddingMonth = weddingDate.getMonth() + 1;
  const monogramBride = buildMonogram(data.brideName);
  const monogramGroom = buildMonogram(data.groomName);

  return (
    <>
      <section className="section hero" id="home">
        <div className="hero-photo">
          <img src={data.images.hero} alt={derived.heroPhotoAlt} />
        </div>
        <div className="hero-content">
          <div data-aos="fade-down" data-aos-delay="0" data-aos-duration="700">
            <div className="hero-top">
              <div className="monogram" aria-hidden="true">
                {monogramBride}
                <span>&</span>
                {monogramGroom}
              </div>
              <p className="brand-label">Lễ thành hôn</p>
              <Ornament />
            </div>
          </div>

          <div className="invite-for" data-aos="fade-up" data-aos-delay="120" data-aos-duration="700">
            <small>Trân trọng kính mời</small>
            <strong>{guestName}</strong>
          </div>

          <div className="hero-bottom">
            <div data-aos="fade-up" data-aos-delay="240" data-aos-duration="700">
              <h1 className="couple-names">
                <span>{data.brideName}</span>
                <span>&</span>
                <span>{data.groomName}</span>
              </h1>
            </div>
            <div
              className="hero-date"
              data-aos="fade-up"
              data-aos-delay="360"
              data-aos-duration="700"
              aria-label="Ngày cưới"
            >
              <span>{derived.weekdayLabel}</span>
              <b>{derived.day}</b>
              <span>{derived.monthYearLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section is-cream">
        <div className="paper-card" data-aos="fade-up">
          <div className="section-head">
            <div className="section-title">Thiệp Mời</div>
            <div className="section-kicker">Trân trọng báo tin</div>
            <Ornament />
          </div>
          <p className="invite-copy">
            Trong niềm vui sum vầy của hai gia đình, chúng tôi trân trọng kính mời quý khách đến dự
            buổi tiệc chung vui cùng cô dâu chú rể. Sự hiện diện và lời chúc của quý khách là món quà
            quý giá nhất trong ngày hạnh phúc này.
          </p>
        </div>

        <div className="triple-photo" data-aos="fade-up" aria-label="Ba ảnh cưới">
          {data.images.invitation.map((src, index) => (
            <figure key={src} className="photo-tile">
              <img src={src} alt={derived.invitationPhotoAlts[index]} />
            </figure>
          ))}
          <div className="triple-caption">
            <strong>{derived.coupleDisplay}</strong>
            <span>
              {derived.day} · {weddingMonth} · {derived.calendarYear}
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Gia Đình</div>
          <div className="section-kicker">Nhà trai & Nhà gái</div>
          <Ornament />
        </div>
        <div className="parents-grid" data-aos="fade-up">
          <div className="family-card">
            <div className="family-title">Nhà trai</div>
            <div className="parent-name">
              {data.groomFamily.fatherName}
              <br />
              {data.groomFamily.motherName}
            </div>
            <FamilyAddress address={data.groomFamily.address} />
          </div>
          <div className="family-card">
            <div className="family-title">Nhà gái</div>
            <div className="parent-name">
              {data.brideFamily.fatherName}
              <br />
              {data.brideFamily.motherName}
            </div>
            <FamilyAddress address={data.brideFamily.address} />
          </div>
        </div>
        <div className="couple-split" data-aos="fade-up">
          <article className="person-card">
            <img src={data.images.family[0]} alt={derived.groomPhotoAlt} />
            <div className="person-info">
              <small>Chú rể</small>
              <h3>{data.groomName}</h3>
            </div>
          </article>
          <article className="person-card">
            <img src={data.images.family[1]} alt={derived.bridePhotoAlt} />
            <div className="person-info">
              <small>Cô dâu</small>
              <h3>{data.brideName}</h3>
            </div>
          </article>
        </div>
      </section>

      <section className="section is-cream">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Hôn Lễ</div>
          <div className="section-kicker">Thời gian cụ thể</div>
          <Ornament />
        </div>

        <div className="time-card" data-aos="fade-up">
          <div className="calendar-row">
            <div className="calendar-side">{derived.weekdayLabel}</div>
            <div className="calendar-day">{derived.day}</div>
            <div className="calendar-side">{derived.monthYearLabel}</div>
          </div>
          <div className="time-main">{derived.timeLabel}</div>
          <p className="muted-note">{derived.lunarLabel}</p>
        </div>

        <div className="calendar-card" data-aos="fade-up">
          <div className="month-head">
            <div>
              <span>Lịch cưới</span>
              <strong>{derived.calendarMonthLabel}</strong>
            </div>
            <strong>{derived.calendarYear}</strong>
          </div>
          <div className="calendar-grid" aria-label={derived.calendarAriaLabel}>
            <b>T2</b>
            <b>T3</b>
            <b>T4</b>
            <b>T5</b>
            <b>T6</b>
            <b>T7</b>
            <b>CN</b>
            {derived.calendarCells.map((cell, index) =>
              cell.kind === "blank" ? (
                <span key={`blank-${index}`} className="blank" />
              ) : (
                <span key={cell.day} className={cell.isWeddingDay ? "is-active" : undefined}>
                  {cell.day}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="location-card" data-aos="fade-up">
          <div className="map-pin" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
          <h3>{data.venue.name}</h3>
          <p>{data.venue.address}</p>
          <div className="btn-wrap">
            <a className="btn is-outline" href={derived.mapUrl} target="_blank" rel="noopener">
              Xem bản đồ
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Ảnh Cưới</div>
          <div className="section-kicker">Khoảnh khắc của chúng tôi</div>
          <Ornament />
        </div>
        <div className="album-masonry" data-aos="fade-up">
          {derived.galleryItems.map((photo) => (
            <figure key={photo.src} className="album-item">
              <img src={photo.src} alt={photo.alt} />
            </figure>
          ))}
        </div>
      </section>

      <section className="section is-cream">
        <div className="gift-card" data-aos="fade-up">
          <h3>Mừng Cưới</h3>
          <p>
            Nếu quý khách muốn gửi chút tình cảm đến cô dâu chú rể, gia đình xin trân trọng đón nhận
            và cảm ơn.
          </p>
          <button className="btn" type="button" onClick={openGiftModal}>
            Mừng cưới
          </button>
        </div>
      </section>

      <section className="section rsvp-section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Lời Chúc</div>
          <div className="section-kicker">Xác nhận tham dự</div>
          <Ornament />
        </div>
        <form className="rsvp-card" data-aos="fade-up" onSubmit={handleWishSubmit}>
          <div className="field">
            <label htmlFor="name">Tên của bạn</label>
            <input id="name" name="name" type="text" placeholder="Ví dụ: Anh Nam" required />
          </div>
          <div className="field">
            <label htmlFor="attend">Tham dự</label>
            <select id="attend" name="attend" required defaultValue="">
              <option value="" disabled>
                Chọn câu trả lời
              </option>
              <option value="Có thể tham dự">Có thể tham dự</option>
              <option value="Chưa chắc chắn">Chưa chắc chắn</option>
              <option value="Không thể tham dự">Không thể tham dự</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">Lời chúc</label>
            <textarea
              id="message"
              name="message"
              placeholder="Gửi lời chúc tới cô dâu chú rể..."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="attachment">Ảnh đính kèm</label>
            <input
              className="file-input"
              id="attachment"
              name="attachment"
              type="file"
              accept="image/*"
              onChange={handleQrUploadChange}
            />
            <label className="upload-box" htmlFor="attachment">
              {qrPreviewUrl ? (
                <span className="preview has-image">
                  <img src={qrPreviewUrl} alt="Ảnh đã tải lên" />
                </span>
              ) : (
                <span className="upload-text">Chọn ảnh đính kèm</span>
              )}
            </label>
          </div>
          <button className="btn is-full" type="submit">
            Gửi lời chúc
          </button>
        </form>
        <WishList wishes={wishes} />
      </section>

      <section className="section thank-you">
        <div className="thank-bg">
          <img src={data.images.thankYou} alt={derived.thankYouPhotoAlt} />
        </div>
        <div className="thank-content" data-aos="fade-up">
          <h2>Cảm Ơn</h2>
          <p>Sự hiện diện của quý khách là món quà ý nghĩa nhất trong ngày vui của chúng tôi.</p>
          <div className="couple-signoff">{derived.coupleDisplay}</div>
        </div>
      </section>
    </>
  );
}

export default function ThiepCuoi4Template(props: InviteTemplateProps) {
  return (
    <InviteShell scopeClass="thiep-cuoi-4" aosOffset={80} showWishAlert={false} {...props}>
      <ThiepCuoi4Content {...props} />
    </InviteShell>
  );
}
