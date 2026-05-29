# Prompt: Tạo thiệp cưới HTML single-file (họ template thống nhất)

> Mục tiêu: AI sinh thiệp **sạch, cùng “khung xương”** giữa các phong cách, nhưng **visual sáng tạo** theo file phong cách — không clone một mẫu đỏ/vàng hay kem/nâu.

## Cách dùng — gửi AI

| # | File | Vai trò |
|---|------|---------|
| 1 | **File này** | Quy tắc hợp đồng + menu biến thể |
| 2 | **`docs/styles/XX-*.md`** | Palette, mood, họa tiết, **Tránh** — nguồn visual **duy nhất** |
| 3 | **`index.html`** | Trang danh sách liên kết tới 4 mẫu chuẩn |
| 4 | **Bốn thiệp chuẩn** (đọc để hiểu skeleton + **layout đã chiếm**): |
| | `thiep_cuoi_1.html` | Kem/nâu · ornament · hero overlay full `100svh` · arch 3 ảnh · **cover gate 2 cánh + dấu sáp** |
| | `thiep_cuoi_2.html` | Đỏ/vàng · gold-divider · hero oval full `100svh` · ảnh xoay · **cover gate** |
| | `thiep_cuoi_3.html` | Indochine · plaque chồng band full `100svh` · grid panorama · tên trên ảnh · **cover gate** |
| | `thiep_cuoi_4.html` | Đen/vàng · monogram · countdown · calendar-row giữa · hero overlay full `100svh` · **cover gate** |

Copy khối **「PROMPT GỬI CHO AI」**, thay `[...]`, đính kèm **file phong cách + 4 file HTML** (hoặc ít nhất 3 file + file theme mới nhất).

> **Palette** chỉ từ `docs/styles/XX-*.md`. **Combo layout** không được trùng “DNA” bất kỳ file `thiep_cuoi_*.html` nào — xem mục **Chống trùng phong cách** bên dưới.

> **Bảo trì prompt (bắt buộc):** Mỗi khi sửa hành vi/UI trên `thiep_cuoi_1`…`4` (cover gate, hero, font gate, AOS, JS…), **cập nhật ngay** file này trong cùng PR/commit — không để prompt lệch code thực tế.

---

## Triết lý (một câu)

**Cùng bố cục & code — khác “da” phong cách.**  
Bốn file chuẩn chứng minh: tokens, section, class, JS gần như giống hệt; khác nhau ở **combo** divider + hero + ảnh + gia đình + giờ/lịch/địa điểm.

---

## Chống trùng phong cách (bắt buộc — đọc trước khi code)

### Nguyên tắc

1. **Màu / mood / họa tiết** → chỉ `[FILE_PHONG_CACH]` (`.md`).
2. **Layout từng block** → chọn từ menu biến thể; **không** copy nguyên combo của một file `thiep_cuoi_*.html` đã có.
3. Đổi màu từ file A sang palette file B **không** được coi là theme mới — phải đổi **đủ block** theo quy tắc dưới.

### Sổ đăng ký layout đã chiếm (4 file chuẩn)

Mỗi cột = **một chữ ký (signature)** đang được dùng. Theme mới **không** được trùng ≥ **6/11** ô cùng cột với bất kỳ file nào.

| Block | `thiep_cuoi_1` | `thiep_cuoi_2` | `thiep_cuoi_3` | `thiep_cuoi_4` |
|-------|----------------|----------------|----------------|----------------|
| **Divider** | `.ornament` SVG | `.gold-divider` | `.section-divider` ◆ | `.ornament` SVG |
| **Hero** | Overlay flex + `.invite-for` · **`100svh`** | `.hero-frame` oval · **`100svh`** | Band + `.hero-plaque` · **`100svh`** | Overlay + `.monogram` · **`100svh`** |
| **Thư mời** | `.intro-card` | `.paper-card` sáng | `.intro-card` + drop cap | `.paper-card` tối + `.invite-copy` |
| **3 ảnh** | `.triple-photo__item` arch absolute | `.photo-tile` xoay chồng | Grid panorama vòm | `.photo-tile` xoay + `.triple-caption` |
| **Gia đình** | `.parents-grid` 2 cột | `.parents-grid` card tối | List dọc 1 cột viền | `.parents-grid` 2 cột viền gold |
| **Cặp đôi** | `.couple-split` tên **dưới** ảnh | `.couple-cards` grid overlay | `.couple-cards` flex tên **trên** ảnh | `.couple-split` tên dưới ảnh |
| **Giờ** | `.calendar-row` + `.time-main` | `.time-card` 2 cột `.date-box` | Banner accent `.date-box` | `.countdown-strip` + `.calendar-row` |
| **Lịch head** | `.month-head` trái/phải | `.calendar-head` 2 dòng | `.calendar-head` 2 dòng | `.month-head` trái/phải |
| **Địa điểm** | `.location-card` giữa | `.venue-card` giữa | `.venue-card` grid pin | `.location-card` giữa |
| **Mở thiệp** | `.cover-gate` 2 cánh + dấu sáp | `.cover-gate` (cream/đỏ) | `.cover-gate` (surface/indochine) | `.cover-gate` (dark/gold) |
| **Đặc trưng khác** | lá SVG trang trí · shell full-width · font gate · ẩn scrollbar | nền đỏ gradient · shell full-width · font gate · ẩn scrollbar | `.is-framed` góc · shell full-width · font gate · ẩn scrollbar | pinstripe + khung kép · shell full-width · font gate · ẩn scrollbar |

