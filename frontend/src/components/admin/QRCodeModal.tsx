import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

//import * as FileSystem from 'expo-file-system';
const FileSystem = require('expo-file-system');

import * as MediaLibrary from 'expo-media-library';

import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';

import { exportQRToPDF } from '../../utils/qr/exportQRToPDF';

type Props = {
  visible: boolean;
  value: string;
  title?: string;
  onClose: () => void;
};

export default function QRCodeModal({ visible, value, title, onClose }: Props) {
  const qrRef = useRef<any>(null);


  

const exportAsPDF = () => {
  if (!qrRef.current) return;

  qrRef.current.toDataURL(async (data: string) => {
    await exportQRToPDF({
      base64QR: data,
      title: title || 'Book QR Code',
    });
  });
};


  const downloadQR = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission denied', 'Storage permission is required.');
        return;
      }

      qrRef.current.toDataURL(async (data: string) => {
        const fileUri =
        FileSystem.documentDirectory + `book-qr-${Date.now()}.png`;

        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: 'base64',
        });

        await MediaLibrary.saveToLibraryAsync(fileUri);
        Alert.alert('Saved', 'QR code saved to gallery');
      });
    } catch {
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title || 'Book QR Code'}</Text>

          <QRCode
            value={value}
            size={220}
            getRef={(ref) => (qrRef.current = ref)}
          />

          {/**<TouchableOpacity style={styles.download} onPress={downloadQR}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>**/}
          <TouchableOpacity style={styles.download} onPress={exportAsPDF}>
            <Ionicons name="print-outline" size={18} color="#fff" />
            <Text style={styles.downloadText}>Export PDF</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    width: '85%',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: theme.colors.text,
  },

  download: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 20,
    alignItems: 'center',
    gap: 6,
  },

  downloadText: {
    color: '#fff',
    fontWeight: '600',
  },

  close: {
    marginTop: 16,
    color: theme.colors.textSecondary,
  },
});
