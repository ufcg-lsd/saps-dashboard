import { FetcherArgs } from "@src/types/fetcher";
import { HTTP_METHOD } from "next/dist/server/web/http";

interface Fetcher {
  fetch: (
    url: string,
    method: HTTP_METHOD,
    body?: Object,
    args?: FetcherArgs
  ) => Promise<Response>;

  registerHeader: (key: string, value: string) => void;

  getHeaders: () => Record<string, string>;

  clearHeaders: () => void;
}

let fetcher: Fetcher;

const getFetcher = (): Fetcher => {
  let headers: Record<string, string> = {};

  if (!fetcher) {
    fetcher = {
      fetch: async function (
        url: string,
        method: HTTP_METHOD = "GET",
        body?: Object,
        args?: FetcherArgs
      ) {
        const currentHeaders = { ...headers, ...args?.headers };

        const newHeaders = new Headers(currentHeaders);

        const response: Response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: newHeaders,
        });

        return response;
      },
      registerHeader: (key: string, value: string) => {
        headers[key] = value;
      },

      getHeaders: () => headers,

      clearHeaders: () => {
        headers = {};
      },
    };
  }

  return Object.freeze(fetcher);
};

export default getFetcher();
