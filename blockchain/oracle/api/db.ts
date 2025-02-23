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
                    voter_id TEXT NOT NULL,
                    tps_id INTEGER NOT NULL,
                    voting_id INTEGER NOT NULL,
                    PRIMARY KEY (voter_id, voting_id)
                )
            `)
            console.log("Database initialized")
        } catch (error) {
            console.log("Database failed to initialize: ", error)
            throw error
        }
    }

    async InsertVoter(voter_id: string, tps_id: number, voting_id: number): Promise<number> {
        const dbInstance = await Db.getInstance()

        try {
            const result = await dbInstance.get(
                `SELECT * FROM voters WHERE voter_id = ? AND voting_id = ?`,
                voter_id,
                voting_id
            )
            if (result) {
                return 409
            }

            await dbInstance.run(
                `
                INSERT INTO voters (voter_id, tps_id, voting_id) VALUES (?, ?, ?)
            `,
                voter_id,
                tps_id,
                voting_id
            )

            return 200
        } catch (error) {
            console.log("Failed to insert voter: ", error)
            throw error
        }
    }

    async GetVoters(): Promise<any> {
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

    async GetTpsId(voter_id: string): Promise<number> {
        const dbInstance = await Db.getInstance()
        const result = await dbInstance.get(`SELECT tps_id FROM voters WHERE voter_id = ?`, voter_id)
        return result?.tps_id || 0
    }
}
