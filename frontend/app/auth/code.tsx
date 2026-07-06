import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { api } from "@/api/client";
import { getUserErrorMessage } from "@/api/errors";
import { useSessionStore } from "@/features/auth/sessionStore";
import { env } from "@/shared/config/env";
import { codeSchema } from "@/shared/validation/booking";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Notice } from "@/shared/ui/Notice";
import { Screen } from "@/shared/ui/Screen";
import { TextField } from "@/shared/ui/TextField";
import { colors } from "@/shared/ui/theme";

export default function CodeScreen() {
  const params = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState(env.demoCode);
  const [error, setError] = useState<string | null>(null);
  const setSession = useSessionStore((state) => state.setSession);
  const returnTo = useSessionStore((state) => state.returnTo);
  const setReturnTo = useSessionStore((state) => state.setReturnTo);
  const mutation = useMutation({
    mutationFn: () => api.verifyPhoneCode(params.phone, code),
    onSuccess: async (session) => {
      await setSession(session.accessToken, session.client);
      const target = returnTo ?? "/schedule";
      setReturnTo(null);
      router.replace(target);
    },
    onError: (err) => setError(getUserErrorMessage(err))
  });

  const submit = () => {
    const parsed = codeSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Неверный код");
      return;
    }
    setError(null);
    mutation.mutate();
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Введите код</Text>
        <Text style={styles.text}>Телефон: {params.phone}</Text>
        <TextField label="Код" value={code} onChangeText={setCode} keyboardType="number-pad" error={error ?? undefined} />
        {error ? <Notice tone="danger" message={error} /> : null}
        <Button title={mutation.isPending ? "Проверяем..." : "Войти"} disabled={mutation.isPending} onPress={submit} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  text: { color: colors.muted }
});
