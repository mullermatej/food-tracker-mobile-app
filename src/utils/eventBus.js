// Minimal event bus (in-memory) for cross-screen communication without navigation params
const listeners = {};

export const on = (event, handler) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(handler);
  return () => {
    listeners[event]?.delete(handler);
  };
};

export const emit = (event, payload) => {
  const set = listeners[event];
  if (!set) return;
  set.forEach((fn) => {
    try {
      fn(payload);
    } catch (e) {
      // swallow
      console.error(e);
    }
  });
};

export const off = (event, handler) => {
  listeners[event]?.delete(handler);
};
