import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import { canCancelBooking } from "@/shared/lib/status";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function CancelScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.booking(bookingId), queryFn: () => api.getBooking(bookingId) });
  const booking = query.data;
  const cancelBooking = useMutation({
    mutationFn: () => api.cancelBooking(bookingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      await queryClient.invalidateQueries({ queryKey: ["slots"] });
      if (booking) await queryClient.invalidateQueries({ queryKey: queryKeys.slot(booking.slot.id) });
      router.back();
    }
  });
  const cancelParticipant = useMutation({
    mutationFn: (participantId: string) => api.cancelBookingParticipant(bookingId, participantId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      await queryClient.invalidateQueries({ queryKey: ["slots"] });
      if (booking) await queryClient.invalidateQueries({ queryKey: queryKeys.slot(booking.slot.id) });
      router.back();
    }
  });

  return (
    <Screen>
      {booking ? (
        <Card>
          <Text style={styles.title}>Отмена записи</Text>
          <Notice message="Перед отправкой подтвердите состав отмены. Статусы меняются только после успешного ответа API." />
          {!canCancelBooking(booking) ? <Notice tone="danger" message="Окно отмены закрыто или бронь не редактируется." /> : null}
          <Button title="Отменить всю бронь" variant="danger" disabled={!canCancelBooking(booking) || cancelBooking.isPending} onPress={() => cancelBooking.mutate()} />
          {booking.participants
            .filter((participant) => participant.status === "active")
            .map((participant) => (
              <Button
                key={participant.id}
                title={`Отменить участника: ${participant.name}`}
                variant="secondary"
                disabled={!canCancelBooking(booking) || cancelParticipant.isPending}
                onPress={() => cancelParticipant.mutate(participant.id)}
              />
            ))}
          {cancelBooking.error ? <Notice tone="danger" message={getUserErrorMessage(cancelBooking.error)} /> : null}
          {cancelParticipant.error ? <Notice tone="danger" message={getUserErrorMessage(cancelParticipant.error)} /> : null}
        </Card>
      ) : (
        <Notice message="Загружаем бронь..." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" }
});
