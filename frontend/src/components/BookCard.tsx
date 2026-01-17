import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function BookCard({ book }: { book: any }) {
  const available = book.quantity_available > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>

      <View style={styles.row}>
        <Text
          style={[
            styles.status,
            { color: available ? '#16A34A' : theme.colors.error },
          ]}
        >
          {available ? 'Available' : 'Unavailable'}
        </Text>

        <Text style={styles.qty}>
          {book.quantity_available}/{book.quantity_total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },

  author: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginVertical: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },

  status: {
    fontWeight: '500',
  },

  qty: {
    color: theme.colors.textSecondary,
  },
});
