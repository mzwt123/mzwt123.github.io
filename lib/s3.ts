import { createReadStream } from 'fs'
import { dirname } from 'path'
import { S3Client } from '@aws-sdk/client-s3'
import { readFile, rm } from 'fs/promises'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  endpoint: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ENDPOINT!,
  region: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_REGION!,
  credentials: {
    accessKeyId: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_SECRET_ACCESS_KEY!
  }
})

export const uploadVideoToS3 = async (
  filePath: string,
  fileName: string,
  mimeType: string,
  uniqueId: string
) => {
  const fileStream = createReadStream(filePath)

  const bucketName = `touchgal/galgame/${uniqueId}/video/${fileName}`

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME!,
    Key: bucketName,
    Body: fileStream,
    ContentType: mimeType
  })
  await s3.send(uploadCommand)
}

export const uploadImageToS3 = async (key: string, fileBuffer: Buffer) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/octet-stream'
  })
  await s3.send(uploadCommand)
}

export const uploadFileToS3 = async (key: string, filePath: string) => {
  const fileBuffer = await readFile(filePath)
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/octet-stream'
  })
  await s3.send(uploadCommand)

  const folderPath = dirname(filePath)
  await rm(folderPath, { recursive: true, force: true })
}

export const deleteFileFromS3 = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME!,
    Key: key
  })
  await s3.send(deleteCommand)
}
