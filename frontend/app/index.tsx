import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/utils/theme';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Hero Image */}
        <Image 
          source={require('../assets/images/books.jpg')} 
          style={styles.image} 
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Smart Library</Text>
          <Text style={styles.tagline}>
            Borrow • Scan • Manage
          </Text>

          <Text style={styles.description}>
            A modern library management system that lets you borrow and return
            books instantly using QR codes.
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <Feature icon="qr-code-outline" text="Scan QR to borrow books" />
            <Feature icon="time-outline" text="Track your borrow history" />
            <Feature icon="library-outline" text="Fast & paperless library" />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Ionicons
        name={icon}
        size={20}
        color={theme.colors.primary}
      />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    flex: 1,
  },

  image: {
    height: '40%',
    width: '100%',
  },

  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },

  tagline: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },

  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },

  features: {
    gap: 14,
    marginBottom: theme.spacing.xl,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  featureText: {
    fontSize: 15,
    color: theme.colors.text,
  },

  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
