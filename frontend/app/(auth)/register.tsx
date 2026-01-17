import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/utils/theme';
import { useRouter } from 'expo-router';


export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeAnim = useState(new Animated.Value(0))[0];


  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
        setError('Please fill out all fields.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    try {
        await register({ name, email, password });

        // show animated success
        setSuccess(true);

        // auto navigate after animation
        setTimeout(() => {
        setSuccess(false);
        router.replace('/(auth)/login');
        }, 2000);
    } catch (err: any) {
        setError(err.message || 'Registration failed');
    }
  };


  if (success) {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
    }



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start using the library</Text>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="John Doe"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          onChangeText={setName}
          value={name}
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="user@email.com"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}


      {/* Create Account Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Link to Login */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

    {success && (
    <Animated.View
        style={[
        styles.successAlert,
        {
            opacity: fadeAnim,
            transform: [
            {
                translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
                }),
            },
            ],
        },
        ]}
    >
        <Text style={styles.successTitle}>Account Created</Text>
        <Text style={styles.successText}>
        You can now sign in with your credentials
        </Text>
    </Animated.View>
    )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },

  errorText: {
    color: '#E53935',
    fontSize: 14,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    },


  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: theme.spacing.md,
  },

  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
    color: theme.colors.text,
  },

  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },

  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  footerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  successAlert: {
  position: 'absolute',
  bottom: 40,
  left: 20,
  right: 20,
  backgroundColor: '#2E7D32',
  borderRadius: theme.radius.lg,
  padding: theme.spacing.md,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 6,
  elevation: 5,
},

successTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',
},

successText: {
  color: '#E8F5E9',
  fontSize: 14,
  marginTop: 4,
  textAlign: 'center',
},

});
