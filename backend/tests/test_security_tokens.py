import unittest

from jose import jwt

from app.core.config import settings
from app.core.security import create_access_token, decode_token


class SecurityTokenTests(unittest.TestCase):
    def test_access_token_includes_role_and_permissions_claims(self):
        token = create_access_token(
            42,
            role="admin",
            permissions=["dashboard", "billing", "settings"],
        )

        payload = decode_token(token)

        self.assertEqual(payload["sub"], "42")
        self.assertEqual(payload["role"], "admin")
        self.assertEqual(payload["permissions"], ["dashboard", "billing", "settings"])
        self.assertIn("exp", payload)
        self.assertIn("iat", payload)
        self.assertEqual(payload["type"], "access")


if __name__ == "__main__":
    unittest.main()