### Thuật toán chọn combo cho theme mới

```
Bước 1 — Đọc [FILE_PHONG_CACH].md → palette, mood, Tránh.
Bước 2 — Liệt kê 4 cột bảng trên; với MỖI block chọn biến thể KHÁC hàng đã chiếm
         của file “gần giống” nhất (cùng nhóm: tối/sang, vintage, đỏ, kem…).
Bước 3 — Đếm trùng từng cột file 1…4:
         • Nếu trùng ≥ 6/11 với một file → đổi ít nhất 3 block (ưu tiên Hero, 3 ảnh, Cặp đôi, Giờ).
         • Không được trùng 11/11 (clone).
Bước 4 — Trong output, in bảng “Layout fingerprint” (mẫu cuối prompt).
```

### Cấm tuyệt đối khi làm theme mới

| Cấm | Lý do |
|-----|--------|
| Clone **toàn bộ** combo một cột (`thiep_cuoi_1`…`4`) chỉ đổi `:root` màu | Đã có theme đó |
| `thiep_cuoi_3` + đổi màu đen/vàng | Đã thử → trùng Indochine; dùng combo khác (vd. `thiep_cuoi_4` hoặc mix 1+2) |
| Cùng lúc: plaque chồng band + pill dọc + grid panorama + drop cap + `.is-framed` | Signature `thiep_cuoi_3` |
| Cùng lúc: monogram + invite-for + xoay ảnh + countdown + month-head | Signature `thiep_cuoi_4` (trừ khi sửa file 4) |
| Cùng lúc: hero oval + gold-divider + paper sáng + guest-pill tròn | Signature `thiep_cuoi_2` |

### Gợi ý phối hợp chưa chiếm (ví dụ — AI chọn 1, không gom hết)

- Divider: đường kẻ đôi `.lux-rule` (CSS mới trong file), chữ “§” giữa, không SVG ornament/gold-divider/◆.
- Hero: split 50/50 ảnh | chữ; hoặc typography-only (không ảnh hero) + ảnh nhỏ monogram vuông.
- 3 ảnh: hàng ngang 3 cột bằng nhau; hoặc 1 ảnh full-width + 2 thumbnail.
- Cặp đôi: 1 ảnh đôi full-width + tên serif hai bên (không split, không flex trên ảnh).
- Giờ: timeline dọc; hoặc một dòng lớn `17:30 — 23.10.2027` không lịch tháng.
- Lịch: chỉ `.calendar-head` 2 dòng nếu chưa dùng `month-head` (hoặc ngược lại) — **không** copy cả cụm giờ+lịch+địa điểm của một file.

---

## Hợp đồng chung — 100% giống nhau (không đổi khi theme mới)

Rút từ `thiep_cuoi_1` … `thiep_cuoi_4` — **bắt buộc** mọi thiệp mới.

### Vỏ trang (shell) — đã chuẩn hoá

| Thành phần | Quy tắc |
|------------|---------|
| `.app` | `width: min(100%, var(--page-width))`; `margin: 0 auto`; **`border-radius: 0`** — không bo 4 góc khung thiệp |
| `body` | **Không** `padding` dọc quanh `.app` (đã bỏ `padding: 28px 0` trên desktop) |
| `.section` | **`padding: var(--section-space) 22px`** — có khoảng dọc giữa các block; **ngoại lệ:** `.section.hero`, `.section.thank-you` ghi đè `padding` riêng |
| `.section.hero` | **`min-height` / `height: 100svh` + `100dvh`** (khai báo cả hai); **`padding: 0`**; **`overflow: hidden`** — hero luôn full viewport, không tràn cuộn nội bộ |
| `@media (min-width: 760px)` | **Không** thêm `body` padding dọc hay `.app` border-radius |

**Hero — triển khai nội bộ (giữ biến thể layout, tuân chiều cao):**

| File | Cách lấp đầy viewport + hiển thị đủ nội dung |
|------|-----------------------------------------------|
| `1`, `4` | `.hero-photo` absolute `inset: 0`; `.hero-content` **grid** `auto 1fr auto` + typography **`clamp(…, …svh, …)`** — **mở cover xong thấy hết hero, không cuộn** |
| `2` | `.hero` flex column; `.hero-frame` `flex: 1; min-height: 0` (oval full chiều cao) |
| `3` | `.hero` flex column; `.hero-photo` `flex: 1; min-height: 0` (band ảnh co giãn); `.hero-content` `flex-shrink: 0` |

### Cấu trúc trang

