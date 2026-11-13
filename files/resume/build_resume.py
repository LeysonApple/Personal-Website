"""Build files/Leyson-Resume.pdf from files/resume/resume.html.

Needs: pip install weasyprint pypdf pymupdf, plus the Noto Sans SC (思源黑体) font installed.
Run from the repo root:  python3 files/resume/build_resume.py
"""
from pathlib import Path

from weasyprint import HTML

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / 'Leyson-Resume.pdf'

HTML(filename=str(HERE / 'resume.html'), base_url=str(HERE)).write_pdf(str(OUT))
print('wrote', OUT.relative_to(HERE.parent.parent))

try:
    from pypdf import PdfReader
    r = PdfReader(str(OUT))
    text = r.pages[0].extract_text()
    print(f'pages: {len(r.pages)}  extractable chars: {len(text)}')
    assert len(r.pages) == 1, 'resume must stay on one page'
except ImportError:
    pass

try:
    import pymupdf
    doc = pymupdf.open(str(OUT))
    doc[0].get_pixmap(dpi=150).save(str(HERE / 'preview.png'))
    print('wrote files/resume/preview.png')
except ImportError:
    pass
