import { User } from "@/types/task";
import { SQLiteDatabase } from "expo-sqlite";

export const getUserByName = async (db: SQLiteDatabase, name: string) => {
    const user = await db.getFirstAsync<User>('SELECT * FROM users WHERE name = ?', name);
    return user;
}