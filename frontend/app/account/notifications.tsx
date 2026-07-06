import { useQuery } from "@tanstack/react-query";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import { formatDateTime } from "@/shared/lib/date";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function NotificationsScreen() {
  const query = useQuery({ queryKey: queryKeys.notifications, queryFn: () => api.listMyNotifications() });
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Уведомления</Text>
        <Text style={styles.text}>Это in-app simulator SMS/push для MVP.</Text>
      </Card>
      {query.error ? <Notice tone="danger" message={getUserErrorMessage(query.error)} /> : null}
      {query.data?.items.map((item) => (
        <Card key={item.id}>
          <Text style={styles.subtitle}>{item.type === "class_reminder" ? "Напоминание о классе" : "Отмена студией"}</Text>
          <Text style={styles.text}>{item.channel.toUpperCase()} · {item.status} · {formatDateTime(item.plannedAt)}</Text>
          <Text style={styles.text}>{item.message ?? "Текст уведомления не указан."}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 21 }
});
