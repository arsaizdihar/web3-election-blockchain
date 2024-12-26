import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { Db } from "./db"

//--------------------Constants--------------------
const port = 3000
const app = new Hono()
const db = new Db()

//--------------------Routes--------------------
app.get("/", (c) => {
    return c.text("Oracle server is running")
})
app.get("/voters", async (c) => {
    try {
        const result = await db.GetVoters()
        return c.json({ result })
    } catch (error) {
        return c.json({ error: error.message }, 500)
    }
})
app.post("/voters", async (c) => {
    const body = await c.req.json()
    const b_voter_id = body.voter_id
    const b_tps_id = body.tps_id
    const b_voting_id = body.voting_id

    if (!b_voter_id || !b_tps_id || !b_voting_id) {
        return c.json({ error: "Invalid parameters" }, 400)
    }

    const voter_id = b_voter_id as string
    const tps_id = parseInt(b_tps_id as string)
    const voting_id = parseInt(b_voting_id as string)

    if (isNaN(tps_id) || isNaN(voting_id)) {
        return c.json({ error: "Invalid parameters" }, 400)
    }

    try {
        await db.InsertVoter(voter_id, tps_id, voting_id)
        return c.json({ success: true })
    } catch (error) {
        return c.json({ error: error.message }, 500)
    }
})
app.get("/voters/validity?voter_id=:voter_id&tps_id=:tps_id&voting_id=:voting_id", async (c) => {
    const p_voter_id = c.req.param("voter_id")
    const p_tps_id = c.req.param("tps_id")
    const p_voting_id = c.req.param("voting_id")

    if (!p_voter_id || !p_tps_id || !p_voting_id) {
        return c.json({ error: "Invalid parameters" }, 400)
    }

    const voter_id = p_voter_id as string
    const tps_id = parseInt(p_tps_id as string)
    const voting_id = parseInt(p_voting_id as string)

    if (isNaN(tps_id) || isNaN(voting_id)) {
        return c.json({ error: "Invalid parameters" }, 400)
    }

    try {
        const result = await db.IsVoterRegistered(voter_id, tps_id, voting_id)
        return c.json({ result })
    } catch (error) {
        return c.json({ error: error.message }, 500)
    }
})

//--------------------Main--------------------
console.log(`Server is running on http://localhost:${port}`)
serve({
    fetch: app.fetch,
    port
})
