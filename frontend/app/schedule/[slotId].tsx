import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { queryKeys } from "@/api/queryKeys";
import { getUserErrorMessage } from "@/api/errors";
import { requireAuth, useSessionStore } from "@/features/auth/sessionStore";
import { formatDateTime } from "@/shared/lib/date";
import { formatMoney } from "@/shared/lib/money";
import { canBookSlot, slotStatusLabels } from "@/shared/lib/status";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function SlotDetailsScreen() {
  const { slotId } = useLocalSearchParams<{ slotId: string }>();
  const token = useSessionStore((state) => state.accessToken);
  const query = useQuery({ queryKey: queryKeys.slot(slotId), queryFn: () => api.getSlot(slotId) });
  const bookingsQuery = useQuery({ queryKey: queryKeys.bookings(), queryFn: () => api.listMyBookings(), enabled: Boolean(token) });
  const slot = query.data;
  const existingBooking = bookingsQuery.data?.items.find((booking) => booking.slot.id === slotId && ["confirmed", "offline_payment_pending"].includes(booking.status));

  const startBooking = () => {
    const target = `/booking/${slotId}`;
    if (!requireAuth(target)) {
      router.push("/auth");
      return;
    }
    router.push(target);
  };

  const addParticipants = () => {
    if (!existingBooking) return;
    router.push({ pathname: "/account/add-participants", params: { bookingId: existingBooking.id } });
  };

  return (
    <Screen>
      {query.isLoading ? <Notice message="Загружаем карточку класса..." /> : null}
      {query.error ? <Notice tone="danger" message={getUserErrorMessage(query.error)} /> : null}
      {slot ? (
        <Card>
          {slot.program.dishImageUrl ? <Image source={{ uri: slot.program.dishImageUrl }} style={styles.dishImage} /> : null}
          <Text style={styles.title}>{slot.program.title}</Text>
          <Text style={styles.text}>{formatDateTime(slot.startsAt)} · {slot.durationMinutes} мин</Text>
          <Text style={styles.text}>Меню: {slot.program.menu}</Text>
          <Text style={styles.text}>Направление: {slot.program.direction}; сложность: {slot.program.difficulty}</Text>
          <Text style={styles.text}>Шеф: {slot.chef.name}, рейтинг {slot.chef.rating} ({slot.chef.ratingCount})</Text>
          <Text style={styles.text}>Места: {slot.availableSeats}/{slot.capacity}</Text>
          <Text style={styles.text}>Цена места: {formatMoney(slot.seatPrice)}</Text>
          <Text style={styles.text}>Прокат: {formatMoney(slot.rentalPricePerParticipant)} за участника</Text>
          <Text style={styles.text}>Инвентарь: {slot.requiredEquipmentInfo ?? slot.program.requiredEquipment ?? "Информация не указана"}</Text>
          <Text style={styles.text}>Прокат: {slot.rentalEquipmentInfo ?? "Описание проката не указано"}</Text>
          <Notice message="Отмена клиентом доступна не позднее чем за 24 часа до начала класса." />
          {slot.status === "cancelled_by_studio" ? (
            <Notice tone="danger" message={slot.cancellationReason || "Класс отменён студией. Причина не указана."} />
          ) : null}
          {existingBooking ? (
            <>
              <Notice message="Вы уже записаны на этот класс. Новую отдельную бронь создавать нельзя, можно добавить людей в вашу группу." />
              <Button title="Добавить участников в мою запись" disabled={!canBookSlot(slot.status)} onPress={addParticipants} />
            </>
          ) : (
            <Button title="Перейти к записи" disabled={!canBookSlot(slot.status)} onPress={startBooking} />
          )}
          {!canBookSlot(slot.status) ? <Text style={styles.text}>Запись недоступна: {slotStatusLabels[slot.status]}.</Text> : null}
          <Button title="Условия и политика данных" variant="secondary" onPress={() => router.push("/legal")} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  dishImage: { width: "100%", height: 180, borderRadius: 8, backgroundColor: colors.border },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 }
});
