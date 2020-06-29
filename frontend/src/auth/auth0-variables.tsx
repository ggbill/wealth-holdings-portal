const url = process.env.PUBLIC_URL || "http://localhost:3000"

export const AUTH_CONFIG = {
  domain: 'wealth-holdings.eu.auth0.com',
  clientId: 'MPW5D9aCJxD3cQAuq6FlwKEHA06Rzxef',
  callbackUrl: `${url}/callback`,
  redirect_url: url
}
