import sqlite3 from "sqlite3"
import { Database, open } from "sqlite"

let dbInstance: Database | null = null

export async function getDB(): Promise<Database> {
    if (!dbInstance) {
        dbInstance = await open({
            filename: "oracle.db",
            driver: sqlite3.Database
        })
    }
    return dbInstance
}

export async function initDB(): Promise<void> {
    const db = await getDB()

    try {
        await db.run(`
            CREATE TABLE IF NOT EXISTS voters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                voter_id TEXT NOT NULL,
                tps_id INTEGER NOT NULL,
                voting_id INTEGER NOT NULL
            )
        `)
        console.log("Database initialized")
    } catch (error) {
        console.log("Database failed to initialize: ", error)
        throw error
    }
}

export async function InsertVoter(voter_id: string, tps_id: number, voting_id: number): Promise<void> {
    const db = await getDB()

    try {
        await db.run(
            `
            INSERT INTO voters (voter_id, tps_id, voting_id) VALUES (?, ?, ?)
        `,
            voter_id,
            tps_id,
            voting_id
        )
    } catch (error) {
        console.log("Failed to insert voter: ", error)
        throw error
    }
}

export async function IsVoterRegistered(voter_id: string, tps_id: number, voting_id: number): Promise<boolean> {
    const db = await getDB()

    try {
        const result = await db.get(
            `
            SELECT * FROM voters WHERE voter_id = ? AND tps_id = ? AND voting_id = ?
        `,
            voter_id,
            tps_id,
            voting_id
        )
        return !!result
    } catch (error) {
        console.log("Failed to check voter registration: ", error)
        throw error
    }
}
