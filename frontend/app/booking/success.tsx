import { router, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function BookingSuccessScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Бронь создана</Text>
        <Text style={styles.text}>Подтверждённое состояние появилось только после успешного ответа API/mock API.</Text>
        <Button title="Открыть детали" onPress={() => router.replace(`/account/${bookingId}`)} />
        <Button title="К расписанию" variant="secondary" onPress={() => router.replace("/schedule")} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  text: { color: colors.muted, lineHeight: 20 }
});
