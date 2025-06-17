import express from "express";
import { db } from "./config/db.js";
import { ENV } from "./config/env.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
const app = express();
const port = ENV.PORT;
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});
app.post("/api/favorites", async (req, res) => {
  try{
    const {userId,recipeId, title, image, cookTime, servings} = req.body;

    if(!userId || !recipeId || !title){
      return res.status(400).json({success: false, message: "Missing required fields"});
    }
    const newFavorite = await db.insert(favoritesTable).values({userId,recipeId, title, image, cookTime, servings}).returning();
    res.status(201).json(newFavorite[0]);
  }
  catch(e){
    console.error("Error adding favorite:", e);
    res.status(500).json({success: false, message: "Internal server error"});
  }
})
app.delete("/api/favorites/:userId/:recipeId",async(req,res)=>{
  try{
    const {userId,recipeId} = req.params;
    await db.delete(favoritesTable).where(and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId))));
    res.status(200).json({success: true, message: "Favorite deleted successfully"});
  }
  catch(e){
    console.error("Error deleting favorite:", e);
    res.status(500).json({success: false, message: "Internal server error"});
  }
})
app.get("/api/favorites/:userId",async(req,res)=>{
  try{
    const {userId} = req.params;
    const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId));
    res.json(userFavorites);
  }
  catch(e){
    console.error("Error fetching favorites:", e);
    res.status(500).json({success: false, message: "Internal server error"});
  }
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});