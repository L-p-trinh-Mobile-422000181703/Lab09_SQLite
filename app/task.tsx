import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import SearchBar from '@/components/SearchBar';
import TaskItem from '@/components/TaskItem';
import UserHeader from '@/components/UserHeader';
import { deleteTask, getTaskById, getTasks, updateTaskStatus } from '@/types/lib/actions/task.action';
import { useDebounce } from '@/types/lib/hooks/useDebounce';
import { Task, User } from '@/types/task';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const user: User = {
    id: (params.userId as string) || '1',
    name: (params.userName as string) || 'Twinkle',
    greeting: (params.userGreeting as string) || 'Have a great day ahead'
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const loadTasks = async () => {
    setLoading(true);
    const tasks = await getTasks(db, debouncedSearchQuery);
    setTasks(tasks);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [debouncedSearchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [debouncedSearchQuery])
  );


  const handleToggleTask = async (id: number, completed: boolean) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setLoading(true);
    await updateTaskStatus(db, id, !completed);
    setLoading(false);
  };

  const handleEditTask = async (id: number) => {
    const task = await getTaskById(db, id);
    if (!task) {
      Alert.alert('Task not found');
      return;
    }

    router.push({
      pathname: '/modal',
      params: {
        userId: user.id,
        userName: user.name,
        userGreeting: user.greeting,
        taskId: task.id ,
        taskTitle: task.title
      }
    });
  };

  const handleAddTask = () => {
    router.push({
      pathname: '/modal',
      params: {
        userId: user.id,
        userName: user.name,
        userGreeting: user.greeting
      }
    });
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      await deleteTask(db, id);
      setLoading(false);
      loadTasks();
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={handleToggleTask}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <UserHeader user={user} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B73FF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <UserHeader user={user} />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
      />
      
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskListContent}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
