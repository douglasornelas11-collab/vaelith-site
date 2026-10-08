// Calendar dates follow the Brazilian editorial day, including multi-day events.
function todayInBrazil(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(now);
}
function eventDates(event) {
  const valid = value => /^\d{4}-\d{2}-\d{2}/.test(String(value || '')) ? String(value).slice(0, 10) : '';
  const start = valid(event.startDate || event.date);
  const end = valid(event.endDate) || start;
  return {start, end: end < start ? start : end};
}
function eventStatus(event, today = todayInBrazil()) {
  const {start, end} = eventDates(event);
  if (!start) return 'Data a confirmar';
  if (end < today) return 'Encerrado';
  if (start <= today) return 'Em andamento';
  return 'Próximo evento';
}
function orderedEvents(events, today = todayInBrazil()) {
  const current = [], past = [], undated = [];
  for (const event of events) {
    const dates = eventDates(event);
    if (!dates.start) undated.push(event);
    else if (dates.end < today) past.push(event);
    else current.push(event);
  }
  current.sort((a,b) => eventDates(a).start.localeCompare(eventDates(b).start));
  past.sort((a,b) => eventDates(b).end.localeCompare(eventDates(a).end));
  return {current, past, undated, all: [...current, ...undated, ...past]};
}
module.exports = {todayInBrazil, eventDates, eventStatus, orderedEvents};
