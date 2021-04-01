endpoints:

- /authuser/register = ({
  username: String,
  name: String,
  email: String,
  password: String,
  passwordCheck: String,
  }) => isValid(boolean), Access Token, Refresh Token, errors

- /authuser/login = (
  username,
  password,
  ) => isValid(boolean), Access Token, Refresh Token, errors

- /token_refresh/ (
  \*cookie = jid
  ) => refreshes access token

TO-DO:
[] projects endpoints

- [] get all for team
- [] get all for user
- [] get one
- [] end date - frontend

[] assignments endpoints

- [] get all for project
- [] get all for user
- [] get one
- [] end date - frontend
