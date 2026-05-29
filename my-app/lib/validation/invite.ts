import { z } from "zod";

export const packageTypeSchema = z.enum(["single", "dual_same", "dual_diff"]);

export const familySideSchema = z.object({
  fatherName: z.string().min(1, "Vui lòng nhập tên bố"),
  motherName: z.string().min(1, "Vui lòng nhập tên mẹ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
});

export const inviteDataSchema = z.object({
  brideName: z.string().min(1, "Vui lòng nhập tên cô dâu"),
  groomName: z.string().min(1, "Vui lòng nhập tên chú rể"),
  weddingAt: z.string().min(1, "Vui lòng chọn thời gian"),
  groomFamily: familySideSchema,
  brideFamily: familySideSchema,
  venue: z.object({
    name: z.string().min(1, "Vui lòng nhập địa điểm"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    mapUrl: z.string().optional(),
  }),
  images: z.object({
    hero: z.string().min(1, "Vui lòng tải lên ảnh bìa"),
    invitation: z.tuple([z.string(), z.string(), z.string()]),
    family: z.tuple([z.string(), z.string()]),
    gallery: z.tuple([
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
      z.string(),
    ]),
    thankYou: z.string().min(1, "Vui lòng tải lên ảnh kết thiệp"),
  }),
  bankAccount: z.object({
    bankBin: z.string().optional().default(""),
    accountNumber: z.string().min(1, "Vui lòng nhập số tài khoản"),
    accountName: z.string().min(1, "Vui lòng nhập tên chủ tài khoản"),
    bankName: z.string().min(1, "Vui lòng nhập tên ngân hàng"),
    transferNote: z.string().optional(),
  }),
  wishNotificationEmail: z.string().email("Email không hợp lệ"),
});

export const createOrderSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  packageType: packageTypeSchema,
  guestNameService: z.boolean().default(false),
});

export const saveInvitationSchema = z.object({
  orderId: z.string().min(1),
  templateSlug: z.string().min(1),
  label: z.string().optional(),
  invitationId: z.string().optional(),
  data: inviteDataSchema,
});

export type InviteFormData = z.infer<typeof inviteDataSchema>;
