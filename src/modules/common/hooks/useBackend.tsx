import { storage } from "@sr/common/storage";
import { GraphQLClient, RequestDocument, Variables } from "graphql-request";
import { useMemo } from "react";

const defaultEndpoint = import.meta.env.VITE_APP_BACKEND_URL;

export function useBackend(accessToken?: string | null) {
  const token = storage.get<string>("token") || accessToken;

  return useMemo(() => {
    const client = new GraphQLClient(defaultEndpoint, {
      credentials: "include",
      headers: {
        ...(token && { authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    });

    return {
      request: <T,>(
        query: RequestDocument,
        variables?: Variables,
        signal?: AbortSignal,
      ): Promise<T> =>
        client.request<T>({ document: query, variables, signal }),
    };
  }, [token]);
}
