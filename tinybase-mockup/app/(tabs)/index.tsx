import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/hooks/useTinyBase';
import { Task } from '@/lib/store';

export default function HomeScreen() {
  const {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    deleteAllCompletedTasks,
  } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingTask(null);
    setModalVisible(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setModalVisible(true);
  };

  const handleDelete = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  const handleDeleteCompleted = () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      Alert.alert('No Tasks', 'No completed tasks to delete');
      return;
    }

    Alert.alert(
      'Delete Completed Tasks',
      `Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAllCompletedTasks(),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">TinyBase CRUD Demo</ThemedText>
        <ThemedText type="subtitle">Tasks: {tasks.length}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText style={styles.addButtonText}>+ Add Task</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleDeleteCompleted}
        >
          <ThemedText style={styles.clearButtonText}>Clear Completed</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ScrollView style={styles.taskList}>
        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>Loading tasks...</ThemedText>
          </ThemedView>
        ) : filteredTasks.map((task) => (
          <ThemedView key={task.id} style={styles.taskItem}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleTaskCompletion(task.id)}
            >
              <ThemedText style={styles.checkboxText}>
                {task.completed ? '✓' : '○'}
              </ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.taskContent}>
              <ThemedText
                style={[
                  styles.taskTitle,
                  task.completed && styles.completedTask,
                ]}
              >
                {task.title}
              </ThemedText>
              {task.description ? (
                <ThemedText
                  style={[
                    styles.taskDescription,
                    task.completed && styles.completedTask,
                  ]}
                >
                  {task.description}
                </ThemedText>
              ) : null}
              <ThemedText style={styles.taskDate}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.taskActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(task)}
              >
                <ThemedText style={styles.editButtonText}>Edit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(task.id)}
              >
                <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        ))}
        {!loading && filteredTasks.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
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
              {editingTask ? 'Edit Task' : 'Add Task'}
            </ThemedText>
            <TouchableOpacity onPress={resetForm}>
              <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.inputLabel}>Title</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              multiline
            />

            <ThemedText style={styles.inputLabel}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description (optional)"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ThemedText style={styles.submitButtonText}>
                {editingTask ? 'Update Task' : 'Create Task'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
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
    paddingTop: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#000',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  checkbox: {
    marginRight: 12,
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  checkboxText: {
    fontSize: 20,
    color: '#007AFF',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  taskDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskActions: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
