import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { sanitizeFileName } from './sanitizeFileName';

type ExportQRToPDFParams = {
  base64QR: string;
  title: string;
};

export async function exportQRToPDF({
  base64QR,
  title,
}: ExportQRToPDFParams) {
  const fileName = `${sanitizeFileName(title) || 'qr-code'}.pdf`;

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          h1 {
            font-size: 50px;
            margin-bottom: 32px;
          }

          img {
            width: 720px;
            height: 720px;
          }
        </style>
      </head>

      <body>
        <h1>${title}</h1>
        <img src="data:image/png;base64,${base64QR}" />
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });

    // Use the share dialog to let user save the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Save PDF',
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to save PDF document.');
  }
}