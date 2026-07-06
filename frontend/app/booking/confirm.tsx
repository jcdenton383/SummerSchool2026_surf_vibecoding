import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import { useBookingDraftStore } from "@/features/booking/bookingDraftStore";
import { calculateBookingTotal, formatMoney } from "@/shared/lib/money";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function BookingConfirmScreen() {
  const draft = useBookingDraftStore();
  const clear = useBookingDraftStore((state) => state.clear);
  const queryClient = useQueryClient();
  const slotQuery = useQuery({ queryKey: queryKeys.slot(draft.slotId ?? ""), queryFn: () => api.getSlot(draft.slotId ?? ""), enabled: Boolean(draft.slotId) });
  const slot = slotQuery.data;
  const total = slot ? calculateBookingTotal(slot, draft.participants) : null;
  const mutation = useMutation({
    mutationFn: () =>
      api.createBooking({
        slotId: draft.slotId ?? "",
        clientName: draft.clientName,
        participants: draft.participants,
        paymentMethod: "offline",
        expectedTotalAmount: total ?? { amount: 0, currency: "RUB" }
      }),
    onSuccess: async (booking) => {
      clear();
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      await queryClient.invalidateQueries({ queryKey: ["slots"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.slot(booking.slot.id) });
      router.replace({ pathname: "/booking/success", params: { bookingId: booking.id } });
    }
  });

  if (!draft.slotId) {
    return (
      <Screen>
        <Notice tone="danger" message="Черновик брони пуст. Вернитесь к расписанию." />
        <Button title="К расписанию" onPress={() => router.replace("/schedule")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Подтверждение</Text>
        {slot ? (
          <>
            <Text style={styles.text}>{slot.program.title}</Text>
            <Text style={styles.text}>Участников: {draft.participants.length}</Text>
            <Text style={styles.text}>Прокатных наборов: {draft.participants.filter((participant) => participant.equipmentOption === "rental").length}</Text>
            <Text style={styles.total}>Итого: {formatMoney(total!)}</Text>
            <Notice message="Онлайн-оплата в MVP не реализована. Оплата происходит вне приложения: наличными в студии или переводом по правилам студии." />
            <Button title={mutation.isPending ? "Создаём бронь..." : "Подтвердить оффлайн-оплату"} disabled={mutation.isPending} onPress={() => mutation.mutate()} />
            <Button title="Выбрать онлайн-оплату" variant="secondary" onPress={() => router.push("/booking/online-unavailable")} />
            <Button title="Условия и политика данных" variant="secondary" onPress={() => router.push("/legal")} />
          </>
        ) : (
          <Notice message="Загружаем актуальные данные слота..." />
        )}
        {mutation.error ? <Notice tone="danger" message={getUserErrorMessage(mutation.error)} /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  total: { color: colors.text, fontSize: 20, fontWeight: "800" }
});
