import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { useSessionStore } from "@/features/auth/sessionStore";
import { env } from "@/shared/config/env";
import { phoneSchema } from "@/shared/validation/booking";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { TextField } from "@/shared/ui/TextField";
import { colors } from "@/shared/ui/theme";

export default function PhoneScreen() {
  const [phone, setPhone] = useState(env.demoPhone);
  const [error, setError] = useState<string | null>(null);
  const setReturnTo = useSessionStore((state) => state.setReturnTo);
  const mutation = useMutation({
    mutationFn: () => api.requestPhoneCode(phone),
    onSuccess: () => router.push({ pathname: "/auth/code", params: { phone } }),
    onError: (err) => setError(getUserErrorMessage(err))
  });

  const submit = () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Неверный телефон");
      return;
    }
    setError(null);
    mutation.mutate();
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Вход по телефону</Text>
        <Text style={styles.text}>Код используется только для учебного demo-auth.</Text>
        <TextField label="Телефон" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={error ?? undefined} />
        {error ? <Notice tone="danger" message={error} /> : null}
        <Button title={mutation.isPending ? "Отправляем..." : "Получить код"} disabled={mutation.isPending} onPress={submit} />
        <Button title="Условия и политика данных" variant="secondary" onPress={() => router.push("/legal")} />
        <Button title="Сбросить возврат после входа" variant="secondary" onPress={() => setReturnTo(null)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  text: { color: colors.muted, lineHeight: 20 }
});
