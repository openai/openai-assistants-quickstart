import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";


// upload file to assistant's vector store
export async function POST(request: Request) {
  const formData = await request.formData();               // process file as FormData
  const file = formData.get("file") as File;               // the single uploaded file

  const vectorStoreId = await getOrCreateVectorStore();    // get/create VS

  // 1) upload the file to OpenAI Files
  const openaiFile = await openai.files.create({
    file,
    purpose: "assistants",
  });

  // 2) attach it to the vector store
  await openai.beta.vectorStores.files.create(vectorStoreId, {
    file_id: openaiFile.id,
  });

  return new Response();
}


// list files in assistant's vector store
export async function GET() {
  const vectorStoreId = await getOrCreateVectorStore();

  const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

  const filesArray = await Promise.all(
    fileList.data.map(async (file) => {
      const fileDetails = await openai.files.retrieve(file.id);
      const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        file.id
      );
      return {
        file_id: file.id,
        filename: fileDetails.filename,
        status: vectorFileDetails.status,
      };
    })
  );

  return Response.json(filesArray);
}


// delete file from assistant's vector store
export async function DELETE(request: Request) {
  const body = await request.json();
  const fileId = body.fileId as string;

  const vectorStoreId = await getOrCreateVectorStore();
  await openai.beta.vectorStores.files.del(vectorStoreId, fileId);

  return new Response();
}



  /* Helper functions */
const getOrCreateVectorStore = async () => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  // If the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }

  // Otherwise, create a new vector store and attach it to the assistant
  const vectorStore = await openai.beta.vectorStores.create({
    name: "sample-assistant-vector-store",
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });

  return vectorStore.id;
};