```
.app (max 420px)
├── .cover-gate#coverGate          → (tuỳ chọn — chuẩn thiep_cuoi_1) lớp che mở thiệp, đè lên hero
├── 1. .section.hero#home
├── 2. .section.is-cream          → Thư mời + .triple-photo
├── 3. .section                 → Gia đình
├── 4. .section.is-cream        → .time-card + .calendar-card + .venue-card
├── 5. .section                 → .album-masonry
├── 6. .section.is-cream        → .gift-card → modal
├── 7. .section                 → #wishForm .rsvp-card
└── 8. .section.thank-you       → .thank-bg img + .thank-content
#giftModal (ngoài .app)
```

**Lưu ý `thiep_cuoi_1`:** toàn bộ nội dung thiệp (kể cả hero) **luôn có sẵn trong DOM**; `.cover-gate` chỉ là lớp **absolute** đè lên, **không** thay thế hero.

Nhịp `is-cream` xen kẽ như trên (**chuẩn** `thiep_cuoi_1`, `3`, `4`). `thiep_cuoi_2` lệch (nhiều section tối liên tiếp) — **không copy** nhịp đó trừ khi user yêu cầu.

### Tokens `:root` (chỉ đổi màu)

| Nhóm | Token | Giá trị cố định |
|------|--------|-----------------|
| Spacing | `--space-1` … `--space-10`, `--section-space`, `--head-gap`, `--content-gap`, `--stack-gap` | Giống 4 file — **`--section-space` dùng cho `.section` padding dọc** (hero/thank-you ngoại lệ) |
| Type scale | `--text-xs` … `--text-hero` | Giống 4 file |
| Radius token | `--radius-sm` … `--radius-xl` | Giống 4 file — **áp dụng** trên card/nút/modal; **không** bo `.app` |
| Font family | `--serif`, `--script`, `--date-font`, `--sans` | Không đổi |
| Theme | `--ink`, `--muted`, `--accent`, `--accent-soft`, `--surface`, `--surface-alt`, `--line`, `--shadow` | Từ file phong cách |

### Gia đình — typography gọn (bắt buộc)

Tránh chữ quá to trong card hẹp (~160px). Tham chiếu 4 file đã chỉnh:

| Phần | Chuẩn | Tránh |
|------|--------|-------|
| `.parent-name` | `13px` (`--text-base`) hoặc `11px` trên nền tối; `line-height: 1.55–1.85`; `font-weight: 500` trừ theme serif đậm | `19px`–`22px` trên card 2 cột hẹp |
| `.person-info h3` | `--script` **`24px`–`28px`**; `line-height: 1.1`; `white-space: nowrap` khi tên ngắn | `30px`+ làm card couple tràn |
| `.person-info small` | `9px`–`10px`, letter-spacing rộng, uppercase | — |

### Mọi section chính

```html
<div class="section-head" data-aos="fade-up">
  <div class="section-title">…</div>
  <div class="section-kicker">…</div>
  <!-- divider: 1 trong 3 kiểu menu bên dưới -->
</div>
```

Kicker gia đình chuẩn: **`Nhà trai & Nhà gái`**.

### JS (thứ tự + hành vi)

1. **Font loading (khuyến nghị mọi thiệp có cover / script đậm):** script sớm trong `<head>` chờ `document.fonts.ready`, thêm class `fonts-ready` lên `<html>`; ẩn `body` cho đến khi font xong; timeout fallback ~5s; Google Fonts dùng `display=block`.
2. `?guest=` / `?to=` → `#guestName`
3. **Mở thiệp `#coverGate`** (nếu có — xem mục **Cover gate** bên dưới)
4. `#giftModal` — `.is-open`, Escape, click overlay
5. Upload `#attachment` → `#preview`
6. `#wishForm` — `escapeHTML()`, `[STORAGE_KEY]`, `AOS.refresh()` khi thêm wish
7. **`AOS.init` chỉ sau khi mở cover** (hoặc ngay nếu không có cover): `once: true`, `mirror: false`, `duration: 700`, **`offset: 0`** (hero trong viewport — không cần cuộn mới animate)
8. `renderStoredWishes()` / `loadWishes()`

QR: class **`.gift-qr`**, chỉ trong modal, `object-fit: contain`.

### Cover gate — chuẩn `thiep_cuoi_1` (copy sang thiệp sau nếu user muốn màn mở thiệp)

| Quy tắc | Chi tiết |
|---------|----------|
| **Vị trí** | **Con đầu tiên của `.app`**, trước `.section.hero` — **không** đặt ngoài `.app`, **không** `position: fixed` full viewport |
| **Kích thước** | `.cover-gate { position: absolute; top: 0; left: 0; right: 0; height: 100svh; height: 100dvh; z-index: 120 }` — **chỉ che trong chiều ngang `--page-width`**, không tràn ra nền body |
| **Nội dung bên dưới** | Hero + toàn trang render sẵn; khi cánh mở → **thấy thiệp ngay**, không màn trắng, không inject HTML |
| **Cuộn sau mở** | `window.scrollTo(0, 0)` **ngay khi** `openCover()` và **lại sau** khi gỡ `cover-locked` (~820ms) — hero luôn căn đầu viewport |
| **Cánh che** | `.cover-panel--left` + `.cover-panel--right` (50% mỗi bên); nền theo theme; tên cô dâu/chú rể |
| **Dấu sáp** | `.cover-seal` + `.cover-seal__btn` (~48px), trái tim SVG chuẩn ở giữa; **chỉ trang trí** (`pointer-events: none`) |
| **Tương tác** | Click / chạm **bất kỳ đâu** trên `#coverGate` (`role="button"`, `tabindex="0"`, Enter/Space); **ẩn** `.cover-hint` khi `.is-opening` / `.is-opened` |
| **Khóa cuộn** | `html.cover-locked`, `body.cover-locked { overflow: hidden }` lúc đầu; gỡ sau khi mở xong |
| **Animation mở** | `.is-opening` → cánh `translateX(±100%)` (~820ms); đồng thời `playContentAnimations()`; `.is-opened` → `visibility: hidden` trên gate |
| **AOS sau mở** | **Không** `AOS.init` lúc load nếu có cover; gọi `initPageAnimations()` + `AOS.refresh()` trong `openCover()`; hero stagger `data-aos-delay`: 0 → 120 → 240 → 360 |

