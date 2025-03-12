/**type @type {import("drizzle-kit").Config} */

export default {
    schema: "./utils/schema.js",
    dialect:'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_Fc0wI2ydLbiX@ep-bitter-shadow-a83xzvk9-pooler.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require',

    }
}