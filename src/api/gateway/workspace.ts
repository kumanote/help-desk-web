import { API_BASE_URL } from '@/lib/constants'

export async function getWorkspace({ lang }: { lang: string }) {
  return await fetch(`${API_BASE_URL}/workspace`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
  })
}

export async function initWorkspace({
  lang,
  workspace_name,
  first_agent_email,
  first_agent_password,
  first_agent_name,
}: {
  lang: string
  workspace_name: string
  first_agent_email: string
  first_agent_password: string
  first_agent_name: string
}) {
  const data = {
    workspace_name,
    first_agent_email,
    first_agent_password,
    first_agent_name,
  }
  return await fetch(`${API_BASE_URL}/workspace`, {
    method: 'POST',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
