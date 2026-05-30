import { delay } from "./utils";

let SFW_value = null;

export function setSFWValue(val) {
  SFW_value = val;
}

const requestQueue = [];
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 1;
const QUEUE_DELAY_MS = 300;

function processQueue() {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    return;
  }

  const queued = requestQueue.shift();
  if (!queued) return;

  activeRequests += 1;
  Promise.resolve(queued.request())
    .then(queued.resolve)
    .catch(queued.reject)
    .finally(async () => {
      activeRequests -= 1;
      await delay(QUEUE_DELAY_MS);
      processQueue();
    });
}

function enqueue(request) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ request, resolve, reject });
    processQueue();
  });
}

async function executeFetch(input, init, retries = 2) {
  const timeoutSignal = AbortSignal.timeout(5000);
  const res = await fetch(input, { ...init, signal: timeoutSignal });
  if (res.status === 429 && retries > 0) {
    const retryAfter = parseInt(res.headers.get("Retry-After") || "0", 10);
    const waitMs = retryAfter > 0 ? retryAfter * 1000 : 1000;
    await delay(waitMs);
    return executeFetch(input, init, retries - 1);
  }
  return res;
}

export function jikanFetch(input, init) {
  let url = input;
  if (SFW_value && url.includes("?")) {
    if(url.includes('genres_exclude=')){
      url = url.split("genres_exclude=").join("genres_exclude=9,12,49&");
    } else {
      url = url.split("?").join("?genres_exclude=9,12,49&sfw&");
    }
  }
  return enqueue(() => executeFetch(url, init, 2));
}
