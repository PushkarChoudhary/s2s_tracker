const BASE = process.env.NEXT_PUBLIC_BACKEND;
export async function api(path){
  const res = await fetch(`${BASE}${path}`);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
