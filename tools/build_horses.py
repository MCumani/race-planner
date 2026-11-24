"""Turn the CRHorses sheet (Loc., Name, ID, BM) into data/horses.csv.

Usage: python3 tools/build_horses.py CRHorses.tsv   (tab-separated copy of the sheet)

Rules
- Unnamed horses ("xDam", "x Dam": lowercase x then a capital) are left out.
- Name: the bracketed dam/sire at the end is removed and kept as Breeding:
  "(Dundeel x La Dolce Diva)" stays as is; "(xSweet Magnolia)" (dam only) becomes "x Sweet Magnolia".
- Sex and age come from the ID, e.g. "(b,g 54/2)": g = gelding, last digit 2 = born 2022.
  Racing age = season year (rolls over 1 August) minus birth year.
- Rating: a number in BM; blank, "-" or text (e.g. "BD") = maiden.
- In Work: Loc. is a number 1-42.
"""
import csv, re, sys, datetime
today = datetime.date.today()
season = today.year if today.month >= 8 else today.year - 1
out, skipped = [], []
for line in open(sys.argv[1], encoding='utf-8-sig'):
    loc, name, idc, bm = [c.strip() for c in (line.rstrip('\n').split('\t') + [''] * 4)[:4]]
    if not name or name in ('Name',) or re.match(r'^x\s?[A-Z]', name):
        continue
    nm = re.sub(r'\s+', ' ', re.sub(r'\s*\([^)]*\)\s*$', '', name)).strip()
    pb = re.search(r'\(([^)]*)\)\s*$', name)
    ped = re.sub(r'\s+', ' ', pb.group(1)).strip() if pb else ''
    ped = re.sub(r'^x\s?(?=[A-Z])', 'x ', ped)
    m = re.search(r'\(\s*[a-z]+\s*,\s*([cgfmh])\b\s*,?\s*\d*\s*/\s*(\d)', idc, re.I)
    if not m:
        skipped.append(nm); continue
    age = (season - int(m.group(2))) % 10
    if age < 2: age += 10
    sx = m.group(1).lower()
    sex = {'c': 'Colt' if age <= 3 else 'Horse', 'h': 'Horse', 'g': 'Gelding',
           'f': 'Filly' if age <= 3 else 'Mare', 'm': 'Mare'}[sx]
    rating = bm if re.fullmatch(r'\d{1,3}', bm) else ''
    inwork = 'Yes' if re.fullmatch(r'\d+', loc) and 1 <= int(loc) <= 42 else 'No'
    out.append([nm, age, sex, rating, inwork, ped])
with open('data/horses.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Name', 'Age', 'Sex', 'Rating', 'In Work', 'Breeding']); w.writerows(out)
print(len(out), 'horses written; skipped (no ID):', skipped)
