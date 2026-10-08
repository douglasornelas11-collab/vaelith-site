const test = require('node:test');
const assert = require('node:assert/strict');
const {orderedEvents, eventStatus, todayInBrazil} = require('../lib/events');
const content = require('../lib/content');
const home = require('../lib/render-home');
const pages = require('../lib/render-pages');
const {shell} = require('../lib/layout');
test('agenda prioritizes upcoming events and retains past events newest first',()=>{
 const events=[{date:'2026-09-01',slug:'old'},{date:'2026-11-01',slug:'next'},{date:'2026-10-01',slug:'recent'},{date:'2026-10-07',endDate:'2026-10-09',slug:'ongoing'}];
 const sorted=orderedEvents(events,'2026-10-08');
 assert.deepEqual(sorted.current.map(x=>x.slug),['ongoing','next']);
 assert.deepEqual(sorted.past.map(x=>x.slug),['recent','old']);
 assert.equal(eventStatus(events[3],'2026-10-08'),'Em andamento');
 assert.equal(eventStatus(events[2],'2026-10-08'),'Encerrado');
 assert.equal(eventStatus({date:'2026-10-08'},'2026-10-08'),'Em andamento');
 assert.equal(eventStatus({},'2026-10-08'),'Data a confirmar');
});
test('event day follows Sao Paulo rather than UTC near midnight',()=>{
 assert.equal(todayInBrazil(new Date('2026-10-08T01:00:00Z')),'2026-10-07');
});
test('home excludes past events while agenda and details label them',()=>{
 const original=content.events;
 content.events=[{slug:'past-test',title:'Past event',date:'2000-01-01',dateDisplay:'01 jan 2000'},{slug:'future-test',title:'Future event',date:'2099-01-01',dateDisplay:'01 jan 2099'}];
 try {
  assert.doesNotMatch(home(),/eventos\/past-test/);
  assert.match(home(),/eventos\/future-test/);
  const agenda=pages.events();
  assert.ok(agenda.indexOf('href="/eventos/future-test"')<agenda.indexOf('href="/eventos/past-test"'));
  assert.match(agenda,/Encerrado/);
  assert.match(pages.events('past-test'),/Encerrado/);
  content.events=[];
  assert.match(home(),/Nenhum próximo evento confirmado/);
 } finally { content.events=original; }
});
test('mobile navigation contains directly reachable search, archive and about links',()=>{
 const nav=shell({}).split('<nav class="navbar"')[1].split('</nav>')[0];
 for(const path of ['buscar','arquivo','sobre']) assert.ok(nav.includes(`class="mobile-utility" href="/${path}"`));
});
