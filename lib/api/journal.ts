interface CreateJournalPayload {
  text: string;
}

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  return token;
};

// CREATE JOURNAL
export async function createJournal(data: CreateJournalPayload) {
  const res = await fetch("/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create journal");
  return res.json();
}

// GET ALL JOURNALS
export async function getJournals() {
  const res = await fetch("/api/journals", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch journals");
  return res.json();
}

// GET SINGLE JOURNAL
export async function getJournal(id: string) {
  const res = await fetch(`/api/journals/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch journal");
  return res.json();
}

// CONTINUE THERAPY
// lib/api/journals.ts

export async function continueJournal(journalId: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/journals/${journalId}/continue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}