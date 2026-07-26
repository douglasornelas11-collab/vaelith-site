from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import re, json

ROOT=Path(__file__).resolve().parent
class P(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.tags=[]
    def handle_starttag(self,tag,attrs):
        self.tags.append(tag)
        d=dict(attrs)
        if d.get('id'): self.ids.append(d['id'])
        for k in ('href','src'):
            v=d.get(k)
            if v and v.startswith('/') and not v.startswith('//'):
                self.refs.append(v.split('?',1)[0].split('#',1)[0])
checks=[]
def add(name,ok,detail=''): checks.append({'name':name,'ok':bool(ok),'detail':detail})
for filename in ['index.html','login.html','app.html']:
    text=(ROOT/filename).read_text(encoding='utf-8')
    p=P(); p.feed(text)
    dup=[x for x,n in Counter(p.ids).items() if n>1]
    add(f'{filename}: HTML parse', True, f'{len(p.tags)} tags')
    add(f'{filename}: IDs únicos', not dup, ', '.join(dup))
    missing=[]
    for ref in p.refs:
        if ref in ('/','/login','/app'): continue
        local=ROOT/ref.lstrip('/')
        if not local.exists(): missing.append(ref)
    add(f'{filename}: recursos locais', not missing, ', '.join(missing))
add('Marca definida', 'VAELITH LABS' in (ROOT/'index.html').read_text() and 'Soluções em Engenharia' in (ROOT/'index.html').read_text())
add('Proposta clara', 'Compatibilize projetos, custos e prazos' in (ROOT/'index.html').read_text())
add('Login real', 'loginForm' in (ROOT/'login.html').read_text())
app=(ROOT/'app.html').read_text()
for label,token in [('Upload','fileInput'),('Mudança','changeForm'),('Análise','runAnalysisBtn'),('Maquete 3D','viewerCanvas'),('Revisões','revisionMatrix'),('Relatório','reportSheet')]: add(f'Módulo {label}',token in app)
css=(ROOT/'assets/styles.css').read_text()
add('CSS balanceado',css.count('{')==css.count('}'),f"{css.count('{')} / {css.count('}')}")
add('Responsividade',len(re.findall(r'@media',css))>=2,str(len(re.findall(r'@media',css))))
result={'passed':sum(x['ok'] for x in checks),'total':len(checks),'checks':checks}
(ROOT/'STATIC_AUDIT.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(f"{result['passed']}/{result['total']} static checks passed")
for c in checks:
    print(('OK' if c['ok'] else 'FAIL'),c['name'],c['detail'])
if result['passed']!=result['total']: raise SystemExit(1)
