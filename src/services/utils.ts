export const createFinalUrl = (
  url: string,
  endpoint: string,
  params?: Record<string, string>
) => {
  const urlString = `http://${url}${endpoint}`;

  const urlObject = new URL(urlString);
  if (params)
    Object.keys(params).forEach((key) => {
      urlObject.searchParams.append(key, params[key]);
    });

  return urlObject.toString();
};
