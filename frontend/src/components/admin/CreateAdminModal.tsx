import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../../utils/theme';
import api from '../../api/axios';

type CreateAdminModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreateAdminModal({
  visible,
  onClose,
  onSuccess,
}: CreateAdminModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async () => {
    if (!name || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/create-admin', { name, email, password });

      alert('Admin created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error('Failed to create admin', err);
      alert(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { display: visible ? 'flex' : 'none' } ]}>
      <View style={styles.modal}>
        <Text style={styles.title}>Create New Admin</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#C62828' }]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#8E24AA' }]}
            onPress={handleCreateAdmin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
