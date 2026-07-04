"""
Script para gerar os icones PWA em multiplos tamanhos.
Usa apenas a biblioteca padrao do Python (sem Pillow).
Gera PNGs simples com fundo rosa e um circulo branco central.
Execute: python generate_icons.py
"""
import struct
import zlib
import os

def create_png(width, height, rgba_func):
    """Cria um PNG a partir de uma funcao geradora de pixels RGBA."""
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter byte (none)
        for x in range(width):
            r, g, b, a = rgba_func(x, y, width, height)
            raw_data += struct.pack('BBBB', r, g, b, a)

    def make_chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack('>I', len(data)) + c + crc

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)

    compressed = zlib.compress(raw_data, 9)
    idat = make_chunk(b'IDAT', compressed)
    iend = make_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend


def icon_pixel(x, y, w, h):
    """Gera pixel do icone: fundo rosa com esmalte + brilhos em branco."""
    # Centro normalizado
    nx = x / w
    ny = y / h
    cx, cy = 0.5, 0.5

    # Background: gradiente rosa
    t = (nx + ny) / 2
    r = int(244 - t * 20)
    g = int(63 - t * 20)
    b = int(94 - t * 10)

    # Distancia do centro
    dx = nx - cx
    dy = ny - cy
    dist = (dx**2 + dy**2) ** 0.5

    # ---- Garrafa de esmalte ----
    # Corpo da garrafa (retangulo arredondado no centro inferior)
    body_w = 0.18
    body_h = 0.26
    body_cx = 0.5
    body_cy = 0.55

    in_body = (abs(nx - body_cx) < body_w/2 and
               abs(ny - body_cy) < body_h/2)

    # Gargalo (mais estreito, acima do corpo)
    neck_w = 0.08
    neck_h = 0.06
    neck_cy = body_cy - body_h/2 - neck_h/2
    in_neck = (abs(nx - body_cx) < neck_w/2 and
               abs(ny - neck_cy) < neck_h/2)

    # Tampa (quadrado no topo)
    cap_w = 0.10
    cap_h = 0.08
    cap_cy = neck_cy - neck_h/2 - cap_h/2
    in_cap = (abs(nx - body_cx) < cap_w/2 and
              abs(ny - cap_cy) < cap_h/2)

    if in_body or in_neck or in_cap:
        r, g, b = 255, 255, 255

    # ---- Sparkles (brilhos) ----
    sparkles = [(0.75, 0.22, 0.04), (0.28, 0.72, 0.025), (0.78, 0.68, 0.02)]
    for sx, sy, sr in sparkles:
        sdx = abs(nx - sx)
        sdy = abs(ny - sy)
        # Diamond/star shape
        if (sdx + sdy) < sr:
            r, g, b = 255, 255, 255

    # Circulo decorativo semi-transparente
    circle_cx, circle_cy, circle_r = 0.72, 0.28, 0.15
    cdx = nx - circle_cx
    cdy = ny - circle_cy
    cdist = (cdx**2 + cdy**2) ** 0.5
    if cdist < circle_r:
        # Semi-transparente
        r = min(255, r + 30)
        g = min(255, g + 30)
        b = min(255, b + 30)

    return (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)), 255)


# ---- Main ----
script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, "images", "icons")
os.makedirs(output_dir, exist_ok=True)

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    print(f"Gerando icon-{size}x{size}.png...")
    png_data = create_png(size, size, icon_pixel)
    path = os.path.join(output_dir, f"icon-{size}x{size}.png")
    with open(path, 'wb') as f:
        f.write(png_data)
    print(f"  OK -> {path}")

print("\nTodos os icones PWA foram gerados!")
