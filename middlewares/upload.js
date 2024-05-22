// upload.js;
import path from "node:path";
import crypto from "node:crypto";

import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log("ШЛЯХ", path.resolve("tmp"));
    cb(null, path.resolve("tmp"));
  },
  filename(req, file, cb) {
    console.log(file);
    // console.log("user", req);
    // cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${req.user.id}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

export default upload;
