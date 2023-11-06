export const api_call_get = async (path: string) => {
  const handle_start = async () => {
    const res = await fetch(path, { method: 'GET' });
    const data = await res.json();
    return data.id;
  };
  const handle_inquiry = async (executionId: string) => {
    const res = await fetch(`/api/${executionId}`, { method: 'GET' });
    const data = await res.json();
    console.log(data);
    return data;
  };
  const id = await handle_start();
  let interval_id: NodeJS.Timer;
  return new Promise((resolve, reject) => {
    interval_id = setInterval(async () => {
      console.log(path);
      const data = await handle_inquiry(id);
      if (data != null) {
        if (data.res.state === 'succeed') {
          resolve(data.res.result);
          clearInterval(interval_id);
        } else if (data.res.state === 'failed') {
          console.log(data.res.result.cause.message);
          clearInterval(interval_id);
          reject(new Error(data.res.result.cause.message));
        }
      }
    }, 5000);
  });
};

export const api_call_post = async (path: string, body: string) => {
  const handle_start = async () => {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    const data = await res.json();
    return data.id;
  };
  const handle_inquiry = async (executionId: string) => {
    const res = await fetch(`/api/${executionId}`, { method: 'GET' });
    const data = await res.json();
    console.log(data);
    return data;
  };
  const id = await handle_start();
  let interval_id: NodeJS.Timer;
  return new Promise((resolve, reject) => {
    interval_id = setInterval(async () => {
      console.log(path);
      const data = await handle_inquiry(id);
      if (data != null) {
        if (data.res.state === 'succeed') {
          resolve(data.res.result);
          clearInterval(interval_id);
        } else if (data.res.state === 'failed') {
          console.log(data.res.result.cause.message);
          clearInterval(interval_id);
          reject(new Error(data.res.result.cause.message));
        }
      }
    }, 5000);
  });
};

export const api_call_post_formdata = async (path: string, body: FormData) => {
  const handle_start = async () => {
    const res = await fetch(path, {
      method: 'POST',
      body,
    });
    const data = await res.json();
    return data.id;
  };
  const handle_inquiry = async (executionId: string) => {
    const res = await fetch(`/api/${executionId}`, { method: 'GET' });
    const data = await res.json();
    console.log(data);
    return data;
  };
  const id = await handle_start();
  let interval_id: NodeJS.Timer;
  return new Promise((resolve, reject) => {
    interval_id = setInterval(async () => {
      console.log(path);
      const data = await handle_inquiry(id);
      if (data != null) {
        if (data.res.state === 'succeed') {
          resolve(data.res.result);
          clearInterval(interval_id);
        } else if (data.res.state === 'failed') {
          console.log(data.res.result.cause.message);
          clearInterval(interval_id);
          reject(new Error(data.res.result.cause.message));
        }
      }
    }, 5000);
  });
};
