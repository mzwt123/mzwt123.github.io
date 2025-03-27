import { createWriteStream, existsSync } from 'fs'
import { mkdir, readFile, unlink, writeFile } from 'fs/promises'
import path from 'path'
// import { UPLOAD_DIR } from '~/constants/admin'

// TODO: Dangerous!!!
const UPLOAD_DIR = ''

export const ensureUploadDir = async () => {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export const writeChunk = async (
  fileId: string,
  chunkData: Buffer,
  chunkIndex: number
) => {
  const chunkPath = path.join(UPLOAD_DIR, `${fileId}-${chunkIndex}`)
  await writeFile(chunkPath, chunkData)
  return chunkPath
}

export const mergeChunks = async (
  fileId: string,
  totalChunks: number,
  fileName: string
) => {
  const finalPath = path.join(UPLOAD_DIR, fileName)
  const writeStream = createWriteStream(finalPath)

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(UPLOAD_DIR, `${fileId}-${i}`)
    const chunkBuffer = await readFile(chunkPath)
    writeStream.write(chunkBuffer)
    await unlink(chunkPath)
  }

  return new Promise<string>((resolve, reject) => {
    writeStream.on('finish', () => resolve(finalPath))
    writeStream.on('error', reject)
    writeStream.end()
  })
}

export const cleanupChunks = async (fileId: string, totalChunks: number) => {
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(UPLOAD_DIR, `${fileId}-${i}`)
    if (existsSync(chunkPath)) {
      await unlink(chunkPath)
    }
  }
}
