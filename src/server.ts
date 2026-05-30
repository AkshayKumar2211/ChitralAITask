import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Chitralai backend running on https://chitralaitask.onrender.com`);
});
