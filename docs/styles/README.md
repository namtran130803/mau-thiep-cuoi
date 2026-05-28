# Thư viện phong cách thiệp cưới (20 mẫu)

Mỗi file mô tả **một phong cách UI** độc lập. Gửi cho AI **2–3 file**:

1. [`../prompt-create-wedding-template.md`](../prompt-create-wedding-template.md) — quy tắc code, schema data, sections bắt buộc  
2. [`../template-integration-guide.md`](../template-integration-guide.md) — tích hợp repo, `embedded`, motion, gift/QR shared, scroll, âm thanh  
3. **Một file trong thư mục này** — phong cách cụ thể

## Cách gửi prompt

```
Đính kèm:
- docs/prompt-create-wedding-template.md (đã điền [TÊN_TEMPLATE], [TÊN_FILE])
- docs/template-integration-guide.md
- docs/styles/XX-ten-phong-cach.md

Trong prompt chính, thay [PHONG_CÁCH] bằng: "Xem file phong cách đính kèm"
hoặc copy khối "Paste vào [PHONG_CÁCH]" ở cuối file style.
```

## Danh sách 20 phong cách

| # | File | Tên style | Nhóm |
|---|------|-----------|------|
| 1 | [01-indochine-vintage.md](./01-indochine-vintage.md) | Indochine Vintage | Kinh điển & sang trọng |
| 2 | [02-luxury-black-gold.md](./02-luxury-black-gold.md) | Luxury Black & Gold | Kinh điển & sang trọng |
| 3 | [03-old-money-elegance.md](./03-old-money-elegance.md) | Old Money Elegance | Kinh điển & sang trọng |
| 4 | [04-art-deco-geometric.md](./04-art-deco-geometric.md) | Art Deco Geometric | Kinh điển & sang trọng |
| 5 | [05-minimal-monochrome.md](./05-minimal-monochrome.md) | Minimal Monochrome | Hiện đại & tối giản |
| 6 | [06-modern-glassmorphism.md](./06-modern-glassmorphism.md) | Modern Glassmorphism | Hiện đại & tối giản |
| 7 | [07-korean-clean-white.md](./07-korean-clean-white.md) | Korean Clean White | Hiện đại & tối giản |
| 8 | [08-cyberpunk-neo-mint.md](./08-cyberpunk-neo-mint.md) | Cyberpunk Neo-Mint | Hiện đại & tối giản |
| 9 | [09-tropical-garden.md](./09-tropical-garden.md) | Tropical Garden | Tự nhiên & mộc mạc |
| 10 | [10-rustic-farmhouse.md](./10-rustic-farmhouse.md) | Rustic Farmhouse | Tự nhiên & mộc mạc |
| 11 | [11-watercolor-pastel.md](./11-watercolor-pastel.md) | Watercolor Pastel | Tự nhiên & mộc mạc |
| 12 | [12-terracotta-desert.md](./12-terracotta-desert.md) | Terracotta Desert | Tự nhiên & mộc mạc |
| 13 | [13-chinese-traditional-red.md](./13-chinese-traditional-red.md) | Chinese Traditional Red | Truyền thống & văn hóa |
| 14 | [14-kyoto-autumn.md](./14-kyoto-autumn.md) | Kyoto Autumn | Truyền thống & văn hóa |
| 15 | [15-mediterranean-olive.md](./15-mediterranean-olive.md) | Mediterranean Olive | Truyền thống & văn hóa |
| 16 | [16-retro-pop-art.md](./16-retro-pop-art.md) | Retro Pop-Art | Sáng tạo & phá cách |
| 17 | [17-editorial-magazine.md](./17-editorial-magazine.md) | Editorial Magazine | Sáng tạo & phá cách |
| 18 | [18-botanical-anatomy.md](./18-botanical-anatomy.md) | Botanical Anatomy | Sáng tạo & phá cách |
| 19 | [19-dark-academic.md](./19-dark-academic.md) | Dark Academic | Sáng tạo & phá cách |
| 20 | [20-bauhaus-functionalism.md](./20-bauhaus-functionalism.md) | Bauhaus Functionalism | Sáng tạo & phá cách |

## Template đã có trong repo

| ID route | Template | Phong cách |
|----------|----------|------------|
| `1` | thiep-cuoi-1 | Indochine Vintage — `GiftTransferCard` variant `classic` |
| `2` | thiep-cuoi-2 | Luxury Black & Gold — variant `luxury` |
| `3` | thiep-cuoi-3 | Old Money Elegance — variant `minimal` |

**Chọn `GiftTransferCard` / `GiftQrLightbox` variant:** nền tối/vàng → `luxury`; nền sáng navy/trắng → `minimal`; vintage/Indochine → `classic`.

Template mới → `templates/thiep-cuoi-N/`, `lib/wedding-templates.tsx`, routes `/mau-thiep/N` (preview) và `/mau-thiep-moi/N` (demo SSG).
