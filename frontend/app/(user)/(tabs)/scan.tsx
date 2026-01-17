import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../src/utils/theme';

export default function Scan() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(user)/scan-borrow')}
      >
        <Text style={styles.buttonText}>Borrow Book</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => router.push('/(user)/scan-return')}
      >
        <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
          Return Book
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Add this StyleSheet to fix the errors
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    width: '80%',
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
