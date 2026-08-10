const MAX_CONCURRENT_PROVIDER_REQUESTS = 12;
let activeProviderRequests = 0;

export async function withProviderGuard<T>(operation: () => Promise<T>): Promise<T> {
  if (activeProviderRequests >= MAX_CONCURRENT_PROVIDER_REQUESTS) {
    throw new Error('PROVIDER_BUSY');
  }
  activeProviderRequests += 1;
  try {
    return await operation();
  } finally {
    activeProviderRequests -= 1;
  }
}
