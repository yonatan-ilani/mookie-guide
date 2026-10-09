#!/usr/bin/env python3
"""Encrypt a guide's secrets (Wi-Fi, door codes, photos) into <guide>/secrets.enc.

The repo only ever holds the encrypted file. The key travels in the link's #fragment,
which browsers never send to the server, and the page decrypts it locally (AES-256-GCM).

Input: a private JSON file kept OUTSIDE the repo, e.g.
  {
    "items":  [{"icon": "📶", "label": "Wi-Fi", "value": "MyNetwork"},
               {"icon": "🔑", "label": "סיסמה", "value": "hunter2", "copy": true}],
    "images": [{"caption": "איפה המפתחות", "path": "/path/to/keys.jpg"}]
  }

Usage:
  scripts/encrypt-secrets.py home ~/private/home-secrets.json            # new key
  scripts/encrypt-secrets.py home ~/private/home-secrets.json --key KEY  # keep old links working
Prints the link to share. A new key means every old link stops showing the secrets.
"""
import argparse, base64, io, json, os, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from PIL import Image

SITE = "https://yonatan-ilani.github.io/mookie-guide"

def b64u(b): return base64.urlsafe_b64encode(b).rstrip(b"=").decode()
def unb64u(s): return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

def image_data_url(path):
    im = Image.open(path)
    im = im.convert("RGB")
    im.thumbnail((1600, 1600))
    clean = Image.frombytes(im.mode, im.size, im.tobytes())  # drops EXIF/GPS
    buf = io.BytesIO(); clean.save(buf, "JPEG", quality=82)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("guide"); ap.add_argument("secrets_json"); ap.add_argument("--key")
    a = ap.parse_args()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.abspath(a.secrets_json)
    if src.startswith(root + os.sep):
        sys.exit("keep the secrets JSON outside the repo")
    data = json.load(open(src))
    payload = {"items": data.get("items", []),
               "images": [{"caption": i.get("caption", ""), "src": image_data_url(i["path"])}
                          for i in data.get("images", [])]}
    key = unb64u(a.key) if a.key else AESGCM.generate_key(bit_length=256)
    if len(key) != 32: sys.exit("key must be 32 bytes (base64url)")
    nonce = os.urandom(12)
    ct = AESGCM(key).encrypt(nonce, json.dumps(payload, ensure_ascii=False).encode(), None)
    out = os.path.join(root, a.guide, "secrets.enc")
    open(out, "w").write(base64.b64encode(nonce + ct).decode() + "\n")
    print(f"wrote {os.path.relpath(out, root)}")
    print(f"link: {SITE}/{a.guide}/#k={b64u(key)}")

if __name__ == "__main__":
    main()
