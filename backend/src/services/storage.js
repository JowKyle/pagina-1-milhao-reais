import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config()
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.S3_REGION || undefined,
  s3ForcePathStyle: !!process.env.S3_ENDPOINT
})
export async function uploadBase64Image(base64, key){
  const matches = base64.match(/^data:(image\/[^;]+);base64,(.+)$/)
  if(!matches) throw new Error('invalid image')
  const buffer = Buffer.from(matches[2],'base64')
  await s3.putObject({ Bucket: process.env.S3_BUCKET, Key: key, Body: buffer, ACL: 'public-read', ContentType: matches[1] }).promise()
  return `${process.env.S3_URL_PREFIX || ''}/${process.env.S3_BUCKET}/${key}`
}
