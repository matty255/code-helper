const apiUrl = `https://open-api.jejucodingcamp.workers.dev/`;

export const submitDataToApi = async (data) => {
  try {
    const response = await axios.post(apiUrl, data, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    return response.data;
  } catch (error) {
    console.error("API post error:", error);
    throw error;
  }
};
