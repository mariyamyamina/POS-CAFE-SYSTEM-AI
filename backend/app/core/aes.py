from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

KEY = b"12345678901234567890123456789012"

def decrypt_password(cipher_text: str, iv: str):
    iv_bytes = base64.b64decode(iv)

    cipher = AES.new(KEY, AES.MODE_CBC, iv_bytes)

    decrypted = unpad(
        cipher.decrypt(base64.b64decode(cipher_text)),
        AES.block_size
    )

    return decrypted.decode("utf-8")