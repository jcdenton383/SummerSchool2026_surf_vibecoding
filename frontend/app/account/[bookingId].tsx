import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import { formatDateTime, formatDate } from "@/shared/lib/date";
import { formatMoney } from "@/shared/lib/money";
import { bookingStatusLabels, canCancelBooking, canEditBooking, canReviewBooking } from "@/shared/lib/status";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { TextField } from "@/shared/ui/TextField";
import { colors, spacing } from "@/shared/ui/theme";

export default function BookingDetailsScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.booking(bookingId), queryFn: () => api.getBooking(bookingId) });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const reviewMutation = useMutation({
    mutationFn: () => api.createChefReview({ bookingId, rating, comment }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
    }
  });
  const booking = query.data;

  return (
    <Screen>
      {query.isLoading ? <Notice message="Загружаем детали..." /> : null}
      {query.error ? <Notice tone="danger" message={getUserErrorMessage(query.error)} /> : null}
      {booking ? (
        <>
          <Card>
            <Text style={styles.title}>{booking.slot.program.title}</Text>
            <Text style={styles.text}>{formatDateTime(booking.slot.startsAt)}</Text>
            <Text style={styles.text}>Статус: {bookingStatusLabels[booking.status]}</Text>
            <Text style={styles.text}>Итого: {formatMoney(booking.totalAmount)}</Text>
            <Text style={styles.text}>Оплата: вне приложения, статус {booking.paymentStatus}</Text>
            <Text style={styles.text}>Отмена доступна до {formatDate(booking.cancellableUntil)}</Text>
            {booking.status.includes("cancelled") ? <Notice message="Возврат денег обрабатывается вне приложения по правилам студии." /> : null}
            {booking.status === "cancelled_by_studio" ? (
              <Notice tone="danger" message={booking.cancellationReason || booking.slot.cancellationReason || "Класс отменён студией. Причина не указана."} />
            ) : null}
          </Card>
          <Card>
            <Text style={styles.subtitle}>Участники</Text>
            {booking.participants.map((participant) => (
              <Text key={participant.id} style={styles.text}>
                {participant.name}: {participant.status}, инвентарь {participant.equipmentOption === "rental" ? "прокат" : "свой"}, аллергии{" "}
                {participant.allergyStatus === "has_allergy" ? participant.allergyComment : "нет"}
              </Text>
            ))}
          </Card>
          <Card>
            <Button title="Добавить участников" disabled={!canEditBooking(booking)} onPress={() => router.push({ pathname: "/account/add-participants", params: { bookingId } })} />
            <Button title="Отменить бронь или участника" variant="danger" disabled={!canCancelBooking(booking)} onPress={() => router.push({ pathname: "/account/cancel", params: { bookingId } })} />
            {!canEditBooking(booking) ? <Text style={styles.text}>Действия заблокированы для завершённых, отменённых или недоступных записей.</Text> : null}
          </Card>
          <Card>
            <Text style={styles.subtitle}>Оценка шефа</Text>
            {booking.review ? <Notice message={`Оценка уже отправлена: ${booking.review.rating}/5`} /> : null}
            {canReviewBooking(booking) ? (
              <>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Pressable key={value} style={[styles.rating, rating === value && styles.ratingActive]} onPress={() => setRating(value)}>
                      <Text style={[styles.ratingText, rating === value && styles.ratingTextActive]}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
                <TextField label="Комментарий" value={comment} onChangeText={setComment} multiline />
                <Button title="Отправить оценку" disabled={rating < 1 || reviewMutation.isPending} onPress={() => reviewMutation.mutate()} />
              </>
            ) : (
              <Text style={styles.text}>Оценка доступна только завершённой записи без отправленного отзыва.</Text>
            )}
            {reviewMutation.error ? <Notice tone="danger" message={getUserErrorMessage(reviewMutation.error)} /> : null}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  ratingRow: { flexDirection: "row", gap: spacing.sm },
  rating: { width: 44, height: 44, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  ratingActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ratingText: { color: colors.text, fontWeight: "800" },
  ratingTextActive: { color: colors.primaryText }
});
