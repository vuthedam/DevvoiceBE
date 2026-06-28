import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import connectDB from "./src/common/configs/connectDB.js";
import jsonValidator from "./src/common/middlewares/jsonValidator.js";
import notFoundHandler from "./src/common/middlewares/notfoundHandler.js";
import errorHandler from "./src/common/middlewares/errorHandler.js";
import { configenv } from "./src/common/configs/configenv.js";

const app = express();
const port = configenv.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", router);

// Middleware xử lý JSON không hợp lệ
app.use(jsonValidator);
// Middleware xử lý route không tồn tại
app.use(notFoundHandler);
// Middleware xử lý lỗi chung
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Ứng dụng của bạn đang được khởi động trên cổng ${port}`
  );
});
