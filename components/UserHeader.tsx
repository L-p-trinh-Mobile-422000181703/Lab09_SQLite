import { User } from '@/types/task';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserHeaderProps {
  user: User;
  showBackButton?: boolean;
}

export default function UserHeader({ user, showBackButton = true }: UserHeaderProps) {
    const router = useRouter();
    const handleBackPress = () => {
        router.back();
    };
  
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" 

          />
        </TouchableOpacity>
      )}
      
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={30} color="#FFF" />
            </View>
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hi {user.name}</Text>
          <Text style={styles.subGreeting}>
            {user.greeting || "Have a great day ahead"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B73FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
