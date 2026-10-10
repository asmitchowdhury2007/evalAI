import "dotenv/config";

const SECRET = process.env.CLERK_SECRET_KEY;
if (!SECRET) throw new Error("CLERK_SECRET_KEY missing in .env");

const BASE = "https://api.clerk.com/v1";
const headers = { Authorization: `Bearer ${SECRET}`, "Content-Type": "application/json" };
const EMAIL = "teacher+clerk_test@example.com";

async function api(path, method = "GET", body) {
  const res = await fetch(BASE + path, { method, headers, body: body && JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${JSON.stringify(data)}`);
  return data;
}

let users = await api(`/users?email_address=${encodeURIComponent(EMAIL)}`);
let user = users[0];
if (!user) {
  user = await api("/users", "POST", {
    email_address: [EMAIL],
    first_name: "Test",
    last_name: "Teacher",
    password: "Xk93-test-Pass-77!zq",
  });
}


const session = await api("/sessions", "POST", { user_id: user.id });
const { jwt } = await api(`/sessions/${session.id}/tokens`, "POST");

console.log(jwt);