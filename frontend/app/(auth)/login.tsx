import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useContext, useState } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/utils/theme';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async () => {
    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'You have successfully logged in.',
        position: 'top',
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        topOffset: 50,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        //text2: err.message || 'Incorrect email or password',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to access your library</Text>

      {/* Inputs */}
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

      


      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          setError('');
          try {
            await login(email, password);
          } catch (err: any) {
            setError(err.message);
          }
          handleLogin();
        }}
        
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>


      {/* Footer: Sign Up Link */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>Create one</Text>
        </TouchableOpacity>
      </View>


      <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }}>
            ← Back to Homepage
          </Text>
        </TouchableOpacity>
      </View>

      


      <Toast
        config={{
          success: ({ text1, text2, ...rest }) => (
            <View style={{
              height: 60,
              backgroundColor: '#4BB543',
              borderRadius: 12,
              padding: 12,
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{text1}</Text>
              {text2 ? <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text> : null}
            </View>
          ),
          error: ({ text1, text2, ...rest }) => (
            <View style={{
              height: 60,
              backgroundColor: '#FF4D4F',
              borderRadius: 12,
              padding: 12,
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{text1}</Text>
              {text2 ? <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text> : null}
            </View>
          ),
        }}
      />



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.error, // make sure you have theme.colors.error defined, e.g. red
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },

  title: {
    fontSize: 34,
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

  footerSmall: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
    fontSize: 12,
  },
});
