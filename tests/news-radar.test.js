const test = require('node:test');
const assert = require('node:assert/strict');
const {parse} = require('../lib/news-radar');
test('RSS notices and arbitrary thumbnails cannot bypass editorial image review', () => {
  const now=Date.parse('2026-09-14T12:00:00Z');
  const xml='<rss><item><title>Construction project</title><link>https://example.org/news</link><pubDate>Mon, 14 Sep 2026 10:00:00 GMT</pubDate><description><![CDATA[<img src="https://example.org/notice.jpg">]]></description></item></rss>';
  const items=parse(xml,{host:'example.org',name:'Source',specialist:true},now);
  assert.equal(items.length,1);
  assert.equal(items[0].image,'');
  assert.equal(items[0].url,'https://example.org/news');
});
