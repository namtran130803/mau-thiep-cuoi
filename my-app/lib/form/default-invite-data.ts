import { demoInviteData } from "@/data/demo";
import type { InviteFormData } from "@/lib/validation/invite";

export function createEmptyInviteFormData(): InviteFormData {
  return {
    brideName: "",
    groomName: "",
    weddingAt: "",
    groomFamily: {
      fatherName: "",
      motherName: "",
      address: "",
    },
    brideFamily: {
      fatherName: "",
      motherName: "",
      address: "",
    },
    venue: {
      name: "",
      address: "",
      mapUrl: "",
    },
    images: {
      hero: "",
      invitation: ["", "", ""],
      family: ["", ""],
      gallery: ["", "", "", "", "", "", "", "", "", ""],
      thankYou: "",
    },
    bankAccount: {
      bankBin: "",
      accountNumber: "",
      accountName: "",
      bankName: "",
      transferNote: "",
    },
    wishNotificationEmail: "",
  };
}

export function createDemoInviteFormData(): InviteFormData {
  return structuredClone(demoInviteData);
}