### Hero sau khi mở cover — bắt buộc (4 file có cover)

Sau khi cover mở, **toàn bộ thông tin hero** (tiêu đề, pill khách, tên cặp, ngày) phải **hiện hết trong một màn hình** — khách **không** cần cuộn để xem hero.

| Quy tắc | Chi tiết |
|---------|----------|
| **Layout `.hero-content`** | `display: grid; grid-template-rows: auto 1fr auto; height: 100%` — hàng 1: brand/divider; hàng 2: pill khách (căn giữa); hàng 3: `.hero-bottom` (tên + ngày, căn đáy) |
| **`.hero-bottom`** | Gom `.couple-names` + `.hero-date` — **không** để date nằm ngoài grid/flex hero |
| **Typography co giãn** | Trong hero dùng `clamp(…, …svh, …)` cho `.brand-label`, `.couple-names`, `.hero-date b`, padding — tránh tràn trên màn thấp |
| **Hero shell** | `.hero { overflow: hidden; height: 100svh; height: 100dvh }` |
| **Scroll** | `scrollTo(0, 0)` trong `openCover()` (xem Cover gate) |
| **AOS hero** | `offset: 0`; delay stagger 0 / 120 / 240 / 360 ms |

**Mẫu CSS hero content (overlay kiểu `thiep_cuoi_1` / `4`):**

```css
.hero-content {
  height: 100%;
  min-height: 0;
  padding: clamp(18px, 3.2svh, 34px) 24px clamp(18px, 3.2svh, 36px);
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  text-align: center;
}
.hero-content > :first-child { align-self: start; }
.hero-content > .invite-for,
.hero-content > .guest-pill { align-self: center; width: 100%; }
.hero-content > .hero-bottom { align-self: end; width: 100%; }
.hero-content .couple-names {
  font-size: clamp(38px, 9svh, 58px);
  line-height: 0.92;
}
```

**File `2`, `3`:** áp dụng cùng nguyên tắc “vừa một màn hình” — co typography / padding hero tương ứng layout oval hoặc plaque (dùng `clamp` + `svh`).

**Class naming cover:** `.cover-gate`, `.cover-panel`, `.cover-panel--left/right`, `.cover-panel__inner`, `.cover-panel__kicker`, `.cover-panel__name`, `.cover-seal`, `.cover-seal__btn`, `.cover-seal__heart`, `.cover-hint`.

**Tránh khi làm cover:** phong bì 3D phức tạp; lớp che full màn hình ngang (fixed inset 0); tách hero ra file/iframe riêng; chỉ click được nút sáp (phải click cả gate); để chữ “Chạm để mở thiệp” còn hiện sau khi mở.

### UX bổ sung — chuẩn `thiep_cuoi_1`

