/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null

async function openDb() {
  if (!db) {
    db = await open({
      filename: './uniexchange.sqlite',
      driver: sqlite3.Database
    })

    await db.exec(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        file_path TEXT,
        university TEXT,
        subject TEXT,
        year INTEGER,
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        material_id INTEGER,
        user_id TEXT,
        rating INTEGER,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials (id)
      );

      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        material_id INTEGER,
        user_id TEXT,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials (id)
      );

      CREATE TABLE IF NOT EXISTS discussions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        material_id INTEGER,
        user_id TEXT,
        content TEXT,
        parent_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials (id),
        FOREIGN KEY (parent_id) REFERENCES discussions (id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        type TEXT,
        content TEXT,
        related_id INTEGER,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        material_id INTEGER,
        interaction_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials (id)
      );
    `)
  }
  return db
}

async function searchMaterials(query: string, filters: { university?: string, subject?: string, year?: string }) {
  const db = await openDb()
  let sql = `
    SELECT * FROM materials
    WHERE (title LIKE ? OR description LIKE ?)
  `
  const params = [`%${query}%`, `%${query}%`]

  if (filters.university) {
    sql += ' AND university = ?'
    params.push(filters.university)
  }
  if (filters.subject) {
    sql += ' AND subject = ?'
    params.push(filters.subject)
  }
  if (filters.year) {
    sql += ' AND year = ?'
    params.push(filters.year)
  }

  sql += ' ORDER BY created_at DESC'

  return db.all(sql, params)
}

export { openDb, searchMaterials }