# Prompt: Tạo thiệp cưới HTML single-file (họ template thống nhất)

> Mục tiêu: AI sinh thiệp **sạch, cùng “khung xương”** giữa các phong cách, nhưng **visual sáng tạo** theo file phong cách — không clone một mẫu đỏ/vàng hay kem/nâu.

## Cách dùng — gửi AI

| # | File | Vai trò |
|---|------|---------|
| 1 | **File này** | Quy tắc hợp đồng + menu biến thể |
| 2 | **`docs/styles/XX-*.md`** | Palette, mood, họa tiết, **Tránh** — nguồn visual **duy nhất** |
| 3 | **Bốn thiệp chuẩn** (đọc để hiểu skeleton + **layout đã chiếm**): |
| | `thiep_cuoi_1.html` | Kem/nâu · ornament · hero overlay · arch 3 ảnh |
| | `thiep_cuoi_2.html` | Đỏ/vàng · gold-divider · hero oval · ảnh xoay |
| | `thiep_cuoi_3.html` | Indochine · plaque chồng band · grid panorama · tên trên ảnh |
| | `thiep_cuoi_4.html` | Đen/vàng · monogram · countdown · calendar-row giữa |

Copy khối **「PROMPT GỬI CHO AI」**, thay `[...]`, đính kèm **file phong cách + 4 file HTML** (hoặc ít nhất 3 file + file theme mới nhất).

> **Palette** chỉ từ `docs/styles/XX-*.md`. **Combo layout** không được trùng “DNA” bất kỳ file `thiep_cuoi_*.html` nào — xem mục **Chống trùng phong cách** bên dưới.

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

Mỗi cột = **một chữ ký (signature)** đang được dùng. Theme mới **không** được trùng ≥ **6/10** ô cùng cột với bất kỳ file nào.

| Block | `thiep_cuoi_1` | `thiep_cuoi_2` | `thiep_cuoi_3` | `thiep_cuoi_4` |
|-------|----------------|----------------|----------------|----------------|
| **Divider** | `.ornament` SVG | `.gold-divider` | `.section-divider` ◆ | `.ornament` SVG |
| **Hero** | Overlay flex + `.invite-for` | `.hero-frame` oval | Band + `.hero-plaque` + pill dọc | Overlay + `.monogram` + `.invite-for` |
| **Thư mời** | `.intro-card` | `.paper-card` sáng | `.intro-card` + drop cap | `.paper-card` tối + `.invite-copy` |
| **3 ảnh** | `.triple-photo__item` arch absolute | `.photo-tile` xoay chồng | Grid panorama vòm | `.photo-tile` xoay + `.triple-caption` |
| **Gia đình** | `.parents-grid` 2 cột | `.parents-grid` card tối | List dọc 1 cột viền | `.parents-grid` 2 cột viền gold |
| **Cặp đôi** | `.couple-split` tên **dưới** ảnh | `.couple-cards` grid overlay | `.couple-cards` flex tên **trên** ảnh | `.couple-split` tên dưới ảnh |
| **Giờ** | `.calendar-row` + `.time-main` | `.time-card` 2 cột `.date-box` | Banner accent `.date-box` | `.countdown-strip` + `.calendar-row` |
| **Lịch head** | `.month-head` trái/phải | `.calendar-head` 2 dòng | `.calendar-head` 2 dòng | `.month-head` trái/phải |
| **Địa điểm** | `.location-card` giữa | `.venue-card` giữa | `.venue-card` grid pin | `.location-card` giữa |
| **Đặc trưng khác** | lá SVG trang trí | nền đỏ gradient | `.is-framed` góc | pinstripe + khung kép |

### Thuật toán chọn combo cho theme mới

```
Bước 1 — Đọc [FILE_PHONG_CACH].md → palette, mood, Tránh.
Bước 2 — Liệt kê 4 cột bảng trên; với MỖI block chọn biến thể KHÁC hàng đã chiếm
         của file “gần giống” nhất (cùng nhóm: tối/sang, vintage, đỏ, kem…).
Bước 3 — Đếm trùng từng cột file 1…4:
         • Nếu trùng ≥ 6/10 với một file → đổi ít nhất 3 block (ưu tiên Hero, 3 ảnh, Cặp đôi, Giờ).
         • Không được trùng 10/10 (clone).
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

### Cấu trúc trang

```
.app (max 420px)
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

