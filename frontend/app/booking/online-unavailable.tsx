import { router } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function OnlineUnavailableScreen() {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Онлайн-оплата недоступна</Text>
        <Notice tone="warning" message="В MVP нет платёжной формы, эквайринга, статусов онлайн-платежей и автоматических возвратов." />
        <Button title="Вернуться к оффлайн-оплате" onPress={() => router.back()} />
        <Button title="Не создавать бронь" variant="secondary" onPress={() => router.replace("/schedule")} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" }
});
