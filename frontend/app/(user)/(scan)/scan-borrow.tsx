import { View, Text, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';

import { Animated, Dimensions } from 'react-native';
import { useRef, useEffect } from 'react';
import ScanSuccessOverlay from '../../../src/components/ScanSuccessOverlay';


import { useRouter } from 'expo-router';
import api from '../../../src/api/axios';
import { theme } from '../../../src/utils/theme';

const FRAME_SIZE = Dimensions.get('window').width * 0.7;

export default function ScanBorrow() {
  const [successData, setSuccessData] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);


  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: FRAME_SIZE,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);



  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Screen is focused → reset state
      setScanned(false);
      setSuccessData(null);

      return () => {
        // Screen is unfocused → cleanup
        setScanned(false);
        setSuccessData(null);
      };
    }, [])
  );


  const isFocused = useIsFocused();


  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const res = await api.post(`/borrows/borrow-qr/${data}`);

      setSuccessData({
        title: 'Book Borrowed',
        subtitle: res.data.book.title,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong',
        [{ text: 'Retry', onPress: () => setScanned(false) }]
      );
    }
  };


  if (!permission)
    return <View style={styles.center} />;

  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>
        <Text style={styles.link} onPress={requestPermission}>
          Grant permission
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      
      <StatusBar style="light" />
      {isFocused && !successData && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleScan}
        />
      )}

      <View style={styles.dimOverlay} />

      <View style={styles.frameContainer}>
        <View style={styles.frame}>
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLineAnim }] },
            ]}
          />
        </View>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Scan QR code to borrow Book</Text>
      </View>
      {successData && (
        <ScanSuccessOverlay
          title={successData.title}
          subtitle={successData.subtitle}
        />
      )}
    </SafeAreaView>
    

  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  permissionText: { color: theme.colors.text, fontSize: 16 },
  link: {
    marginTop: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
  },

  frameContainer: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
},

frame: {
  width: FRAME_SIZE,
  height: FRAME_SIZE,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: theme.colors.primary,
  overflow: 'hidden',
},

scanLine: {
  height: 2,
  width: '100%',
  backgroundColor: theme.colors.primary,
  opacity: 0.8,
},

dimOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.4)',
},


});