Nhịp `is-cream` xen kẽ như trên (**chuẩn** `thiep_cuoi_1`, `3`, `4`). `thiep_cuoi_2` lệch (nhiều section tối liên tiếp) — **không copy** nhịp đó trừ khi user yêu cầu.

### Tokens `:root` (chỉ đổi màu)

| Nhóm | Token | Giá trị cố định |
|------|--------|-----------------|
| Spacing | `--space-1` … `--space-10`, `--section-space`, `--head-gap`, `--content-gap`, `--stack-gap` | Giống 4 file |
| Type scale | `--text-xs` … `--text-hero` | Giống 4 file |
| Radius token | `--radius-sm` … `--radius-xl` | Giống 4 file — **áp dụng** giá trị nhỏ/lớn theo theme |
| Font family | `--serif`, `--script`, `--date-font`, `--sans` | Không đổi |
| Theme | `--ink`, `--muted`, `--accent`, `--accent-soft`, `--surface`, `--surface-alt`, `--line`, `--shadow` | Từ file phong cách |

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

1. `?guest=` / `?to=` → `#guestName`
2. `#giftModal` — `.is-open`, Escape, click overlay
3. Upload `#attachment` → `#preview`
4. `#wishForm` — `escapeHTML()`, `[STORAGE_KEY]`, `AOS.refresh()` khi thêm wish
5. `AOS.init({ once: false, mirror: true, duration: 800, offset: 100, easing: "ease-out-cubic" })`
6. `loadWishes()`

QR: class **`.gift-qr`**, chỉ trong modal, `object-fit: contain`.

### Class naming — whitelist

Dùng đúng tên; **không** đặt `triple-photo__item`, `qr-box`, `active-date` (dùng `.photo-tile`, `.gift-qr`, `.is-active`).

### Clean code (cả 4 file đều tuân)

- Một file HTML; CSS trong `<style>`, JS một `<script>`
- Không inline `style=""`; không React/Tailwind/Bootstrap
- Spacing qua token — không rải `18px`, `22px` tùy hứng
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
2. Mỗi block: chọn biến thể **khác cột** file có ≥ 6/10 trùng (xem sổ đăng ký).
3. Được **trộn** block từ nhiều file (vd. divider `2` + hero `1` + ảnh strip mới) — **không** được trùng cả cột một file.
4. **Không** mặc định: phong bì, wax seal, cánh hoa, “Chạm để mở” (trừ `.md` / user).
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
   → Đọc **sổ đăng ký layout** trong prompt — chọn combo **không trùng ≥ 6/10** với bất kỳ file nào.

3. **Trước khi code:** điền bảng fingerprint (mẫu cuối section Output). Nếu trùng `thiep_cuoi_3` hoặc `4` quá nhiều → đổi Hero + 3 ảnh + Cặp đôi trước.

4. Câu user thường gặp: *「theo prompt + phong cách X; skeleton 4 file; **không trùng layout** thiệp 1–4」*

## Quy tắc cứng vs mềm

**Cứng:** 8 section + nhịp `is-cream`; tokens spacing/type; class whitelist; AOS; modal `.gift-qr`; `.calendar-grid .is-active`; `escapeHTML`; không inline style.

**Mềm (theo phong cách + chống trùng):** màu `:root`; divider; hero; `.triple-photo`; couple; giờ/lịch/địa điểm; pattern nền — **mỗi mục phải khác signature file gần nhất** (bảng 10 block).

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
```

## HTML skeleton

```html
<main class="app">
  <section class="section hero" id="home">
    <div class="hero-photo"><img … /></div>
    <div class="hero-content">…couple-names…hero-date…guest-pill…</div>
  </section>
  <section class="section is-cream">
    <div class="intro-card" data-aos="fade-up">…section-head…letter…
      <div class="triple-photo">
        <figure class="photo-tile">…</figure> ×3
      </div>
    </div>
  </section>
  <section class="section">…parents-grid…couple-split HOẶC couple-cards…</section>
  <section class="section is-cream">…time-card…calendar-card…location-card HOẶC venue-card…</section>
  <section class="section">…album-masonry…</section>
  <section class="section is-cream">…gift-card…</section>
  <section class="section">…rsvp-card #wishForm…</section>
  <section class="section thank-you">
    <div class="thank-bg"><img … /></div>
    <div class="thank-content" data-aos="fade-up">…</div>
  </section>
