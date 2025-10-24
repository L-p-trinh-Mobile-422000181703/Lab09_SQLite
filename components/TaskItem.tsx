import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FFA500';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => onToggle(task.id, task.completed)}
      >
        <Ionicons 
          name={task.completed ? "checkbox" : "square-outline"} 
          size={24} 
          color={task.completed ? "#4CAF50" : "#9E9E9E"} 
        />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={[
          styles.title,
          task.completed && styles.completedTitle
        ]}>
          {task.title}
        </Text>
        {task.category && (
          <Text style={styles.category}>{task.category}</Text>
        )}
      </View>

      {task.priority && (
        <View style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(task.priority) }
        ]} />
      )}

      {onEdit && (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit(task.id)}
        >
          <Ionicons name="pencil" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Ionicons name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  priorityIndicator: {
    width: 4,
    height: 30,
    borderRadius: 2,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
