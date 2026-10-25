"""Sample the two Picto characters from assets/img/picto-after.jpg into pixel grids.

Each art pixel in the screenshot is a uniform ~16px block on a shared grid (x origin 196,
14 columns spanning 196-421). For every cell we take the median colour of its inner area,
drop cells connected to the border that look like the striped background, keep the largest
connected component (removes UI chrome), then cluster colours into a small palette.
Run:  python3 tools/extract_picto_sprites.py   -> prints CAT/DOG grids + palettes for page_picto.py
"""
from PIL import Image
import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img', 'picto-after.jpg')
COLS, ROWS, X0, S = 14, 17, 196, (421 - 196) / 14
SPRITES = {  # name: (y origin, background test)
    'CAT': (51, lambda c: min(c) > 200),            # cream striped bg
    'DOG': (521, lambda c: c[2] > c[0]),             # light-blue striped bg
}


def median(px):
    return tuple(sorted(p[i] for p in px)[len(px) // 2] for i in range(3))


def cells(im, y0):
    g = []
    for r in range(ROWS):
        row = []
        for c in range(COLS):
            xa, ya = round(X0 + c * S), round(y0 + r * S)
            px = [im.getpixel((x, y)) for y in range(ya + 4, ya + int(S) - 4) for x in range(xa + 4, xa + int(S) - 4)]
            row.append(median(px))
        g.append(row)
    return g


def extract(im, y0, is_bg):
    g = cells(im, y0)
    bg = [[False] * COLS for _ in range(ROWS)]
    stack = [(r, c) for r in range(ROWS) for c in range(COLS) if r in (0, ROWS - 1) or c in (0, COLS - 1)]
    while stack:  # flood fill background from the border
        r, c = stack.pop()
        if 0 <= r < ROWS and 0 <= c < COLS and not bg[r][c] and is_bg(g[r][c]):
            bg[r][c] = True
            stack += [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]
    seen, comps = set(), []
    for r in range(ROWS):
        for c in range(COLS):
            if bg[r][c] or (r, c) in seen:
                continue
            comp, st = [], [(r, c)]
            seen.add((r, c))
            while st:
                a, b = st.pop(); comp.append((a, b))
                for da in (-1, 0, 1):
                    for db in (-1, 0, 1):
                        n = (a + da, b + db)
                        if 0 <= n[0] < ROWS and 0 <= n[1] < COLS and n not in seen and not bg[n[0]][n[1]]:
                            seen.add(n); st.append(n)
            comps.append(comp)
    keep = set(max(comps, key=len))
    clusters = []  # [sum_r, sum_g, sum_b, n]
    lab = {}
    for (r, c) in sorted(keep):
        col = g[r][c]
        for i, k in enumerate(clusters):
            m = [k[j] / k[3] for j in range(3)]
            if sum(abs(m[j] - col[j]) for j in range(3)) < 45:
                for j in range(3): k[j] += col[j]
                k[3] += 1; lab[(r, c)] = i; break
        else:
            clusters.append([*col, 1]); lab[(r, c)] = len(clusters) - 1
    letters = 'abcdefghijklmnopqrstuvwxyz'
    pal = {letters[i]: '#%02X%02X%02X' % tuple(round(k[j] / k[3]) for j in range(3)) for i, k in enumerate(clusters)}
    rows = [''.join(letters[lab[(r, c)]] if (r, c) in keep else '.' for c in range(COLS)) for r in range(ROWS)]
    return rows, pal


if __name__ == '__main__':
    im = Image.open(SRC).convert('RGB')
    for name, (y0, is_bg) in SPRITES.items():
        rows, pal = extract(im, y0, is_bg)
        print(f'{name} = [\n' + ''.join(f"    '{r}',\n" for r in rows) + ']')
        print(f'{name}_PAL = {pal!r}\n')
