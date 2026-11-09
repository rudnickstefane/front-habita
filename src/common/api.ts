export function getBackendOrigin() {
  const graphqlUrl = import.meta.env.VITE_APP_BACKEND_URL as string;
  return graphqlUrl.replace(/\/graphql\/?$/, "");
}

export function photoUrl(path: string) {
  if (path.startsWith("http")) {
    return path;
  }

  return `${getBackendOrigin()}${path}`;
}

export async function uploadFotos(files: File[], token: string) {
  const formData = new FormData();
  files.forEach((file) => formData.append("fotos", file));

  const response = await fetch(`${getBackendOrigin()}/uploads/fotos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(payload?.message)
      ? payload.message[0]
      : payload?.message;
    throw new Error(message || "Não foi possível enviar as fotos.");
  }

  const payload = (await response.json()) as { urls: string[] };
  return payload.urls;
}
