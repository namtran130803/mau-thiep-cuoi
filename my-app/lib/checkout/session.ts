import { cookies } from "next/headers";

const CHECKOUT_COOKIE = "goatwedding_checkout";
const CHECKOUT_MAX_AGE = 60 * 60 * 24 * 7;

export async function setCheckoutOrderId(orderId: string) {
  const jar = await cookies();
  jar.set(CHECKOUT_COOKIE, orderId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CHECKOUT_MAX_AGE,
  });
}

export async function getCheckoutOrderId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(CHECKOUT_COOKIE)?.value;
}

export async function assertCheckoutOrder(orderId: string) {
  const current = await getCheckoutOrderId();
  if (!current || current !== orderId) {
    throw new Error(
      "Phiên đặt hàng không hợp lệ. Vui lòng tạo và thanh toán thiệp trên cùng một thiết bị.",
    );
  }
}

export async function clearCheckoutOrder() {
  const jar = await cookies();
  jar.delete(CHECKOUT_COOKIE);
}
