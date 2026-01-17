import { FlatList, Text, View, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import api from '../../../src/api/axios';
import { theme } from '../../../src/utils/theme';
//import { Colors } from '../../../src/utils/theme';

type HistoryItem = {
  id: number;
  title: string;
  author: string;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: 'borrowed' | 'returned';
};


export default function BorrowHistory() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/borrows/history');
      setData(res.data);
    } catch (err) {
      console.log('History error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>Author: {item.author}</Text>
      <Text style={styles.meta}>
        Borrowed: {new Date(item.borrowed_at).toLocaleDateString()}
      </Text>
      <Text style={styles.meta}>
        Due: {new Date(item.due_date).toLocaleDateString()}
      </Text>
      <Text style={styles.meta}>
        Status:{' '}
        <Text
          style={{
            color:
              item.status === 'returned'
                ? theme.colors.accent
                : theme.colors.error,
            fontWeight: '600',
          }}
        >
          {item.status === 'returned' ? 'Returned' : 'Borrowed'}
        </Text>
      </Text>
    </View>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 10 }}>
      <Text style={styles.header}>Borrow History</Text>
      <FlatList
        data={Array.isArray(data) ? data : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No borrow history yet 📚</Text>
        }
        contentContainerStyle={data.length === 0 ? styles.emptyContainer : undefined}
      />
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background, // page background
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});

