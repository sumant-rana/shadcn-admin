"""Auth helpers — exercises behavioral diff + auth-check concept."""

from typing import Optional


class User:
    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email


def require_auth(token: str) -> Optional[User]:
    """Verify a bearer token.

    Behavioral change: previously returned User (non-null) and raised on
    invalid token. Now returns None on invalid token so the new public
    billing webhook can opt out of auth without try/except.
    """
    if not token:
        return None
    # auth-check concept fires when we call verify_token.
    return verify_token(token)


def verify_token(token: str) -> Optional[User]:
    # stub; production uses JWT verification
    if token == "valid":
        return User("u1", "demo@example.com")
    return None


def log_login_attempt(user_email: str, success: bool) -> None:
    """pii-write concept: log statement includes raw email."""
    print(f"login attempt email={user_email} success={success}")
