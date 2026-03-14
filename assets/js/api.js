const API_URL = "https://script.google.com/macros/s/AKfycbx9kRi1Q-opLtdkSbpEB2IKYcoewUW4GxtIdDBcuUmIFXmSyKryngCL4apfN86NMuZvQg/exec";

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}?action=getServices`);
    const data = await res.json();

    // Cache locally
    localStorage.setItem("cachedProducts", JSON.stringify(data.products));

    return data.products;
  } catch (err) {
    console.warn("Offline mode, using cached products");
    return JSON.parse(localStorage.getItem("cachedProducts")) || [];
  }
}

async function postPayment(carts, type, amountDue, cashReceived, changed) {
  try {
    const res = await fetch(`${API_URL}?action=${type}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({carts, amountDue, cashReceived, changed})
    });
    return await res.json();
  } catch (err) {
    // Queue offline
    let queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    queue.push({carts, type, amountDue, cashReceived, changed});
    localStorage.setItem("offlineQueue", JSON.stringify(queue));
    return {success: true, offline: true};
  }
}

// Sync offline payments when back online
window.addEventListener("online", async () => {
  let queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
  for (const payment of queue) {
    try {
      await fetch(`${API_URL}?action=${payment.type}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payment)
      });
    } catch {}
  }
  localStorage.removeItem("offlineQueue");
});
