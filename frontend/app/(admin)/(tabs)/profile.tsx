import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../src/utils/theme';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../src/context/AuthContext';
import api from '../../../src/api/axios';

export default function AdminProfile() {
  const { logout, setUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch profile data from /users/me
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me');
      const userData = res.data;
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
      // update context in case you want it globally updated
      setUser(prev => prev ? { ...prev, ...userData } : userData);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email cannot be empty.');
      return;
    }

    try {
      const res = await api.put('/users/update-profile', { name, email });
      Alert.alert('Success', 'Profile updated successfully!');
      setUser(prev => prev ? { ...prev, name: res.data.name, email: res.data.email } : null);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await api.put('/users/change-password', {
        oldPassword: currentPassword,
        newPassword,
      });
      Alert.alert('Success', 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Admin Profile</Text>

        {/* Profile Info */}
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Role</Text>
          <Text style={[styles.input, { color: theme.colors.textSecondary }]}>{role}</Text>

          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.lg },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  label: { color: theme.colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: theme.colors.background, borderRadius: theme.radius.md, padding: theme.spacing.sm, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.md },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, paddingVertical: theme.spacing.sm, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  logoutButton: { backgroundColor: '#C62828', marginTop: theme.spacing.lg },
});
