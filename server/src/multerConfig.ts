import multer from "multer";

const mstorage = multer.memoryStorage();

const fstorage = multer.diskStorage({
  destination: (_req, _res, cb) => {
    cb(null, "public");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilterSave = (_req: any, file: any, cb: any) => {
  if (
    file.mimetype == "application/msword" ||
    file.mimetype ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileFilterUpload = (_req: any, file: any, cb: any) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "application/msword" ||
    file.mimetype ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: mstorage,
  fileFilter: fileFilterUpload,
});
export const save = multer({ storage: fstorage, fileFilter: fileFilterSave });
