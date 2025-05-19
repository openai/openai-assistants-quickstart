import { openai } from "@/app/openai";
import formidable, { File } from "formidable";
import fs from 'fs';

// Handle file upload
export async function POST(request) {
  const form = new formidable.IncomingForm();

  const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  const uploadedFile = files.file[0] as File;

  const fileStream = fs.createReadStream(uploadedFile.filepath);
  const fileName = uploadedFile.originalFilename;

  const openaiFile = await openai.files.create({
    file: fileStream,
    purpose: "assistants",
  });

  return new Response(JSON.stringify({ message: "File uploaded successfully", fileId: openaiFile.id, fileName }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
