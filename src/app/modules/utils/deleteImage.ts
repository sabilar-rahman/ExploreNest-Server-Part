import { cloudinaryUpload } from "../../config/cloudinary.config"


export type TImageFiles = { [fieldname: string]: Express.Multer.File[] }

export type TImageFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  path: string
  size: number
  filename: string
}

export const deleteImageFromCloudinary = (files: TImageFiles) => {
  const publicIds: string[] = []

  for (const file of Object.values(files)) {
    for (const image of file) {
      publicIds.push(image.filename)
    }
  }

  return new Promise((resolve, reject) => {
    cloudinaryUpload.api.delete_resources(
      publicIds,
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })
}