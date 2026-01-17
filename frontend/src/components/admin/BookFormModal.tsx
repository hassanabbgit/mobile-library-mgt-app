import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { theme } from '../../utils/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  book?: any; // if present → edit mode
};

export default function BookFormModal({
  visible,
  onClose,
  onSuccess,
  book,
}: Props) {
  const isEdit = !!book;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (book) {
        setTitle(book.title);
        setAuthor(book.author);
        setQuantity(String(book.quantity_total));
        setCategory(book.category || '');
        setDescription(book.description || '');
    } else {
        setTitle('');
        setAuthor('');
        setQuantity('');
        setCategory('');
        setDescription('');
    }
    }, [book, visible]);


  const handleSubmit = async () => {
    if (!title || !author || !category || !quantity) {
        Alert.alert('Missing fields', 'Please fill all required fields.');
        return;
    }

    try {
        if (isEdit) {
        await api.put(`/books/update-book/${book.id}`, {
            title,
            author,
            category,
            description,
            quantity_total: Number(quantity),
        });
        } else {
        await api.post('/books/add-book', {
            title,
            author,
            category,
            description,
            quantity_total: Number(quantity),
        });
        }

        Alert.alert(
        'Success',
        isEdit ? 'Book updated successfully' : 'Book added successfully',
        [
            {
            text: 'OK',
            onPress: () => {
                onSuccess();   // refresh list
                onClose();     // close modal
            },
            },
        ],
        );
    } catch (err: any) {
        Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong',
        );
    }
    };


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </Text>

          <TextInput
            placeholder="Book Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Author"
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
          />


          <TextInput
            placeholder="Category"
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            />

            <TextInput
            placeholder="Description"
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            />


          <TextInput
            placeholder="Total Quantity"
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.save} onPress={handleSubmit}>
              <Text style={styles.saveText}>
                {isEdit ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },

  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },

  cancel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.lg,
    marginVertical: 8,
  },

  save: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
