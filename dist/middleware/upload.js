"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        let ext = path_1.default.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
var Upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "application/pdf" ||
            file.mimetype === "video/mp4" ||
            file.mimetype === "video/mp3" ||
            file.mimetype === "video/360p") {
            callback(null, true);
        }
        else {
            console.log("only jpg & png file supported");
            callback(null, false);
        }
    },
    limits: {
        fieldSize: 1024 * 1024 * 2,
    },
});
exports.Upload = Upload;
