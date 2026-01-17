import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../src/utils/theme';
import { useEffect, useState } from 'react';
import api from '../../../src/api/axios';
import CreateAdminModal from '../../../src/components/admin/CreateAdminModal';




const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 42;

type BorrowedBook = {
  id: number;
  title: string;
  author: string;
  user_name: string;
  email: string;
  borrowed_at: string;
  due_date: string;
  status: string;
};

export default function AdminDashboard() {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [recentStudents, setRecentStudents] = useState<number>(0);
  const [createAdminModalVisible, setCreateAdminModalVisible] = useState(false);
  const [recentBorrows, setRecentBorrows] = useState<BorrowedBook[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const booksRes = await api.get('/books/get-books');
      setTotalBooks(booksRes.data.length);

      const borrowedRes = await api.get('/borrows/admin/borrowed');
      setBorrowedCount(borrowedRes.data.length);

      const usersRes = await api.get('/users/students');
      setTotalUsers(usersRes.data.length);

      const recentRes = await api.get('/users/recent-students');
      setRecentStudents(recentRes.data.length);

      const recentBorrowsRes = await api.get('/borrows/admin/recent');
      setRecentBorrows(recentBorrowsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome, Admin</Text>
      <Text style={styles.subtitle}>Here’s an overview of your library</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {/* Dashboard Cards */}
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="book-outline" size={40} color="#1E88E5" />
          <Text style={styles.cardLabel}>Total Books</Text>
          <Text style={styles.cardValue}>{totalBooks}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="book" size={40} color="#FB8C00" />
          <Text style={styles.cardLabel}>Currently Borrowed</Text>
          <Text style={styles.cardValue}>{borrowedCount}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="people-outline" size={40} color="#43A047" />
          <Text style={styles.cardLabel}>Total Users</Text>
          <Text style={styles.cardValue}>{totalUsers}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#F3E5F5' }]}>
          <Ionicons name="person-add-outline" size={40} color="#8E24AA" />
          <Text style={styles.cardLabel}>Recent Registrations</Text>
          <Text style={styles.cardValue}>{recentStudents}</Text>
        </View>

        {/* Button to open modal */}
        <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#8E24AA',
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: theme.radius.lg,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setCreateAdminModalVisible(true)}
          >
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 8 }}>
              Create Admin
            </Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>

      {/* Recent Borrowed Books Table */}
      <Text style={styles.sectionTitle}>Recent Borrowed Books</Text>
      <ScrollView horizontal style={{ marginBottom: 40 }}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Book</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Author</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Borower</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Email</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Borrowed At</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Due Date</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
          </View>

          {/* Table Rows */}
          {recentBorrows.map((borrow) => (
            <View key={borrow.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{borrow.title}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{borrow.author}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{borrow.user_name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{borrow.email}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(borrow.borrowed_at).toLocaleDateString()}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(borrow.due_date).toLocaleDateString()}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{borrow.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>



      {/* Create Admin Modal */}
        <CreateAdminModal
          visible={createAdminModalVisible}
          onClose={() => setCreateAdminModalVisible(false)}
          onSuccess={fetchStats} // refresh stats after new admin
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

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.xs,
  },

  card: {
    width: cardWidth,
    borderRadius: theme.radius.lg,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: theme.spacing.md,
    marginHorizontal: 8,
    alignItems: 'center',
  },

  cardLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },

  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginVertical: 16,
  },

  table: {
    minWidth: 800, // allow horizontal scroll
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },

  tableHeader: {
    backgroundColor: theme.colors.surface,
  },

  tableCell: {
    fontSize: 15,
    color: theme.colors.text,
    paddingHorizontal: 4,
  },
});