</main>
<div class="modal" id="giftModal" …>…gift-qr…</div>
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

**Hero:** một trong các biến thể menu — **không** bắt buộc flex; **cấm** clone plaque chồng band (`thiep_cuoi_3`) hoặc oval (`thiep_cuoi_2`) trừ khi sửa đúng file đó.

**Couple:** `.couple-split` (tên dưới ảnh) **hoặc** `.couple-cards` (overlay / flex tên trên) — chọn **khác** file có cùng palette group và trùng ≥ 6/10.

## Typography

| Vai trò | Font |
|---------|------|
| Section title | `--script` + `--text-2xl` |
| Hero names | `--script` + `--text-hero` |
| Card h3, copy | `--serif` / `--sans` |
| **Mọi dòng có số** (giờ, ngày, tháng) | `--date-font` + `lining-nums tabular-nums` |

## JS + AOS

Giữ thứ tự và config như **Hợp đồng chung** ở trên.

## Ảnh

- `object-fit: cover` (cưới); `contain` (QR)
- Không grayscale/invert
- URL ổn định: `photo-1523438885200` (hero), `photo-1494774157365` (thank), các id trong 4 file mẫu

## Checklist

- [ ] Skeleton 8 section + nhịp `is-cream` như 4 file mẫu
- [ ] Palette từ `[FILE_PHONG_CACH]` only
- [ ] **Fingerprint:** trùng ≤ 5/10 với mỗi `thiep_cuoi_1`…`4` (ghi bảng trong output)
- [ ] Không clone 10/10 một cột sổ đăng ký
- [ ] `.is-active`, `.gift-qr`, thank có `<img>` trong `.thank-bg`
- [ ] Số: `--date-font` + lining-nums
- [ ] 420px: không overlap, không text cắt
- [ ] Code sạch: token, không dead CSS, không inline style

## Output

1. Một file `[TEN_FILE_MOI].html`
2. Tóm tắt **8–12 dòng** gồm:
   - Palette từ file `.md`
   - Bảng **Layout fingerprint** (10 block → tên biến thể)
   - Dòng: `Trùng thiep_cuoi_X: N/10` cho X = 1,2,3,4 (mỗi N ≤ 5)
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
Tạo thiệp cưới HTML theo @prompt-tao-thiep-cuoi-html-dong-nhat.md

Phong cách: @docs/styles/[ten-phong-cach].md
Bộ skeleton: đọc thiep_cuoi_1.html … thiep_cuoi_4.html
→ Cùng hợp đồng (8 section, tokens, JS). Combo layout KHÔNG trùng ≥ 6/10 với bất kỳ file 1–4 (bảng fingerprint bắt buộc trong output).

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
| Theme mới ra sao? | `.md` (màu) + **combo block khác** sổ đăng ký (≤ 5/10 trùng mỗi file) |
| Trùng Indochine / Luxury? | Đổi Hero + 3 ảnh + couple — đổi màu không đủ |
| Tránh gì? | Clone cả cột một `thiep_cuoi_*.html`; class lệch (`qr-box`, `active-date`) |

### Chỉ lệch hợp đồng khi user nói rõ

Bỏ form, bỏ lịch, thêm nhạc, thêm phong bì, đổi nhịp `is-cream`, v.v.

### Bảo trì (khi merge thiệp mới vào repo)

Sau khi tạo `thiep_cuoi_5.html` (hoặc sửa mạnh file 1–4): **cập nhật cột mới** trong bảng **Sổ đăng ký layout** ở đầu file này (10 block + đặc trưng), để lần sau AI không trùng lại.
