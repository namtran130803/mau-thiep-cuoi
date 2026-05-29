"use client";

import "./styles.css";
import FamilyAddress from "@/components/invite/FamilyAddress";
import InviteShell, { useInvitePage } from "@/components/invite/InviteShell";
import WishList from "@/components/invite/WishList";
import type { InviteTemplateProps } from "@/lib/invite/types";

function GoldDivider() {
  return (
    <div className="gold-divider">
      <span />
    </div>
  );
}

function ThiepCuoi2Content({ data, derived }: InviteTemplateProps) {
  const {
    guestName,
    wishes,
    qrPreviewUrl,
    openGiftModal,
    handleQrUploadChange,
    handleWishSubmit,
  } = useInvitePage();

  const coupleGroomFirst = `${data.groomName} & ${data.brideName}`;

  return (
    <>
      <section className="section hero" id="home">
        <div className="hero-frame">
          <div className="hero-photo">
            <img src={data.images.hero} alt={derived.heroPhotoAlt} />
          </div>
          <span className="hero-arc is-left" aria-hidden="true" />
          <span className="hero-arc is-right" aria-hidden="true" />

          <div className="hero-top" data-aos="fade-down" data-aos-delay="0" data-aos-duration="700">
            <div className="double-happiness">囍</div>
            <div className="hero-label">Thiệp mời cưới</div>
          </div>

          <h1 className="couple-names" data-aos="fade-up" data-aos-delay="240" data-aos-duration="700">
            <span>{data.groomName}</span>
            <em>&</em>
            <span>{data.brideName}</span>
          </h1>

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

          <div className="guest-pill" data-aos="fade-up" data-aos-delay="120" data-aos-duration="700">
            <small>Trân trọng kính mời</small>
            <strong>{guestName}</strong>
          </div>
        </div>
      </section>

      <section className="section is-cream">
        <div className="paper-card" data-aos="fade-up">
          <div className="section-head">
            <div className="section-title">Thiệp Mời</div>
            <GoldDivider />
          </div>
          <p className="invite-copy">
            Chúng tôi trân trọng kính mời quý khách đến chung vui trong ngày hạnh phúc của hai
            gia đình. Sự hiện diện của quý khách là niềm vinh hạnh cho cô dâu chú rể.
          </p>

          <div className="triple-photo" aria-label="Ba ảnh cưới nổi bật">
            {data.images.invitation.map((src, index) => (
              <figure key={src} className="photo-tile">
                <img src={src} alt={derived.invitationPhotoAlts[index]} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Gia Đình</div>
          <div className="section-kicker">Nhà trai & Nhà gái</div>
          <GoldDivider />
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

        <div className="couple-cards" data-aos="fade-up">
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

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Lễ Cưới</div>
          <div className="section-kicker">Thời gian cụ thể</div>
          <GoldDivider />
        </div>

        <div className="time-card" data-aos="fade-up">
          <div className="date-box">
            <div>
              <span>{derived.weekdayLabel}</span>
              <b>{derived.day}</b>
              <span>{derived.monthYearLabel}</span>
            </div>
          </div>
          <div className="time-detail">
            <h3>{derived.timeLabel}</h3>
            <p>{derived.lunarLabel}</p>
            <p>Tại {data.venue.name}</p>
          </div>
        </div>

        <div className="calendar-card" data-aos="fade-up">
          <div className="calendar-head">
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
                <span key={cell.day} className={cell.isWeddingDay ? "active" : undefined}>
                  {cell.day}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="venue-card" data-aos="fade-up">
          <div className="venue-icon" aria-hidden="true">
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
          <a className="btn" href={derived.mapUrl} target="_blank" rel="noopener">
            Xem chỉ đường
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Ảnh Cưới</div>
          <div className="section-kicker">Khoảnh khắc của chúng tôi</div>
          <GoldDivider />
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
            Nếu quý khách muốn gửi chút tình cảm đến cô dâu chú rể, gia đình xin trân trọng đón
            nhận và cảm ơn.
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
          <GoldDivider />
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
              placeholder="Gửi một lời chúc tới cô dâu chú rể..."
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
          <p>Rất hân hạnh được đón tiếp quý khách trong ngày vui của hai gia đình.</p>
          <div className="couple-signoff">{coupleGroomFirst}</div>
        </div>
      </section>
    </>
  );
}

export default function ThiepCuoi2Template(props: InviteTemplateProps) {
  return (
    <InviteShell
      scopeClass="thiep-cuoi-2"
      aosOffset={80}
      showWishAlert={false}
      qrBoxClassName="qr-box"
      {...props}
    >
      <ThiepCuoi2Content {...props} />
    </InviteShell>
  );
}
