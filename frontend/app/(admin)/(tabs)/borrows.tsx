import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../src/api/axios';
import { theme } from '../../../src/utils/theme';

type Borrow = {
  id: number;
  user_name: string;
  email: string;
  title: string;
  author: string;
  borrowed_at: string;
  due_date: string;
  returned_at?: string | null;
  status?: 'borrowed' | 'returned' | 'overdue';
};


export default function BorrowsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [currentBorrows, setCurrentBorrows] = useState<Borrow[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<Borrow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
  try {
    setRefreshing(true);

    const currentRes = await api.get('/borrows/admin/borrowed');
    setCurrentBorrows(currentRes.data);

    const historyRes = await api.get('/borrows/admin/borrow-history');
    setBorrowHistory(
    historyRes.data.sort((a: Borrow, b: Borrow) =>
        new Date(b.borrowed_at).getTime() - new Date(a.borrowed_at).getTime()
    )
    );

  } catch (err) {
    console.error('Error fetching borrows:', err);
  } finally {
    setRefreshing(false);
  }
};


  const renderBorrowItem = ({ item }: { item: Borrow }) => {
  const isReturned = item.status === 'returned';
  const isOverdue =
    !isReturned && new Date(item.due_date) < new Date() ? true : false;

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>
          By: {item.user_name} ({item.email})
        </Text>

        <Text style={styles.dateText}>
          Borrowed: {new Date(item.borrowed_at).toLocaleDateString()}
        </Text>
        <Text style={styles.dateText}>
          Due: {new Date(item.due_date).toLocaleDateString()}
        </Text>
        {item.returned_at && (
          <Text style={styles.dateText}>
            Returned: {new Date(item.returned_at).toLocaleDateString()}
          </Text>
        )}

        {item.status && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isReturned
                  ? '#E0E0E0'
                  : isOverdue
                  ? '#FFEBEE'
                  : '#E8F5E9',
              },
            ]}
          >
            <Text
              style={{
                color: isReturned
                  ? '#757575'
                  : isOverdue
                  ? '#C62828'
                  : '#2E7D32',
                fontWeight: '600',
              }}
            >
              {isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Borrowed'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Borrows</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('current')}
          style={[
            styles.tabButton,
            activeTab === 'current' && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'current' && styles.activeTabText,
            ]}
          >
            Currently Borrowed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            Borrow History
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'current' ? currentBorrows : borrowHistory}
        keyExtractor={item => item.id.toString()}
        renderItem={renderBorrowItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBorrows} />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {activeTab === 'current'
              ? 'No current borrows.'
              : 'No borrow history yet.'}
          </Text>
        )}
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
  tabs: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
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
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  bookAuthor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textSecondary,
  },
});
