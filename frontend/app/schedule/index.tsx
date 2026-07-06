import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "@/api/client";
import { queryKeys } from "@/api/queryKeys";
import { Booking, ScheduleSlot } from "@/api/types";
import { getUserErrorMessage } from "@/api/errors";
import { formatDateTime, toDateInputValue } from "@/shared/lib/date";
import { formatMoney } from "@/shared/lib/money";
import { slotStatusLabels } from "@/shared/lib/status";
import { useSessionStore } from "@/features/auth/sessionStore";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors, spacing } from "@/shared/ui/theme";

export default function ScheduleScreen() {
  const token = useSessionStore((state) => state.accessToken);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const query = useQuery({
    queryKey: queryKeys.slots(from || undefined, to || undefined),
    queryFn: () => api.listSlots(from || undefined, to || undefined)
  });
  const bookingsQuery = useQuery({
    queryKey: queryKeys.bookings(),
    queryFn: () => api.listMyBookings(),
    enabled: Boolean(token)
  });
  const activeBookingsBySlot = useMemo(() => {
    const map = new Map<string, Booking>();
    if (!token) return map;
    for (const booking of bookingsQuery.data?.items ?? []) {
      if (["confirmed", "offline_payment_pending"].includes(booking.status)) {
        map.set(booking.slot.id, booking);
      }
    }
    return map;
  }, [bookingsQuery.data?.items, token]);
  const slots = query.data?.items ?? [];

  const reset = () => {
    setFrom("");
    setTo("");
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Расписание</Text>
        <DatePicker label="С" value={from} onChange={setFrom} />
        <DatePicker label="По" value={to} onChange={setTo} />
        {from && to && to < from ? <Notice tone="danger" message="Дата окончания не может быть раньше даты начала." /> : null}
        <Button title="Сбросить фильтр" variant="secondary" onPress={reset} />
      </Card>
      {query.isLoading ? <Notice message="Загружаем расписание..." /> : null}
      {query.error ? (
        <Card>
          <Notice tone="danger" message={getUserErrorMessage(query.error)} />
          <Button title="Повторить" onPress={() => query.refetch()} />
        </Card>
      ) : null}
      {!query.isLoading && !query.error && slots.length === 0 ? <Notice message="На выбранные даты доступных классов нет." /> : null}
      {slots.map((slot) => <SlotCard key={slot.id} slot={slot} booking={activeBookingsBySlot.get(slot.id)} />)}
      <Button title="Мои записи" variant="secondary" onPress={() => router.push("/account")} />
    </Screen>
  );
}

function SlotCard({ slot, booking }: { slot: ScheduleSlot; booking?: Booking }) {
  const statusTone = slot.status === "available" ? styles.available : slot.status === "cancelled_by_studio" ? styles.cancelled : styles.locked;
  const open = () => {
    if (booking) {
      router.push(`/account/${booking.id}`);
      return;
    }
    router.push(`/schedule/${slot.id}`);
  };
  return (
    <Pressable onPress={open}>
      <Card style={booking ? styles.bookedCard : undefined}>
        {slot.program.dishImageUrl ? <Image source={{ uri: slot.program.dishImageUrl }} style={styles.dishImage} /> : null}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{slot.program.title}</Text>
          <Text style={[styles.badge, statusTone]}>{slotStatusLabels[slot.status]}</Text>
        </View>
        {booking ? <Text style={styles.bookedText}>Вы записаны на этот класс</Text> : null}
        <Text style={styles.text}>{formatDateTime(slot.startsAt)} · {slot.durationMinutes} мин</Text>
        <Text style={styles.text}>{slot.program.direction} · сложность: {slot.program.difficulty}</Text>
        <Text style={styles.text}>Шеф {slot.chef.name}, рейтинг {slot.chef.rating}</Text>
        <Text style={styles.text}>Места: {slot.availableSeats}/{slot.capacity} · {formatMoney(slot.seatPrice)}</Text>
      </Card>
    </Pressable>
  );
}

function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return toDateInputValue(date);
    });
  }, []);

  return (
    <View style={styles.pickerRoot}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <Pressable style={styles.pickerButton} onPress={() => setOpen((current) => !current)}>
        <Text style={styles.pickerButtonText}>{value || "Выбрать дату"}</Text>
      </Pressable>
      {open ? (
        <View style={styles.calendar}>
          {days.map((day) => (
            <Pressable
              key={day}
              style={[styles.calendarDay, value === day && styles.calendarDayActive]}
              onPress={() => {
                onChange(day);
                setOpen(false);
              }}
            >
              <Text style={[styles.calendarDayText, value === day && styles.calendarDayTextActive]}>{day.slice(5)}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  cardHeader: { flexDirection: "row", gap: spacing.sm, justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { flex: 1, color: colors.text, fontSize: 18, fontWeight: "800" },
  dishImage: { width: "100%", height: 132, borderRadius: 8, backgroundColor: colors.border },
  bookedCard: { backgroundColor: "#eef7f4", borderColor: colors.primary },
  bookedText: { color: colors.primary, fontSize: 14, fontWeight: "800" },
  badge: { overflow: "hidden", borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, fontSize: 12, fontWeight: "800" },
  available: { color: colors.success, backgroundColor: "#edf5f1" },
  locked: { color: colors.warning, backgroundColor: "#fbf1d8" },
  cancelled: { color: colors.danger, backgroundColor: "#faece9" },
  pickerRoot: { gap: spacing.xs },
  pickerLabel: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  pickerButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md, borderWidth: 1, borderRadius: 8, borderColor: colors.border, backgroundColor: colors.surface },
  pickerButtonText: { color: colors.text, fontSize: 16 },
  calendar: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  calendarDay: { width: "22%", minHeight: 40, justifyContent: "center", alignItems: "center", borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  calendarDayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  calendarDayText: { color: colors.text, fontWeight: "700" },
  calendarDayTextActive: { color: colors.primaryText }
});
