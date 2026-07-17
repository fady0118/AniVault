export async function queryAniList(query, variables) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables })
  })

  const json = await res.json()

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.message || res.statusText || "GraphQL request failed"
    const error = new Error(message)
    error.status = res.status
    error.body = json
    throw error
  }

  if (json.errors) {
    const message = json.errors
      .map((e) => (typeof e === "string" ? e : e.message || "Unknown GraphQL error"))
      .join("; ")
    const error = new Error(message)
    error.status = json.errors[0]?.status || 400
    error.body = json
    throw error
  }

  return json.data
}
