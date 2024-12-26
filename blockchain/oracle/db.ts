import sqlite3 from "sqlite3"
import { Database, open } from "sqlite"

export class Db {
    static instance: Database | null = null
    static async getInstance(): Promise<Database> {
        if (!Db.instance) {
            Db.instance = await open({
                filename: "oracle.db",
                driver: sqlite3.Database
            })
        }
        return Db.instance
    }

    async Init(): Promise<void> {
        const dbInstance = await Db.getInstance()

        try {
            await dbInstance.run(`
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

    async InsertVoter(voter_id: string, tps_id: number, voting_id: number): Promise<void> {
        const dbInstance = await Db.getInstance()

        try {
            await dbInstance.run(
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

    async GetVoters(): Promise<boolean> {
        const dbInstance = await Db.getInstance()

        try {
            const result = await dbInstance.get(`SELECT * FROM voters`)
            return result
        } catch (error) {
            console.log("Failed to fetch voter data: ", error)
            throw error
        }
    }

    async IsVoterRegistered(voter_id: string, tps_id: number, voting_id: number): Promise<boolean> {
        const dbInstance = await Db.getInstance()

        try {
            const result = await dbInstance.get(
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
}
