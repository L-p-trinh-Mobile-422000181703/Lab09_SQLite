import UserHeader from '@/components/UserHeader';
import { addTask, updateTask } from '@/types/lib/actions/task.action';
import { User } from '@/types/task';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AddJobModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [jobTitle, setJobTitle] = useState('');

  const user: User = {
    id: (params.userId as string) || '1',
    name: (params.userName as string) || 'Twinkle',
    greeting: (params.userGreeting as string) || 'Have a great day ahead'
  };

  const task: {
    id: number;
    title: string;
  } = {
    id: Number(params.taskId) || 0,
    title: (params.taskTitle as string) || '',
  }

  useEffect(() => {
    if (task.id !== 0 && task.title) {
      setJobTitle(task.title);
    }
  }, [task.id, task.title]);

  const handleFinish = async () => {
    if (!jobTitle.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return;
    }

    try {
      setLoading(true);
      if (task.id === 0) {
        await addTask(db, jobTitle.trim());
      } else {
        await updateTask(db, task.id, jobTitle.trim());
      }
      Alert.alert('Success', 'Job added successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add job');
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <UserHeader user={user} showBackButton={true} />
        
        <View style={styles.content}>
          <Text style={styles.title}>ADD YOUR JOB</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text" size={24} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="input your job"
                placeholderTextColor="#999"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.finishButton, !jobTitle.trim() && styles.buttonDisabled]}
            onPress={handleFinish}
            disabled={!jobTitle.trim()}
          >
            <Text style={styles.buttonText}>FINISH →</Text>
          </TouchableOpacity>

          <View style={styles.illustrationContainer}>
            <View style={styles.notepadContainer}>
              <View style={styles.notepad}>
                <View style={styles.notepadLines} />
                <View style={styles.notepadLines} />
                <View style={styles.notepadLines} />
                <View style={styles.notepadLines} />
                <Ionicons name="pencil" size={60} color="#E53935" style={styles.pencil} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    height: '100%', 
    justifyContent: 'center',
    
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  finishButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  notepadContainer: {
    position: 'relative',
  },
  notepad: {
    width: 200,
    height: 220,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderTopWidth: 30,
    borderTopColor: '#FFF59D',
  },
  notepadLines: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
    width: '100%',
  },
  pencil: {
    position: 'absolute',
    bottom: -10,
    right: -15,
    transform: [{ rotate: '-45deg' }],
  },
});
