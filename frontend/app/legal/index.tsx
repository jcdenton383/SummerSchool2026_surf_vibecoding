import { useQuery } from "@tanstack/react-query";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { queryKeys } from "@/api/queryKeys";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { colors } from "@/shared/ui/theme";

export default function LegalScreen() {
  const query = useQuery({ queryKey: queryKeys.terms, queryFn: () => api.getTerms() });
  return (
    <Screen>
      {query.isLoading ? <Notice message="Загружаем условия..." /> : null}
      {query.error ? <Notice tone="danger" message={getUserErrorMessage(query.error)} /> : null}
      {query.data ? (
        <Card>
          <Text style={styles.title}>Условия и данные</Text>
          <Text style={styles.subtitle}>Отмена</Text>
          <Text style={styles.text}>{query.data.cancellationPolicy}</Text>
          <Text style={styles.subtitle}>Персональные данные</Text>
          <Text style={styles.text}>{query.data.personalDataPolicy}</Text>
          <Text style={styles.subtitle}>Оплата</Text>
          <Text style={styles.text}>{query.data.terms}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  text: { color: colors.muted, fontSize: 15, lineHeight: 22 }
});
