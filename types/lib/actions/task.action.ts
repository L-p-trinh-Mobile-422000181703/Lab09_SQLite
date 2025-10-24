import { Task } from '@/types/task';
import { SQLiteDatabase } from 'expo-sqlite';

export const getTasks = async (db: SQLiteDatabase, query: string = '') => {
    const searchPattern = `%${query}%`;
    const tasks = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE title LIKE ?', searchPattern);
    return tasks;    
}

export const addTask = async (db: SQLiteDatabase, title: string) => {
    await db.runAsync('INSERT INTO tasks (title, completed, priority, category) VALUES (?, ?, ?, ?)', title, 0, 'medium', 'Work');
}

export const deleteTask = async (db: SQLiteDatabase, id: number) => {
    await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}

export const updateTask = async (db: SQLiteDatabase, id: number, title: string) => {
    await db.runAsync('UPDATE tasks SET title = ? WHERE id = ?', title, id);
}

export const updateTaskStatus = async (db: SQLiteDatabase, id: number, completed: boolean) => {
    await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?', completed, id);
}

export const getTaskById = async (db: SQLiteDatabase, id: number) => {
    const task = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
    return task;
}