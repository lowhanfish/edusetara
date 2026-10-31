"""Refresh public school references from Kemendikdasmen; no student data."""
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from html import unescape
from pathlib import Path
from urllib.request import urlopen
import json
import re

BASE = 'https://referensi.data.kemendikdasmen.go.id'
SOURCE = BASE + '/pendidikan/dikdas/200500/2'

def fetch(url):
    with urlopen(url, timeout=30) as response:
        return response.read().decode('utf-8')

def clean(value):
    return ' '.join(unescape(re.sub('<[^>]+>', '', value)).split())

def read_district(item):
    url, district = item
    html = fetch(url)
    records = []
    for row in re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.S):
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)
        if len(cells) != 6:
            continue
        _, npsn, name, address, village, status = map(clean, cells)
        if not re.fullmatch(r'\d{8}', npsn):
            continue
        # The source groups SD and SMP; keep only explicitly named school forms.
        level = 'SD' if name.startswith('SD') else 'SMP' if name.startswith('SMP') else None
        if not level:
            continue
        records.append(dict(npsn=npsn, name=name, address=address, village=village,
                            district=district, level=level, status=status,
                            url=BASE + '/pendidikan/npsn/' + npsn))
    if not records:
        raise ValueError('No schools parsed for ' + district)
    return records

if __name__ == '__main__':
    html = fetch(SOURCE)
    districts = [(url, clean(label)) for url, label in re.findall(
        r'<a href="(https://referensi\.data\.kemendikdasmen\.go\.id/pendidikan/dikdas/\d+/3)">(.*?)</a>', html, re.S)]
    if len(districts) != 25:
        raise ValueError('Expected 25 district source links')
    with ThreadPoolExecutor(max_workers=4) as pool:
        groups = list(pool.map(read_district, districts))
    schools = sorted([s for group in groups for s in group], key=lambda s: (s['district'], s['name']))
    if len({s['npsn'] for s in schools}) != len(schools):
        raise ValueError('Duplicate NPSN in directory')
    target = Path(__file__).resolve().parents[1] / 'app/layanan-publik/cari-sekolah/schools.json'
    target.write_text(json.dumps(dict(source=SOURCE, updatedAt=date.today().isoformat(), schools=schools), ensure_ascii=False, indent=2) + '\n')
    print(f'Saved {len(schools)} SD/SMP records from {len(districts)} districts')
