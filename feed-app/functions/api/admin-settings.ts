export const onRequestGet: PagesFunction<{ SETTINGS_KV: KVNamespace }> = async (context) => {
  try {
    const raw = await context.env.SETTINGS_KV.get('admin-settings');
    if (raw) {
      return new Response(raw, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
  } catch (err) {
    // allow fallback below
  }
  
  return new Response(JSON.stringify({
    activeFeed: 'A',
    feedName: '',
    timerMinutes: 5,
    showConditionA: true,
    showConditionB: true,
  }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};

export const onRequestPut: PagesFunction<{ SETTINGS_KV: KVNamespace }> = async (context) => {
  try {
    const body = await context.request.json();
    await context.env.SETTINGS_KV.put('admin-settings', JSON.stringify(body));
    return new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return new Response('Invalid request', { status: 400 });
  }
};
