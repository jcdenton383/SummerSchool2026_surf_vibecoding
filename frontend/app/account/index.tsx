import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import type { Booking } from "@/api/types";
import { requireAuth, useSessionStore } from "@/features/auth/sessionStore";
import { formatDateTime } from "@/shared/lib/date";
import { formatMoney } from "@/shared/lib/money";
import { bookingStatusLabels } from "@/shared/lib/status";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function AccountScreen() {
  const token = useSessionStore((state) => state.accessToken);
  const client = useSessionStore((state) => state.client);
  const clear = useSessionStore((state) => state.clear);
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.bookings(), queryFn: () => api.listMyBookings(), enabled: Boolean(token) });

  const logout = async () => {
    await clear();
    queryClient.removeQueries({ queryKey: queryKeys.bookings() });
    queryClient.removeQueries({ queryKey: queryKeys.notifications });
    queryClient.removeQueries({ queryKey: ["booking"] });
    router.replace("/schedule");
  };

  if (!token) {
    return (
      <Screen>
        <Notice message="Для просмотра своих записей нужно войти." />
        <Button title="Войти" onPress={() => {
          requireAuth("/account");
          router.push("/auth");
        }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Мои записи</Text>
        <Text style={styles.text}>Клиент: {client?.phone ?? "demo-session"}</Text>
        <Button title="Уведомления" variant="secondary" onPress={() => router.push("/account/notifications")} />
        <Button title="Выйти" variant="secondary" onPress={() => void logout()} />
      </Card>
      {query.isLoading ? <Notice message="Загружаем записи..." /> : null}
      {query.error ? <Notice tone="danger" message={getUserErrorMessage(query.error)} /> : null}
      {query.data?.items.length === 0 ? <Notice message="Записей пока нет." /> : null}
      {query.data?.items.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
    </Screen>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const isClientCancelled = booking.status === "cancelled_by_client";
  return (
    <Pressable onPress={() => router.push(`/account/${booking.id}`)}>
      <Card style={isClientCancelled ? styles.clientCancelledCard : undefined}>
        <Text style={styles.cardTitle}>{booking.slot.program.title}</Text>
        <Text style={styles.text}>{formatDateTime(booking.slot.startsAt)}</Text>
        <Text style={styles.text}>{bookingStatusLabels[booking.status]} · участников: {booking.participantCount}</Text>
        <Text style={styles.text}>Сумма: {formatMoney(booking.totalAmount)}</Text>
        {booking.status === "cancelled_by_studio" ? (
          <Notice tone="danger" message={booking.cancellationReason || booking.slot.cancellationReason || "Класс отменён студией. Причина не указана."} />
        ) : null}
        {isClientCancelled ? <Notice message="Эта запись отменена вами и оставлена в истории." /> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  clientCancelledCard: { backgroundColor: "#f2eeea", borderColor: colors.disabled }
});
