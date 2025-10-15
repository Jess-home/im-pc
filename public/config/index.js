const config = {
  gatawayUrl: "https://im.shop110.top",
  photoUrl: "https://im.shop110.top",
  chatUrl: "https://im.shop110.top/static/chat/",
  wsUrl: "wss://im.shop110.top/wss/",
};

if (typeof window !== "undefined" && window.document) {
  window.__gconf = config;
} else {
  module.exports = config;
}
