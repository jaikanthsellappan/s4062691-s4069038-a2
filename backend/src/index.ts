import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import tutorAppRoutes from "./routes/tutorApplication.routes";
import courseRoutes from "./routes/course.routes";
import roleRoutes from "./routes/role.routes";
import availabilityRoutes from "./routes/availability.routes";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", tutorAppRoutes);
app.use("/api", courseRoutes);
app.use("/api", roleRoutes);
app.use("/api", availabilityRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
