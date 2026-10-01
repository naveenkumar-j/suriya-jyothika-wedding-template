import { wedding } from "../data/weddingData.js";

const LOCAL_KEY = "tn-rsvp-replies";

// `VITE_RSVP_ENDPOINT` lets the remote path be tested — and deployed — without
// editing the content file. An empty endpoint keeps replies in this browser.
const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT || wedding.rsvp.endpoint || "";

export const isRemote = Boolean(ENDPOINT);

function localRows() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(row) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...localRows(), row]));
  } catch {
    // Private mode / quota: the guest still sees their confirmation.
  }
  return row;
}

// With no Sheet there is nothing server-side to authenticate against, so the
// first passcode typed on this device becomes this browser's host key and every
// later read or clear has to match it.
function claimLocalKey(passcode) {
  const code = String(passcode || "").trim();
  if (!code) throw new Error("Enter the host passcode.");
  let saved = null;
  try {
    saved = localStorage.getItem(LOCAL_KEY + "-key");
    if (saved === null) localStorage.setItem(LOCAL_KEY + "-key", code);
  } catch {
    return;
  }
  if (saved && saved !== code) throw new Error("Wrong passcode.");
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error("Could not reach the guest list. Please try again.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.ok === false) {
    throw new Error(data?.error ?? "The guest list could not be read.");
  }
  return data;
}

function fromSheet(row) {
  const at = Date.parse(row.at);
  return {
    id: `${row.name}-${Number.isNaN(at) ? 0 : at}`,
    name: String(row.name ?? ""),
    contact: String(row.contact ?? ""),
    attendance: String(row.attendance ?? "").toLowerCase().startsWith("a") ? "accept" : "decline",
    guests: Number(row.guests) || 1,
    message: String(row.message ?? ""),
    at: Number.isNaN(at) ? new Date(0).toISOString() : new Date(at).toISOString(),
  };
}

export async function submitReply({ name, contact, attendance, guests, message }) {
  const reply = {
    name: name.trim(),
    contact: contact.trim(),
    attendance: attendance === "decline" ? "decline" : "accept",
    guests: Number(guests) || 1,
    message: message.trim(),
  };

  if (!ENDPOINT) {
    return saveLocal({ ...reply, id: `${Date.now()}`, at: new Date().toISOString() });
  }

  // Apps Script rejects a preflighted request, so the body travels as plain
  // text and the script parses the JSON itself.
  await request(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(reply),
  });
  return { ...reply, id: reply.contact, at: new Date().toISOString() };
}

export async function loadReplies(passcode = "") {
  if (!ENDPOINT) {
    claimLocalKey(passcode);
    return localRows();
  }
  const data = await request(`${ENDPOINT}?key=${encodeURIComponent(passcode)}`);
  return (data.rows ?? []).map(fromSheet);
}

export async function clearReplies(passcode = "") {
  if (!ENDPOINT) {
    claimLocalKey(passcode);
    try {
      localStorage.removeItem(LOCAL_KEY);
    } catch {
      /* nothing to clear */
    }
    return;
  }
  await request(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "clear", key: passcode }),
  });
}
