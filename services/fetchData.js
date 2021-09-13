const production = process.env.NODE_ENV === "production";
const location_origin = production ? "https://nathanzenga.com" : "http://localhost:5678";

const fetchData = async (url, method, bodyData) => {
  const headers = method === "POST" ? { 'Content-Type': 'application/json' } : undefined;
  const body = bodyData ? JSON.stringify(bodyData) : undefined;
  const res = await fetch(url, { method, headers, body });
  const data = (await Promise.allSettled([res.json(), res.text()])).find(r => r.status === "fulfilled");
  return data.value;
}

export const getPhotos = async bodyData => {
  const photos = await fetchData(`${location_origin}/p`, "POST", bodyData);
  return photos;
}

export const getInfoText = async () => {
  const { text } = await fetchData(`${location_origin}/info/-`, "GET");
  return text;
}

export const getDesignWork = async () => {
  const { designs, design_docs } = await fetchData(`${location_origin}/designs/-`, "GET");
  return { designs, design_docs };
}