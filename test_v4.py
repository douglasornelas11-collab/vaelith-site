from pathlib import Path
import json
from fastapi.testclient import TestClient
import server

root=Path(__file__).resolve().parent
client=TestClient(server.app)
checks=[]
def ok(name, cond, detail=''):
    checks.append({'name':name,'ok':bool(cond),'detail':detail})
    assert cond, f'{name}: {detail}'

r=client.get('/');ok('landing',r.status_code==200 and 'Compatibilize projetos' in r.text)
r=client.get('/login');ok('login page',r.status_code==200)
r=client.post('/api/auth/login',json={'email':'demo@vaelithlabs.com.br','password':'vaelith'});ok('login api',r.status_code==200,r.text)
r=client.get('/api/auth/me');ok('session cookie',r.status_code==200)
projects=client.get('/api/projects').json();ok('project list',len(projects)>=1)
pid=projects[0]['id']
# clean previous files for reruns
state=client.get(f'/api/projects/{pid}/state').json()
for f in state['files']: client.delete(f"/api/files/{f['id']}")
# upload samples individually so inference works
for p in sorted((root/'sample_files').iterdir()):
    with p.open('rb') as fh:
        rr=client.post(f'/api/projects/{pid}/files',files={'files':(p.name,fh,'application/octet-stream')},data={'discipline':'','revision':''})
    ok(f'upload {p.name}',rr.status_code==200,rr.text)
state=client.get(f'/api/projects/{pid}/state').json();ok('7 files stored',len(state['files'])==7,str(len(state['files'])))
processed=sum(f['status']=='Processado' for f in state['files']);ok('files processed',processed==7,str(processed))
# create change
rr=client.post(f'/api/projects/{pid}/changes',json={'code':'SM-TESTE','title':'Deslocamento da porta P-034','requestText':'Mover a porta P-034 para a parede lateral e remanejar o interruptor','element':'Porta P-034','location':'Sala de Reuniões 02','stage':'Execução em andamento','baseDeadline':'2026-09-30'})
ok('create change',rr.status_code==200,rr.text)
change_id=rr.json()['id']
rr=client.post(f'/api/projects/{pid}/analyze',json={'changeId':change_id});ok('run analysis',rr.status_code==200,rr.text)
a=rr.json();ok('IFC comparison',len(a['ifcComparisons'])>=1,str(a['ifcComparisons']))
ok('revision diff counts',a['ifcComparisons'][0]['counts']['modified']>=1 or a['ifcComparisons'][0]['counts']['added']>=1,str(a['ifcComparisons'][0]['counts']))
ok('budget detected',len(a['budget']['matches'])>=1,str(a['budget']))
ok('budget total numeric',a['budget']['total'] is not None,str(a['budget']['total']))
ok('schedule detected',len(a['schedule']['matches'])>=1,str(a['schedule']))
ok('3D ready',a['geometric']['status']=='ready',str(a['geometric']))
ok('trace available',len(a['trace'])==6)
for fmt,ctype in [('json','application/json'),('xlsx','spreadsheetml'),('docx','wordprocessingml'),('pdf','application/pdf')]:
    ex=client.get(f'/api/projects/{pid}/export/{fmt}')
    ok(f'export {fmt}',ex.status_code==200 and len(ex.content)>100,ex.headers.get('content-type',''))
(root/'TEST_RESULTS.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
print(f"{sum(c['ok'] for c in checks)}/{len(checks)} checks passed")
print(json.dumps({'budgetTotal':a['budget']['total'],'scheduleDays':a['schedule']['days'],'ifcComparisons':a['ifcComparisons'],'issues':len(a['issues'])},ensure_ascii=False,indent=2))
