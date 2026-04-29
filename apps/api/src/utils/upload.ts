import multer, { diskStorage } from "multer";

export const adminProfileUpload = multer({
    storage: diskStorage({})
}).single("profile")

export const taskHeroUpload = multer({
    storage: diskStorage({})
}).single("hero")