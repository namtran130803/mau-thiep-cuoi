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

function ThiepCuoi1Content({ data, derived }: InviteTemplateProps) {
  const {
    guestName,
    wishes,
    qrPreviewUrl,
    openGiftModal,
    handleQrUploadChange,
    handleWishSubmit,
  } = useInvitePage();

  return (
    <>
      <section className="section hero" id="home">
        <div className="hero-photo">
          <img src={data.images.hero} alt={derived.heroPhotoAlt} />
        </div>

        <div className="hero-content">
          <div data-aos="fade-down" data-aos-delay="0" data-aos-duration="700">
            <div className="brand-label">Thiệp Mời Cưới</div>
            <Ornament />
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

          <div className="invite-for" data-aos="fade-up" data-aos-delay="120" data-aos-duration="700">
            <small>Trân trọng kính mời</small>
            <strong>{guestName}</strong>
          </div>
        </div>
      </section>

      <section className="section is-cream">
        <svg className="floating-leaf leaf-1" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <path d="M18 102C38 58 68 30 104 14" stroke="currentColor" strokeWidth="2" />
          <path d="M34 74C30 52 44 38 66 34C68 56 56 70 34 74Z" fill="currentColor" />
          <path d="M58 48C58 28 72 17 94 16C90 38 78 48 58 48Z" fill="currentColor" opacity=".7" />
        </svg>

        <div className="intro-card" data-aos="fade-up">
          <div className="section-head">
            <div className="section-title">Thư Mời</div>
            <div className="section-kicker">Lưu ngày vui</div>
            <Ornament className="ornament section-divider" />
          </div>
          <p>
            Chúng tôi rất hạnh phúc được chia sẻ ngày trọng đại này cùng những người thân thương.
            Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình hai bên.
          </p>
        </div>

        <div className="triple-photo" data-aos="fade-up" aria-label="Ba ảnh cưới nổi bật">
          {data.images.invitation.map((src, index) => (
            <figure key={src} className="triple-photo__item">
              <img src={src} alt={derived.invitationPhotoAlts[index]} />
            </figure>
          ))}

          <div className="triple-caption">
            <strong>Chuyện chúng mình</strong>
            <span>Một hành trình nhỏ, một ngày vui lớn</span>
          </div>
        </div>
      </section>

      <section className="section family-section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Gia Đình</div>
          <div className="section-kicker">Nhà trai & Nhà gái</div>
          <Ornament className="ornament section-divider" />
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
        <div className="time-card" data-aos="fade-up">
          <div className="section-head">
            <div className="section-title">Hôn Lễ</div>
            <div className="section-kicker">Thời gian cụ thể</div>
            <Ornament className="ornament section-divider" />
          </div>

          <div className="calendar-row">
            <div className="calendar-side">{derived.weekdayLabel}</div>
            <div className="calendar-day">{derived.day}</div>
            <div className="calendar-side">{derived.monthYearLabel}</div>
          </div>

          <div className="time-main">{derived.timeLabel}</div>
          <p className="muted-note">{derived.lunarLabel}</p>
        </div>

        <div className="month-card" data-aos="fade-up">
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
                <span key={cell.day} className={cell.isWeddingDay ? "active-date" : undefined}>
                  {cell.day}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="location-card" data-aos="fade-up">
          <div className="location-body">
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
              <a className="btn" href={derived.mapUrl} target="_blank" rel="noopener">
                Xem bản đồ
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Ảnh Cưới</div>
          <div className="section-kicker">Khoảnh khắc của chúng tôi</div>
          <Ornament className="ornament section-divider" />
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
          <div className="gift-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M4 11h16v9H4v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M3 7h18v4H3V7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M12 7v13" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M12 7C10.8 4.2 8.1 3.5 7.1 4.7C6 6 7.7 7.3 12 7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M12 7c1.2-2.8 3.9-3.5 4.9-2.3C18 6 16.3 7.3 12 7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Mừng Cưới</h3>
          <p>
            Nếu quý khách muốn gửi chút tình cảm đến cô dâu chú rể, gia đình xin trân trọng đón nhận và cảm ơn.
          </p>
          <button className="btn" type="button" onClick={openGiftModal}>
            Mừng cưới
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-aos="fade-up">
          <div className="section-title">Lời Chúc</div>
          <div className="section-kicker">Xác nhận tham dự</div>
          <Ornament className="ornament section-divider" />
        </div>

        <form className="rsvp-card" data-aos="fade-up" onSubmit={handleWishSubmit}>
          <div className="form-inner">
            <div className="field">
              <label htmlFor="name">Tên của bạn</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <input id="name" name="name" type="text" placeholder="Ví dụ: Anh Nam" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="attend">Tham dự</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 2v4M16 2v4M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M5 5h14v16H5V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </span>
                <select id="attend" name="attend" required defaultValue="">
                  <option value="" disabled>
                    Chọn câu trả lời
                  </option>
                  <option value="Có thể tham dự">Có thể tham dự</option>
                  <option value="Chưa chắc chắn">Chưa chắc chắn</option>
                  <option value="Không thể tham dự">Không thể tham dự</option>
                </select>
              </div>
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
              <label htmlFor="qrUpload">Ảnh đính kèm</label>
              <div className="file-field">
                <input
                  className="file-input"
                  id="qrUpload"
                  name="attachment"
                  type="file"
                  accept="image/*"
                  onChange={handleQrUploadChange}
                />
                <label className="upload-box" htmlFor="qrUpload">
                  {qrPreviewUrl ? (
                    <span className="qr-preview has-image">
                      <img src={qrPreviewUrl} alt="Ảnh đã tải lên" />
                    </span>
                  ) : (
                    <span className="upload-text">Chọn ảnh đính kèm</span>
                  )}
                </label>
              </div>
            </div>

            <button className="btn is-full" type="submit">
              Gửi lời chúc
            </button>
          </div>
        </form>

        <WishList wishes={wishes} />
      </section>

      <section className="section thank-you">
        <div className="hero-photo">
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

export default function ThiepCuoi1Template(props: InviteTemplateProps) {
  return (
    <InviteShell scopeClass="thiep-cuoi-1" aosOffset={0} {...props}>
      <ThiepCuoi1Content {...props} />
    </InviteShell>
  );
}
