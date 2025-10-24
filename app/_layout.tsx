import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="tasks.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="task" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
      </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL,
    priority TEXT,
    category TEXT
);
CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    greeting TEXT
);
`);
    await db.execAsync(`
    INSERT INTO tasks (title, completed, priority, category)
    VALUES 
    ('To check email', 1, 'high', 'Work'),
    ('UI task web page', 1, 'medium', 'Development'),
    ('Learn javascript basic', 1, 'medium', 'Learning'),
    ('Learn HTML Advance', 1, 'medium', 'Learning'),
    ('Medical App UI', 0, 'high', 'Design'),
    ('Learn Java', 1, 'medium', 'Learning');
  `);
  await db.runAsync('INSERT INTO users (name, avatar, greeting) VALUES (?, ?, ?)', 'John Doe', 'https://example.com/avatar.jpg', 'Hello, John Doe!');
  await db.runAsync('INSERT INTO users (name, avatar, greeting) VALUES (?, ?, ?)', 'Phát', 'https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/10/15/ronaldo-lap-cu-dup-bo-dao-nha-van-roi-chien-thang-phut-chot-63.jpg?width=500&s=DT_jR344X0ua5gC7Zq2gPQ', 'Hello, Phát!');
  currentDbVersion = 1;
  
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
}
