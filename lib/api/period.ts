interface PeriodEntry {
  startDate?: Date;
  endDate?: Date;
  flow?: string;
  date?: Date;
}

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  return token;
}

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export async function startPeriod(startDate: Date, flow: string) {
  const res = await fetch("/api/period/start", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ startDate, flow }),
  });
  return res.json();
}

export async function logFlowDay(date: Date, flow: string) {
  const res = await fetch("/api/period/log-day", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ date, flow }),
  });
  return res.json();
}

export async function endPeriod(endDate: Date) {
  const res = await fetch("/api/period/end", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ endDate }),
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch("/api/period/history", {
    headers: headers(),
  });
  return res.json();
}

export async function getPrediction() {
  const res = await fetch("/api/period/prediction", {
    headers: headers(),
  });
  return res.json();
}