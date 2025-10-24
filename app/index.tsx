import { getUserByName } from '@/types/lib/actions/user.action';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useSQLiteContext } from 'expo-sqlite';


export default function WelcomeScreen() {
  const db = useSQLiteContext();  
  const [name, setName] = useState('');
  const router = useRouter();


  const handleGetStarted = async () => {
    const user = await getUserByName(db,name);
    if (user) {
      router.push({
        pathname: '/task',
        params: {
          userId: user.id,
          userName: user.name,
          userGreeting: user.greeting || 'Have a great day ahead'
        }
      });
    } else {
      Alert.alert('User not found');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>MANAGE YOUR</Text>
          <Text style={styles.title}>TASK</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9E9E9E"
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, !name && styles.buttonDisabled]}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>GET STARTED →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B73FF',
    textAlign: 'center',
    lineHeight: 40,
  },
  inputContainer: {
    width: '100%',
    marginTop: 60,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
