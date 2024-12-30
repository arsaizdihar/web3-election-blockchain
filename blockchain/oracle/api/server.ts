import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { Db } from "./db"

//--------------------Constants--------------------
const hostname = "0.0.0.0"
const port = 3000
const app = new Hono()
const db = new Db()

//--------------------Middleware--------------------
app.use("*", async (c, next) => {
    const start = Date.now()
    const endpoint = c.req.url

    await next()

    const duration = Date.now() - start
    const status = c.res.status
    const responseBody = await c.res.text()
    console.log(
        `[${new Date().toISOString()}] ${c.req.method} ${endpoint} ${status} - ${duration}ms \nContent: ${responseBody}`
    )
})

//--------------------Routes--------------------
app.get("/", (c) => {
    return c.text("Oracle server is running\n")
})
app.get(
    "/tps/:voter_id",
    cors({
        origin: "*"
    }),
    async (c) => {
        const voter_id = c.req.param("voter_id")
        const result = await db.GetTpsId(voter_id.toLowerCase())
        return c.json({ tps_id: result })
    }
)
app.get("/voters", async (c) => {
    try {
        const result = await db.GetVoters()
        return c.json({ result })
    } catch (error: any) {
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
        const status = await db.InsertVoter(voter_id, tps_id, voting_id)
        if (status === 409) {
            return c.json({ error: "Voter already registered" }, 409)
        }
        return c.json({ status })
    } catch (error: any) {
        return c.json({ error: error.message }, 500)
    }
})
app.get("/voters/validity", async (c) => {
    const p_voter_id = c.req.query("voter_id")
    const p_tps_id = c.req.query("tps_id")
    const p_voting_id = c.req.query("voting_id")

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
    } catch (error: any) {
        return c.json({ error: error.message }, 500)
    }
})

//--------------------Main--------------------
db.Init()

console.log(`Server is running on http://${hostname}:${port}`)
serve({
    fetch: app.fetch,
    hostname: hostname,
    port: port
})