| Hạng mục | Quy tắc |
|----------|---------|
| **Ẩn scrollbar** | `html`, `body`: `scrollbar-width: none`, `-ms-overflow-style: none`, `::-webkit-scrollbar { display: none }` — vẫn cuộn được |
| **Font không nhảy** | Chờ font xong mới hiện trang (mục JS #1); `html { background: … }` trùng nền body khi đang chờ |
| **Trái tim dấu sáp** | Dùng path SVG trái tim đối xứng (2 đầu tròn, nhọn dưới) — **không** dùng path giọt nước |

QR: class **`.gift-qr`**, chỉ trong modal, `object-fit: contain`.

### Class naming — whitelist

Dùng đúng tên; **không** đặt `triple-photo__item`, `qr-box`, `active-date` (dùng `.photo-tile`, `.gift-qr`, `.is-active`).

### Clean code (cả 4 file đều tuân)

- Một file HTML; CSS trong `<style>`, JS một `<script>`
- Không inline `style=""`; không React/Tailwind/Bootstrap
- Spacing qua token — không rải `18px`, `22px` tùy hứng
- **Shell:** `.app` không bo góc; `.section` có padding dọc (`--section-space`); hero/thank-you `padding: 0`; hero `100svh`/`100dvh`; **mở cover → hero vừa một màn**
- `data-aos="fade-up"` trên block chính; không tự viết IntersectionObserver
- Xóa CSS/JS không dùng sau khi đổi layout
- Comment CSS theo section: `/* Hero */`, `/* Thư mời */`, …

---

## Menu biến thể — chọn 1 mỗi block theo phong cách

AI **bắt buộc** chạy **Thuật toán chọn combo** (mục Chống trùng) trước khi viết CSS. Ghi trong output: bảng fingerprint + số block đổi so với file gần nhất.

### Ma trận tham chiếu (4 file + gợi ý mới)

| Block | `thiep_cuoi_1` | `thiep_cuoi_2` | `thiep_cuoi_3` | `thiep_cuoi_4` | Gợi ý khi làm theme **mới** |
|-------|----------------|----------------|----------------|----------------|------------------------------|
| **Divider** | `.ornament` | `.gold-divider` | `.section-divider` | `.ornament` | Kiểu **chưa có** ở 4 file (rule, monogram, không ◆) |
| **Hero** | overlay `.invite-for` | `.hero-frame` | plaque + pill dọc | `.monogram` + `.invite-for` | Split, type-only, editorial band — **không** plaque chồng |
| **Pill khách** | `.invite-for` | `.guest-pill` ngang | `.guest-pill` dọc | `.invite-for` | Chọn kiểu **khác file trùng nhiều nhất** |
| **Thư mời** | `.intro-card` | `.paper-card` sáng | drop cap | `.paper-card` tối | Quote block / letter không drop cap |
| **3 ảnh** | arch `__item` | xoay `.photo-tile` | grid vòm | xoay + caption | 3 cột / strip / polaroid — **không** grid vòm nếu tránh `3` |
| **Gia đình** | 2 cột | 2 cột tối | list dọc | 2 cột gold | Timeline / 1 cột căn giữa |
| **Cặp đôi** | `.couple-split` dưới | `.couple-cards` overlay | flex tên **trên** | `.couple-split` dưới | Ảnh đôi 1 khung / tên hai bên |
| **Giờ** | `.calendar-row` | `.date-box` 2 cột | banner accent | `.countdown-strip` | Timeline / một dòng lớn |
| **Lịch head** | `.month-head` | `.calendar-head` | `.calendar-head` | `.month-head` | Đổi kiểu nếu file đích đã dùng cùng loại |
| **Lịch ngày** | — | — | — | — | **Chuẩn** `.is-active` (không `.active-date`) |
| **Địa điểm** | `.location-card` | `.venue-card` | `.venue-card` grid | `.location-card` | Pin SVG; đổi **layout** (giữa vs grid) so với file trùng |
| **Album** | masonry 9 | masonry 8 | masonry 8 | masonry 8 | `column-count: 2`; heights chuẩn; bo góc theo `.md` |
| **Cảm ơn** | `.thank-bg` img | `.thank-bg` img | img + góc khung | `.thank-bg` img | Bắt buộc `<img>`; **không** copy góc khung `3` nếu theme khác |

### Quy tắc sáng tạo có kiểm soát

1. Palette / pattern từ `[FILE_PHONG_CACH]` only.
2. Mỗi block: chọn biến thể **khác cột** file có ≥ 6/11 trùng (xem sổ đăng ký).
3. Được **trộn** block từ nhiều file (vd. divider `2` + hero `1` + ảnh strip mới) — **không** được trùng cả cột một file.
4. **Không** mặc định cover trên theme **mới** — **bốn file chuẩn `thiep_cuoi_1`…`4` đều có `.cover-gate`**; theme mới chỉ thêm khi user yêu cầu (xem mục **Cover gate**).
5. Số (giờ, ngày, tháng): `--date-font` + `lining-nums tabular-nums`.

---

## Placeholder

| Placeholder | Ví dụ |
|-------------|--------|
| `[TÊN_CÔ_DÂU]` | Minh Anh |
| `[TÊN_CHÚ_RỂ]` | Hoàng Nam |
| `[NGÀY_CƯỚI]` | 23/10/2027 |
| `[ĐỊA_ĐIỂM]` | Trung tâm tiệc cưới Sen Việt |
| `[STORAGE_KEY]` | `wedding_wishes_minh_anh` |
| `[FILE_PHONG_CACH]` | `docs/styles/01-indochine-vintage.md` |
| `[BO_THAM_CHIEU]` | `thiep_cuoi_1` … `thiep_cuoi_4` (đọc cả 4 để tránh trùng layout) |
| `[TEN_FILE_MOI]` | `thiep_cuoi_5.html` (hoặc tên user chỉ định) |

---

## PROMPT GỬI CHO AI

````markdown
# Nhiệm vụ

Senior Frontend — tạo **một file `.html`** thiệp mời cưới tiếng Việt, mobile-first 420px.

## Input

1. **Phong cách:** `[FILE_PHONG_CACH]` — màu, mood, tránh gì (chỉ `.md`).
2. **Bộ tham chiếu code:** Đọc **cả bốn** (hoặc user chỉ định):
   - `thiep_cuoi_1.html` … `thiep_cuoi_4.html`  
   → Rút **hợp đồng chung** (section, tokens, class, JS).  
   → Đọc **sổ đăng ký layout** trong prompt — chọn combo **không trùng ≥ 6/11** với bất kỳ file nào.

3. **Trước khi code:** điền bảng fingerprint (mẫu cuối section Output). Nếu trùng `thiep_cuoi_3` hoặc `4` quá nhiều → đổi Hero + 3 ảnh + Cặp đôi trước.

4. Câu user thường gặp: *「theo prompt + phong cách X; skeleton 4 file; **không trùng layout** thiệp 1–4」*

## Quy tắc cứng vs mềm

**Cứng:** 8 section + nhịp `is-cream`; tokens spacing/type; class whitelist; AOS (`offset: 0`); modal `.gift-qr`; `.calendar-grid .is-active`; `escapeHTML`; không inline style; **`.app` `border-radius: 0`**; **`.section` `padding: var(--section-space) 22px`** (hero/thank-you `padding: 0`); **hero `100svh`/`100dvh`** + **vừa một màn sau mở cover**; **tên gia đình/couple gọn** (bảng typography).

**Mềm (theo phong cách + chống trùng):** màu `:root`; divider; hero; `.triple-photo`; couple; giờ/lịch/địa điểm; pattern nền — **mỗi mục phải khác signature file gần nhất** (bảng 11 block).

## `:root` — copy tokens, chỉ sửa màu

```css
:root {
  --ink: …; --muted: …; --accent: …; --accent-soft: …;
  --surface: …; --surface-alt: …; --line: …; --shadow: …;
  --serif: "Cormorant Garamond", serif;
  --script: "Great Vibes", cursive;
  --date-font: "Libre Baskerville", serif;
  --sans: "Be Vietnam Pro", sans-serif;
  --page-width: 420px;
  --space-1: 4px; … --space-10: 44px;
  --section-space: var(--space-10);
  --head-gap: var(--space-6);
  --content-gap: var(--space-5);
  --stack-gap: var(--space-3);
  --radius-sm: 18px; --radius-md: 24px; --radius-lg: 28px; --radius-xl: 32px;
  --text-xs: 10px; … --text-hero: 62px;
}

.app {
  width: min(100%, var(--page-width));
  margin: 0 auto;
  border-radius: 0;
  overflow: hidden;
}

.section {
  padding: var(--section-space) 22px;
}

.section.hero,
.section.thank-you {
  padding: 0;
}

.section.hero {
  min-height: 100svh;
  min-height: 100dvh;
  height: 100svh;
  height: 100dvh;
  overflow: hidden;
}
```

## HTML skeleton

```html
<!-- Font gate (khuyến nghị) — script ngay sau link Google Fonts -->
<script>
  (function () {
    var root = document.documentElement;
    function showPage() { root.classList.add("fonts-ready"); }
    if (!document.fonts || !document.fonts.ready) { showPage(); return; }
    var t = setTimeout(showPage, 5000);
    document.fonts.ready.then(function () { clearTimeout(t); showPage(); });
  })();
</script>

<body class="cover-locked"> <!-- bỏ cover-locked nếu không có cover -->
<main class="app">
  <!-- Cover gate (tuỳ chọn — thiep_cuoi_1) -->
  <div class="cover-gate" id="coverGate" role="button" tabindex="0" aria-label="Chạm để mở thiệp">
    <div class="cover-panel cover-panel--left">…Cô dâu…</div>
    <div class="cover-panel cover-panel--right">…Chú rể…</div>
    <div class="cover-seal" aria-hidden="true">
      <span class="cover-seal__btn">
        <svg class="cover-seal__heart" viewBox="0 0 24 24">…</svg>
      </span>
    </div>
    <p class="cover-hint">Chạm để mở thiệp</p>
  </div>

  <section class="section hero" id="home">
    <div class="hero-photo"><img … /></div>
    <div class="hero-content">…couple-names…hero-date…guest-pill…</div>
  </section>
  <section class="section is-cream">
    <div class="intro-card" data-aos="fade-up">…section-head…letter…
      <div class="triple-photo">
        <figure class="triple-photo__item">…</figure> ×3
      </div>
    </div>
  </section>
  <section class="section">…parents-grid…couple-split…</section>
  <section class="section is-cream">…time-card…month-card…location-card…</section>
  <section class="section">…album-masonry…</section>
  <section class="section is-cream">…gift-card…</section>
  <section class="section">…rsvp-card #wishForm…</section>
  <section class="section thank-you">
    <div class="hero-photo"><img … /></div>
    <div class="thank-content" data-aos="fade-up">…</div>
  </section>
</main>
<div class="modal" id="giftModal" …>…gift-qr…</div>
</body>
```

CSS font gate:
```css
html { background: #f4eadf; } /* trùng nền body */
html:not(.fonts-ready) body { visibility: hidden; }
html.fonts-ready body { visibility: visible; }
```

## Pattern bắt buộc (đã chuẩn hoá từ 4 file)

**Lịch — một trong hai (đổi kiểu nếu file đích đã dùng loại kia):**

`.calendar-head` (2 dòng):
```html
<div class="calendar-head">
  <span class="calendar-label">Lịch cưới</span>
  <strong class="calendar-period">Tháng 10 · 2027</strong>
</div>
```

`.month-head` (trái Tháng / phải Năm) — như `thiep_cuoi_1`, `thiep_cuoi_4`.

**Địa điểm — pin SVG** (`M12 21s7-5.1…`): `.location-card` (căn giữa) **hoặc** `.venue-card` (giữa hoặc grid) — chọn layout **khác** file trùng nhiều nhất.

**Album masonry** (từ `thiep_cuoi_2` / `3` / `4`):
```css
.album-masonry { column-count: 2; column-gap: 10px; }
.album-item { break-inside: avoid; margin-bottom: 10px; overflow: hidden; }
/* heights: 230,162,190,240,152,210,176,224 px cho nth-child 1–8 */
```

**Upload:**
```css
.field label:not(.upload-box) { display: block; }
.field label.upload-box {
  display: flex; align-items: center; justify-content: center; width: 100%;
}
```

**Hero:** một trong các biến thể menu — **luôn** `min-height`/`height: 100svh` + `100dvh`; `padding: 0`; `overflow: hidden`; triển khai nội bộ theo bảng shell ở trên — **sau mở cover, hero hiện hết không cuộn** (grid + `clamp(svh)` với overlay; co typography với oval/plaque) — **cấm** clone plaque chồng band (`thiep_cuoi_3`) hoặc oval (`thiep_cuoi_2`) trừ khi sửa đúng file đó.

**Couple:** `.couple-split` (tên dưới ảnh) **hoặc** `.couple-cards` (overlay / flex tên trên) — chọn **khác** file có cùng palette group và trùng ≥ 6/10.

## Typography

| Vai trò | Font |
|---------|------|
| Section title | `--script` + `--text-2xl` |
| Hero names | `--script` + `--text-hero` |
| Card h3, copy | `--serif` / `--sans` |
| **Mọi dòng có số** (giờ, ngày, tháng) | `--date-font` + `lining-nums tabular-nums` |

## JS + AOS

Giữ thứ tự **Hợp đồng chung** (font gate → guest → cover → modal → form → AOS).

**Nếu có cover gate** (`thiep_cuoi_1`):
```javascript
const coverGate = document.getElementById("coverGate");
const appRoot = document.querySelector(".app");
let coverOpened = false;
let aosReady = false;
const COVER_PANEL_MS = 820;

function initPageAnimations() {
  if (aosReady) return;
  aosReady = true;
      AOS.init({ once: true, mirror: false, duration: 700, offset: 0, easing: "ease-out-cubic" });
  renderStoredWishes();
}

function playContentAnimations() {
  appRoot.classList.add("is-content-ready");
  initPageAnimations();
  requestAnimationFrame(() => AOS.refresh());
}

function openCover() {
  if (coverOpened) return;
  coverOpened = true;
  window.scrollTo(0, 0);
  playContentAnimations();
  coverGate.classList.add("is-opening");
  setTimeout(() => {
    coverGate.classList.add("is-opened");
    coverGate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cover-locked");
    document.documentElement.classList.remove("cover-locked");
    window.scrollTo(0, 0);
  }, COVER_PANEL_MS);
}

coverGate.addEventListener("click", openCover);
document.documentElement.classList.add("cover-locked");
```

**Hero AOS stagger** (sau khi mở): `fade-down` tiêu đề → `fade-up` pill khách (120ms) → tên (240ms) → ngày (360ms).

## Ảnh

- `object-fit: cover` (cưới); `contain` (QR)
- Không grayscale/invert
- URL ổn định: `photo-1523438885200` (hero), `photo-1494774157365` (thank), các id trong 4 file mẫu

## Checklist

- [ ] Skeleton 8 section + nhịp `is-cream` như 4 file mẫu
- [ ] Shell: `.app` không bo góc; không `body` padding dọc; `.section` có `--section-space` dọc (trừ hero/thank-you)
- [ ] Hero full `100svh`/`100dvh`; **mở cover xong — hero hiện hết, không cuộn** (grid + `clamp` + `scrollTo(0,0)`)
- [ ] **Cover gate (nếu có):** nằm **trong `.app`**, absolute `100svh`/`100dvh`, không full viewport ngang; nội dung hero sẵn DOM; hint ẩn sau mở; AOS sau `openCover`; **`offset: 0`**
- [ ] **Font:** chờ `document.fonts.ready` trước khi hiện trang (nếu dùng cover / script nhiều)
- [ ] **Scrollbar:** ẩn thanh cuộn, vẫn cuộn được
- [ ] Gia đình: `.parent-name` ≤ `13px` (hoặc `11px` nền tối); `.person-info h3` `24–28px`
- [ ] Palette từ `[FILE_PHONG_CACH]` only
- [ ] **Fingerprint:** trùng ≤ 5/11 với mỗi `thiep_cuoi_1`…`4` (ghi bảng trong output)
- [ ] Không clone 11/11 một cột sổ đăng ký
- [ ] `.is-active`, `.gift-qr`, thank có `<img>` trong `.thank-bg`
- [ ] Số: `--date-font` + lining-nums
- [ ] 420px: không overlap, không text cắt
- [ ] Code sạch: token, không dead CSS, không inline style

## Output

1. Một file `[TEN_FILE_MOI].html`
2. Tóm tắt **8–12 dòng** gồm:
   - Palette từ file `.md`
   - Bảng **Layout fingerprint** (11 block → tên biến thể)
   - Dòng: `Trùng thiep_cuoi_X: N/11` cho X = 1,2,3,4 (mỗi N ≤ 5)
   - File tham chiếu gần nhất đã **tránh** và 3 block đã đổi

**Mẫu fingerprint (copy vào output):**

| Block | Biến thể đã chọn | Tránh (file) |
|-------|------------------|--------------|
| Divider | … | không giống `3` |
| Hero | … | … |
| … | … | … |
````

---

## Gửi AI — mẫu lệnh (copy)

```
Tạo thiệp cưới HTML theo @docs/prompt-tao-thiep-cuoi.md

Phong cách: @docs/styles/[ten-phong-cach].md
Bộ skeleton: đọc thiep_cuoi_1.html … thiep_cuoi_4.html
→ Cùng hợp đồng (8 section, tokens, JS, shell full-width, hero 100svh/100dvh, cover + hero vừa màn). Combo layout KHÔNG trùng ≥ 6/11 với bất kỳ file 1–4 (bảng fingerprint bắt buộc trong output). **Sửa hành vi chuẩn → cập nhật `docs/prompt-tao-thiep-cuoi.md`.**

Thông tin:
- Cô dâu: …
- Chú rể: …
- Ngày: …
- Địa điểm: …
- STK / VietQR: …
```

---

## Tóm tắt cho người dùng

| Câu hỏi | Trả lời |
|---------|---------|
| Tại sao 4 file? | Skeleton chung + **4 signature layout** để theme mới không trùng |
| Theme mới ra sao? | `.md` (màu) + **combo block khác** sổ đăng ký (≤ 5/11 trùng mỗi file) |
| Trùng Indochine / Luxury? | Đổi Hero + 3 ảnh + couple — đổi màu không đủ |
| Tránh gì? | Clone cả cột một `thiep_cuoi_*.html`; class lệch (`qr-box`, `active-date`) |
| Xem nhanh 4 mẫu? | Mở `index.html` — liên kết tới `thiep_cuoi_1`…`4` |
| Hero / vỏ trang? | Hero **`100svh`/`100dvh`**; mở cover → **hero vừa một màn**, không cuộn; grid + `clamp(svh)` |
| Mở thiệp? | **Cả 4 file chuẩn** có `.cover-gate` trong `.app`; click anywhere; AOS sau mở; `scrollTo(0,0)` |
| Font / scrollbar? | Chờ font (`fonts-ready`); ẩn scrollbar toàn trang |
| Cập nhật prompt? | **Luôn** sửa `docs/prompt-tao-thiep-cuoi.md` khi đổi hành vi cover/hero/font/AOS trên file chuẩn |

### Chỉ lệch hợp đồng khi user nói rõ

Bỏ form, bỏ lịch, bỏ cover mở thiệp, thêm nhạc, đổi nhịp `is-cream`, v.v.

### Kế thừa cover gate sang thiệp mới

Khi user yêu cầu màn mở thiệp, **copy block từ file chuẩn cùng palette** (vd. đỏ/vàng → `thiep_cuoi_2`, indochine → `thiep_cuoi_3`, luxury → `thiep_cuoi_4`, kem/nâu → `thiep_cuoi_1`):

1. CSS cover + `cover-locked` + font gate + ẩn scrollbar
2. HTML `.cover-gate` đầu `.app`
3. JS mục mở thiệp + defer AOS + **`scrollTo(0, 0)`**
4. Hero grid + `clamp(svh)` + `.hero-bottom` (xem **Hero sau khi mở cover**)
5. Đổi tên cô dâu/chú rể; **giữ** màu theo `:root` theme file đích

### Bảo trì (khi merge thiệp mới vào repo)

Sau khi tạo `thiep_cuoi_5.html` (hoặc sửa mạnh file 1–4):

1. **Cập nhật cột mới** trong bảng **Sổ đăng ký layout** ở đầu file này (11 block + đặc trưng), để lần sau AI không trùng lại.
2. **Cập nhật prompt cùng lúc với code** — cover gate, hero grid/`clamp`, `scrollTo`, font gate, AOS `offset: 0`, v.v. (xem mục **Cover gate**, **Hero sau khi mở cover**).
3. **Giữ shell chuẩn:** `.app` `border-radius: 0`; `.section` `padding: var(--section-space) 22px` (hero/thank-you `padding: 0`); hero `100svh`/`100dvh` + `overflow: hidden`; typography gia đình gọn.
4. Thêm liên kết vào **`index.html`** nếu file mới là mẫu công khai trong repo.

**Checklist nhanh sau khi sửa thiệp chuẩn:**

- [ ] Hero vẫn vừa một màn sau mở cover (test mobile ~360–430px)?
- [ ] `docs/prompt-tao-thiep-cuoi.md` đã phản ánh thay đổi?
- [ ] JS mẫu trong prompt khớp code thực tế?
