import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUsers } from '@/hooks/useTinyBase';
import { User } from '@/lib/store';

export default function TabTwoScreen() {
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
  } = useUsers();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = searchQuery ? searchUsers(searchQuery) : users;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: avatar.trim() || undefined,
      });
    } else {
      createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setAvatar('');
    setEditingUser(null);
    setModalVisible(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || '');
    setModalVisible(true);
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(userId),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">User Management</ThemedText>
        <ThemedText type="subtitle">Users: {users.length}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText style={styles.addButtonText}>+ Add User</ThemedText>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users..."
          clearButtonMode="while-editing"
        />
      </ThemedView>

      <ScrollView style={styles.userList}>
        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>Loading users...</ThemedText>
          </ThemedView>
        ) : filteredUsers.map((user) => (
          <ThemedView key={user.id} style={styles.userItem}>
            <Image
              source={{ uri: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` }}
              style={styles.avatar}
            />

            <ThemedView style={styles.userContent}>
              <ThemedText style={styles.userName}>{user.name}</ThemedText>
              <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              <ThemedText style={styles.userDate}>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.userActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(user)}
              >
                <ThemedText style={styles.editButtonText}>Edit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(user.id)}
              >
                <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        ))}
        {!loading && filteredUsers.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              {searchQuery ? 'No users found' : 'No users yet'}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modal}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title">
              {editingUser ? 'Edit User' : 'Add User'}
            </ThemedText>
            <TouchableOpacity onPress={resetForm}>
              <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.modalContent}>
            <ThemedText style={styles.inputLabel}>Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter full name"
            />

            <ThemedText style={styles.inputLabel}>Email *</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ThemedText style={styles.inputLabel}>Avatar URL (optional)</ThemedText>
            <TextInput
              style={styles.input}
              value={avatar}
              onChangeText={setAvatar}
              placeholder="Enter avatar image URL"
              autoCapitalize="none"
            />

            {avatar && (
              <ThemedView style={styles.avatarPreview}>
                <ThemedText style={styles.previewLabel}>Avatar Preview:</ThemedText>
                <Image source={{ uri: avatar }} style={styles.previewAvatar} />
              </ThemedView>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ThemedText style={styles.submitButtonText}>
                {editingUser ? 'Update User' : 'Create User'}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 60,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  userDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  userActions: {
    flexDirection: 'column',
  },
  editButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.6,
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  cancelButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});