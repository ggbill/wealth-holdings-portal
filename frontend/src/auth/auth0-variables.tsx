const url = process.env.PUBLIC_URL || "http://localhost:8080"

export const AUTH_CONFIG = {
  domain: 'going-gone.eu.auth0.com',
  clientId: '3F4xNRjs00Q75dqR4NisVZ5PztJRV0kK',
  callbackUrl: `${url}/callback`,
  redirect_url: url
}
