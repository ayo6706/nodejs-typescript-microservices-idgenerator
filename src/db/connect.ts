import mongoose, {ConnectOptions} from "mongoose";
import config from "config";


async function connect() {
  const dbUri = config.get("dbUri") as string;

  try {
    await mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
    console.log("Database connected");
  } catch (error) {
    console.error("db error", error);
    process.exit(1);
  }
}

export default connect;
