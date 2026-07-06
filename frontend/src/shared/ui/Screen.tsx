import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "./theme";

type Props = PropsWithChildren<{ scroll?: boolean }>;

export function Screen({ children, scroll = true }: Props) {
  if (!scroll) return <View style={styles.root}>{children}</View>;
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.root}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md
  }
});
