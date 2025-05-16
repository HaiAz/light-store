
export const apiClient = {
  get: <TResponse>(url: string) =>
    request<TResponse>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }),
  post: <TResponse>(url: string, body: unknown) =>
    request<TResponse>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    }),
  postFormData: <TResponse>(url: string, form: FormData) =>
    request<TResponse>(url, {
      headers: {
        Accept: 'application/json',
      },
      method: 'POST',
      body: form,
    }),
  patch: <TBody extends BodyInit, TResponse>(url: string, body: TBody) =>
    request<TResponse>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body,
    }),
};

// TODO: handling error correctly
export async function request<TResponse>(
  url: string,
  config: RequestInit,
): Promise<TResponse> {
  try {
    const response = await fetch(url, config);
    if (response.status === 404) {
      throw new Error('Resource not found');
    } else if (response.status === 500) {
      throw new Error('Server error');
    } else if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as TResponse;
  } catch (error) {
    // Handle the error.
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      console.error('There was a SyntaxError', error);
    } else {
      console.error('There was an error', error);
    }
    throw error;
  }
}
