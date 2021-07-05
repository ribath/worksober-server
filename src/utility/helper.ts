import sharp from 'sharp'
import fs from 'fs'
import util from 'util'

export async function resizeImg (image:Buffer, size:number) {
  return await sharp(image)
    .rotate()
    .resize({
      width: size,
      height: size
    })
    .jpeg({ mozjpeg: true })
    .toBuffer()
}

export async function readFileAsync (filePath:string) {
  const readFile = util.promisify(fs.readFile)
  return readFile(filePath)
}
