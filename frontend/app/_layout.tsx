import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/features/auth/sessionStore";
import { HeaderActions } from "@/shared/navigation/HeaderActions";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const restore = useSessionStore((state) => state.restore);

  useEffect(() => {
    void restore();
  }, [restore]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerTitleAlign: "center", headerRight: () => <HeaderActions /> }}>
        <Stack.Screen name="index" options={{ title: "Шеф-стол" }} />
        <Stack.Screen name="auth/index" options={{ title: "Вход" }} />
        <Stack.Screen name="auth/code" options={{ title: "Код" }} />
        <Stack.Screen name="schedule/index" options={{ title: "Расписание" }} />
        <Stack.Screen name="schedule/[slotId]" options={{ title: "Класс" }} />
        <Stack.Screen name="booking/[slotId]" options={{ title: "Участники" }} />
        <Stack.Screen name="booking/confirm" options={{ title: "Подтверждение" }} />
        <Stack.Screen name="booking/online-unavailable" options={{ title: "Онлайн-оплата" }} />
        <Stack.Screen name="booking/success" options={{ title: "Готово" }} />
        <Stack.Screen name="account/index" options={{ title: "Мои записи" }} />
        <Stack.Screen name="account/[bookingId]" options={{ title: "Детали записи" }} />
        <Stack.Screen name="account/add-participants" options={{ title: "Добавить участников" }} />
        <Stack.Screen name="account/cancel" options={{ title: "Отмена" }} />
        <Stack.Screen name="account/notifications" options={{ title: "Уведомления" }} />
        <Stack.Screen name="legal/index" options={{ title: "Условия" }} />
      </Stack>
    </QueryClientProvider>
  );
}
