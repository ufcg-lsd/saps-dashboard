export const createFinalUrl = (
  url: string,
  endpoint: string,
  params?: Record<string, string>
) => {
  const urlObject = new URL(`${url}${endpoint}`);

  if (params)
    Object.keys(params).forEach((key) => {
      urlObject.searchParams.append(key, params[key]);
    });

  return urlObject.toString();
};
