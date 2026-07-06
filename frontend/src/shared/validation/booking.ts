import { z } from "zod";
import type { ParticipantInput, ScheduleSlot } from "@/api/types";

export const phoneSchema = z.string().regex(/^\+[1-9]\d{7,14}$/, "Телефон должен быть в формате E.164");
export const codeSchema = z.string().min(4, "Введите минимум 4 символа").max(8, "Код слишком длинный");

export const participantSchema = z
  .object({
    name: z.string().trim().min(1, "Укажите имя участника"),
    allergyStatus: z.enum(["none", "has_allergy"]),
    allergyComment: z.string().optional().nullable(),
    equipmentOption: z.enum(["own", "rental"])
  })
  .superRefine((value, ctx) => {
    if (value.allergyStatus === "has_allergy" && !value.allergyComment?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allergyComment"],
        message: "При аллергии нужен комментарий"
      });
    }
  });

export const bookingDraftSchema = z.object({
  clientName: z.string().trim().min(1, "Укажите имя основного клиента"),
  participants: z.array(participantSchema).min(1, "Добавьте хотя бы одного участника")
});

export function validateParticipantsForSlot(slot: ScheduleSlot, participants: ParticipantInput[]): string | null {
  if (participants.length < 1) return "Нужен хотя бы один участник.";
  if (participants.length > slot.availableSeats) return "Количество участников превышает свободные места.";
  const parsed = z.array(participantSchema).safeParse(participants);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Проверьте участников.";
  return null;
}
