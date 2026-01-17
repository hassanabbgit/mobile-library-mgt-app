import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../src/api/axios';
import { theme } from '../../../src/utils/theme';
import BookFormModal from '../../../src/components/admin/BookFormModal';
import QRCodeModal from '../../../src/components/admin/QRCodeModal';






type Book = {
  id: number;
  title: string;
  author: string;
  quantity_total: number;
  quantity_available: number;
  qr_code: string;
};

export default function AdminBooks() {
  const [query, setQuery] = useState('');

  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
const [selectedBook, setSelectedBook] = useState<any>(null);

const [refreshing, setRefreshing] = useState(false);

const [qrVisible, setQrVisible] = useState(false);
const [qrValue, setQrValue] = useState('');





  const loadBooks = async () => {
    const res = await api.get('/books/get-books');
    setBooks(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);



  const handleDelete = (id: number) => {
    Alert.alert(
        'Delete Book',
        'Are you sure you want to delete this book?',
        [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
            await api.delete(`/books/delete-book/${id}`);
            loadBooks();
            },
        },
        ],
    );
    };



  const renderItem = ({ item }: { item: Book }) => {
    const available = item.quantity_available > 0;

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>

          <Text
            style={[
              styles.badge,
              {
                backgroundColor: available
                  ? '#E8F5E9'
                  : '#FFEBEE',
                color: available ? '#2E7D32' : '#C62828',
              },
            ]}
          >
            {available
              ? `${item.quantity_available} available`
              : 'Out of stock'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginRight: 5 }}>


        <TouchableOpacity
          onPress={() => {
            setQrValue(item.qr_code);
            setQrVisible(true);
            setSelectedBook(item); // <- keep the selected book so we can pass title
          }}
          style={{ padding: 5 }}
        >
          <Ionicons name="qr-code-outline" size={20} color="#555" />
        </TouchableOpacity>



        <TouchableOpacity
            onPress={() => {
            setSelectedBook(item);
            setModalVisible(true);
            }}
            style={{ padding: 5 }}
        >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>


        <TouchableOpacity onPress={() => handleDelete(item.id)}  style={{ padding: 5 }}>
            <Ionicons name="trash-outline" size={20} color="#C62828" />
        </TouchableOpacity>
        </View>


      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Manage Books</Text>

      <TextInput
        placeholder="Search books..."
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={async (text) => {
            setQuery(text);
            if (!text) return loadBooks();

            const res = await api.get(`/books/search-books?q=${text}`);
            setBooks(res.data);
        }}
        style={styles.search}
        />


      <FlatList
        data={books}
        refreshing={refreshing}
        onRefresh={async () => {
            setRefreshing(true);
            await loadBooks();
            setRefreshing(false);
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        />

        {books.length === 0 && (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>No books found</Text>
        </View>
        )}



      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
            setSelectedBook(null);
            setModalVisible(true);
        }}
        >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>




      <BookFormModal
        visible={modalVisible}
        book={selectedBook}
        onClose={() => setModalVisible(false)}
        onSuccess={loadBooks}
        />



      <QRCodeModal
        visible={qrVisible}
        value={qrValue}
        title={selectedBook?.title} // <- pass book title
        onClose={() => setQrVisible(false)}
      />



    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },

  header: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },

  author: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  search: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    },
    empty: {
    marginTop: 60,
    alignItems: 'center',
    },

    emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    },

});
