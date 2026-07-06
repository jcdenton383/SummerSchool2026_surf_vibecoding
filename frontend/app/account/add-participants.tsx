import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import type { ParticipantInput } from "@/api/types";
import { calculateBookingTotal, formatMoney } from "@/shared/lib/money";
import { validateParticipantsForSlot } from "@/shared/validation/booking";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { TextField } from "@/shared/ui/TextField";
import { colors } from "@/shared/ui/theme";

export default function AddParticipantsScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.booking(bookingId), queryFn: () => api.getBooking(bookingId) });
  const [participant, setParticipant] = useState<ParticipantInput>({ name: "", allergyStatus: "none", allergyComment: "", equipmentOption: "own" });
  const [error, setError] = useState<string | null>(null);
  const booking = query.data;
  const activeParticipants = booking?.participants.filter((item) => item.status === "active") ?? [];
  const nextTotal = booking ? calculateBookingTotal(booking.slot, [...activeParticipants.map((item) => ({ name: item.name, allergyStatus: item.allergyStatus, allergyComment: item.allergyComment, equipmentOption: item.equipmentOption })), participant]) : null;
  const additionalAmount = nextTotal ? nextTotal.amount - (booking?.totalAmount.amount ?? 0) : null;
  const mutation = useMutation({
    mutationFn: () => {
      if (!booking) throw new Error("Booking is not loaded");
      const active = booking.participants
        .filter((item) => item.status === "active")
        .map((item) => ({ name: item.name, allergyStatus: item.allergyStatus, allergyComment: item.allergyComment, equipmentOption: item.equipmentOption }));
      return api.addBookingParticipants(bookingId, {
        participants: [participant],
        expectedTotalAmount: calculateBookingTotal(booking.slot, [...active, participant])
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      await queryClient.invalidateQueries({ queryKey: ["slots"] });
      if (booking) await queryClient.invalidateQueries({ queryKey: queryKeys.slot(booking.slot.id) });
      router.back();
    },
    onError: (err) => setError(getUserErrorMessage(err))
  });

  const submit = () => {
    if (!booking) return;
    const validation = validateParticipantsForSlot(booking.slot, [participant]);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    mutation.mutate();
  };

  return (
    <Screen>
      {booking ? (
        <Card>
          <Text style={styles.title}>Добавить участника</Text>
          <Text style={styles.text}>Текущий состав: {booking.participantCount}. Свободные места: {booking.slot.availableSeats}</Text>
          <Notice message="Клиент уже записан. Здесь считается доплата только за новых участников и выбранный для них прокат." />
          <TextField label="Имя" value={participant.name} onChangeText={(name) => setParticipant({ ...participant, name })} />
          <Button title="Аллергия: нет" variant={participant.allergyStatus === "none" ? "primary" : "secondary"} onPress={() => setParticipant({ ...participant, allergyStatus: "none", allergyComment: "" })} />
          <Button title="Аллергия: есть" variant={participant.allergyStatus === "has_allergy" ? "primary" : "secondary"} onPress={() => setParticipant({ ...participant, allergyStatus: "has_allergy" })} />
          {participant.allergyStatus === "has_allergy" ? (
            <TextField label="Комментарий" value={participant.allergyComment ?? ""} onChangeText={(allergyComment) => setParticipant({ ...participant, allergyComment })} />
          ) : null}
          <Button title="Инвентарь: свой" variant={participant.equipmentOption === "own" ? "primary" : "secondary"} onPress={() => setParticipant({ ...participant, equipmentOption: "own" })} />
          <Button title="Инвентарь: прокат" variant={participant.equipmentOption === "rental" ? "primary" : "secondary"} onPress={() => setParticipant({ ...participant, equipmentOption: "rental" })} />
          {additionalAmount !== null ? <Text style={styles.total}>Доплата: {formatMoney({ amount: additionalAmount, currency: "RUB" })}</Text> : null}
          {error ? <Notice tone="danger" message={error} /> : null}
          <Button title={mutation.isPending ? "Сохраняем..." : "Добавить после ответа API"} disabled={mutation.isPending} onPress={submit} />
        </Card>
      ) : (
        <Notice message="Загружаем бронь..." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  total: { color: colors.text, fontSize: 18, fontWeight: "800" }
});
