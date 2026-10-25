"""One-off asset optimiser (idempotent). Run: python3 tools/optimize_assets.py
- JPGs: resize to a sensible max width, progressive, ~q80; writes a .webp twin.
- Logos: downscale oversized PNGs.
- Fonts: subset Bricolage (Latin, keep wght+opsz axes) and Silkscreen to woff2
  (only when the source .ttf files are present; the repo ships the woff2 only).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / 'assets/img'
FONTS = ROOT / 'assets/fonts'


def max_w(im):
    w, h = im.size
    if h > w * 1.4:      # tall phone / card screenshots
        return 760
    return 1600


def jpgs():
    for p in sorted(IMG.glob('*.jpg')):
        im = Image.open(p).convert('RGB')
        mw = max_w(im)
        if im.width <= mw and p.stat().st_size <= 200_000 and p.with_suffix('.webp').exists():
            continue  # already optimised; don't re-encode
        if im.width > mw:
            im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
        q = 82
        while True:
            im.save(p, 'JPEG', quality=q, optimize=True, progressive=True)
            if p.stat().st_size <= 200_000 or q <= 60:
                break
            q -= 4
        im.save(p.with_suffix('.webp'), 'WEBP', quality=min(q, 80), method=6)
        print(f'{p.name:28} {im.size} jpg {p.stat().st_size//1024}KB q{q}  webp {p.with_suffix(".webp").stat().st_size//1024}KB')


def logos():
    for p in sorted(IMG.glob('logo-*.png')):
        im = Image.open(p)
        if im.width > 192:
            im.thumbnail((192, 192), Image.LANCZOS)
            im.save(p, optimize=True)
        print(p.name, im.size, p.stat().st_size // 1024, 'KB')


def fonts():
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    from fontTools import subset
    src = FONTS / 'Bricolage.ttf'
    if src.exists():
        f = TTFont(src)
        f = instancer.instantiateVariableFont(f, {'wdth': 100})
        tmp = FONTS / '_b.ttf'; f.save(tmp)
        subset.main([str(tmp), '--unicodes=U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2010-2027,U+2030,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2212',
                     '--layout-features=*', '--flavor=woff2', f'--output-file={FONTS / "Bricolage.woff2"}'])
        tmp.unlink()
    for name in ['Silkscreen', 'SilkscreenBold']:
        s = FONTS / f'{name}.ttf'
        if s.exists():
            subset.main([str(s), '--unicodes=U+0020-007E,U+00A0-00FF,U+2010-2027,U+2190-2193', '--flavor=woff2', f'--output-file={FONTS / (name + ".woff2")}'])
    for p in sorted(FONTS.iterdir()):
        print(p.name, p.stat().st_size // 1024, 'KB')


if __name__ == '__main__':
    jpgs(); logos(); fonts()
