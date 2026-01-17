import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getBooks, searchBooks } from '../../../src/api/books.api';
import BookCard from '../../../src/components/BookCard';
import { theme } from '../../../src/utils/theme';
import QRCode from 'react-native-qrcode-svg';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text) return loadBooks();

    const data = await searchBooks(text);
    setBooks(data);
  };

  const openModal = (book: any) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Library Catalog</Text>

      <TextInput
        placeholder="Search books..."
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.search}
        value={query}
        onChangeText={handleSearch}
      />

      <FlatList
        data={books}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <BookCard book={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />

      {/* Modal for Book Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBook && (
              <>
                <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                <Text style={styles.modalText}>Author: {selectedBook.author}</Text>
                <Text style={styles.modalText}>
                  Available: {selectedBook.quantity_available} / {selectedBook.quantity_total}
                </Text>
                
                {/* QR code */}
                <View style={{ marginVertical: 16, alignItems: 'center' }}>
                  <QRCode value={selectedBook.qr_code || selectedBook.id.toString()} size={150} />
                </View>

                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  search: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
