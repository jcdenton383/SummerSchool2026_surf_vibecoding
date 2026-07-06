import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSessionStore } from "@/features/auth/sessionStore";
import { useBookingDraftStore } from "@/features/booking/bookingDraftStore";
import { colors, spacing } from "@/shared/ui/theme";

export function HeaderActions() {
  const token = useSessionStore((state) => state.accessToken);
  const setReturnTo = useSessionStore((state) => state.setReturnTo);
  const clearDraft = useBookingDraftStore((state) => state.clear);

  const openSchedule = () => {
    clearDraft();
    router.push("/schedule");
  };

  const openAccount = () => {
    clearDraft();
    if (!token) {
      setReturnTo("/account");
      router.push("/auth");
      return;
    }
    router.push("/account");
  };

  return (
    <View style={styles.root}>
      <Pressable style={styles.action} onPress={openSchedule}>
        <Text style={styles.actionText}>Расписание</Text>
      </Pressable>
      <Pressable style={[styles.action, styles.accountAction]} onPress={openAccount}>
        <Text style={[styles.actionText, styles.accountText]}>Мои записи</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  action: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  accountAction: {
    borderColor: colors.primary,
    backgroundColor: "#eef7f4"
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  accountText: {
    color: colors.primary
  }
});
