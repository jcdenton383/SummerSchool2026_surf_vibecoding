import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "@/api/client";
import { queryKeys } from "@/api/queryKeys";
import type { AllergyStatus, EquipmentOption, ParticipantInput } from "@/api/types";
import { useBookingDraftStore } from "@/features/booking/bookingDraftStore";
import { useSessionStore } from "@/features/auth/sessionStore";
import { calculateBookingTotal, formatMoney } from "@/shared/lib/money";
import { validateParticipantsForSlot } from "@/shared/validation/booking";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { TextField } from "@/shared/ui/TextField";
import { colors, spacing } from "@/shared/ui/theme";

export default function BookingParticipantsScreen() {
  const { slotId } = useLocalSearchParams<{ slotId: string }>();
  const client = useSessionStore((state) => state.client);
  const setDraft = useBookingDraftStore((state) => state.setDraft);
  const query = useQuery({ queryKey: queryKeys.slot(slotId), queryFn: () => api.getSlot(slotId) });
  const [clientName, setClientName] = useState(client?.name ?? "");
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { name: client?.name ?? "", allergyStatus: "none", allergyComment: "", equipmentOption: "own" }
  ]);
  const [error, setError] = useState<string | null>(null);
  const slot = query.data;

  const update = (index: number, patch: Partial<ParticipantInput>) => {
    setParticipants((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const add = () => {
    if (slot && participants.length >= slot.availableSeats) {
      setError("Нельзя добавить участников больше свободных мест.");
      return;
    }
    setParticipants((current) => [...current, { name: "", allergyStatus: "none", allergyComment: "", equipmentOption: "own" }]);
  };

  const submit = () => {
    if (!slot) return;
    if (!clientName.trim()) {
      setError("Укажите имя основного клиента.");
      return;
    }
    const participantError = validateParticipantsForSlot(slot, participants);
    if (participantError) {
      setError(participantError);
      return;
    }
    setDraft(slotId, clientName, participants);
    router.push("/booking/confirm");
  };

  return (
    <Screen>
      {slot ? (
        <>
          <Card>
            <Text style={styles.title}>Участники</Text>
            <Text style={styles.text}>{slot.program.title}</Text>
            <Text style={styles.text}>Свободно мест: {slot.availableSeats}</Text>
            <TextField label="Имя основного клиента" value={clientName} onChangeText={setClientName} />
          </Card>
          {participants.map((participant, index) => (
            <Card key={index}>
              <Text style={styles.subtitle}>Участник {index + 1}</Text>
              <TextField label="Имя" value={participant.name} onChangeText={(value) => update(index, { name: value })} />
              <Segment
                label="Аллергии"
                value={participant.allergyStatus}
                options={[
                  ["none", "Нет"],
                  ["has_allergy", "Есть"]
                ]}
                onChange={(value) => update(index, { allergyStatus: value as AllergyStatus })}
              />
              {participant.allergyStatus === "has_allergy" ? (
                <TextField
                  label="Комментарий по аллергии"
                  value={participant.allergyComment ?? ""}
                  onChangeText={(value) => update(index, { allergyComment: value })}
                  multiline
                />
              ) : null}
              <Segment
                label="Инвентарь"
                value={participant.equipmentOption}
                options={[
                  ["own", "Свой"],
                  ["rental", "Прокат"]
                ]}
                onChange={(value) => update(index, { equipmentOption: value as EquipmentOption })}
              />
            </Card>
          ))}
          {error ? <Notice tone="danger" message={error} /> : null}
          <Card>
            <Text style={styles.text}>Предварительный итог: {formatMoney(calculateBookingTotal(slot, participants))}</Text>
            <Button title="Добавить участника" variant="secondary" onPress={add} />
            <Button title="Продолжить" onPress={submit} />
          </Card>
        </>
      ) : (
        <Notice message="Загружаем слот..." />
      )}
    </Screen>
  );
}

function Segment({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return (
    <View style={styles.segmentRoot}>
      <Text style={styles.segmentLabel}>{label}</Text>
      <View style={styles.segment}>
        {options.map(([optionValue, optionLabel]) => (
          <Pressable key={optionValue} onPress={() => onChange(optionValue)} style={[styles.segmentItem, value === optionValue && styles.segmentActive]}>
            <Text style={[styles.segmentText, value === optionValue && styles.segmentTextActive]}>{optionLabel}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  segmentRoot: { gap: spacing.xs },
  segmentLabel: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  segment: { flexDirection: "row", gap: spacing.sm },
  segmentItem: { flex: 1, padding: spacing.md, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.text, fontWeight: "700" },
  segmentTextActive: { color: colors.primaryText }
});
