const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

async function sendFileWithPolling(
  filePath,
  modelId,
  apiKey,
  maxRetries = 30,
  pollingInterval = 2
) {
  const fileName = path.basename(filePath);
  const headers = {
    "Authorization": apiKey
  };

  const formData = new FormData();
  formData.append("model_id", modelId);
  formData.append("rag", "false");
  formData.append("file", fs.createReadStream(filePath), {
    filename: fileName,
    contentType: "application/octet-stream"
  });

  console.log(`Enqueuing file: ${filePath}`);
  const response = await axios.post(
    "https://api-v2.mindee.net/v2/inferences/enqueue",
    formData,
    {headers: { ...headers, ...formData.getHeaders() }}
  );

  const jobData = response.data.job;
  const pollingUrl = jobData.polling_url;

  await new Promise(resolve => setTimeout(resolve, 3000));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    console.log(`Polling on: ${pollingUrl}`);

    const pollResponse = await axios.get(pollingUrl, {
      headers,
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });

    const pollData = pollResponse.data;
    const jobStatus = pollData.job?.status;

    if (pollResponse.status === 302 || jobStatus === "Processed") {
      const resultUrl = pollData.job?.result_url;
      console.log(`Get result from: ${resultUrl}`);

      const resultResponse = await axios.get(resultUrl, { headers });
      return resultResponse.data;
    }

    await new Promise(resolve => setTimeout(resolve, pollingInterval * 1000));
  }

  throw new Error(`Polling timed out after ${maxRetries} attempts`);
}

async function main() {
  try {
    const result = await sendFileWithPolling(
      "/home/ianardee/Downloads/Invoice-5Z69WRLL-0003.pdf",
      "3b87142f-0eb4-4e6d-92a8-1ed01f097052",
      "md_xcygjjg8ehfaf2jfeyzomxghvhzh4kzs"
    );
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
