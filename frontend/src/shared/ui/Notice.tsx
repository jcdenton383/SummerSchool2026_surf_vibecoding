import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "./theme";

type Props = { title?: string; message: string; tone?: "info" | "danger" | "warning" };

export function Notice({ title, message, tone = "info" }: Props) {
  return (
    <View style={[styles.root, tone === "danger" && styles.danger, tone === "warning" && styles.warning]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#edf5f1",
    gap: spacing.xs
  },
  danger: {
    backgroundColor: "#faece9",
    borderColor: "#e5b9b2"
  },
  warning: {
    backgroundColor: "#fbf1d8",
    borderColor: "#ead8a5"
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  message: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20
  }
});
