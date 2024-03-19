import mongoose from "mongoose";
import { app } from "./app.js";

const { DB_URI, PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
        console.log("Database connection successful.");
    });
})
.catch(({ message }) => {
    console.log(message);
    process.exit(1);
});