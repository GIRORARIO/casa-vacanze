const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://itbmqztqgqvrexdjqyme.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cgTt5_TJwEUNT4Ku8xJ-JA_hGpqIJxY';
const BOOKING_ICAL = 'https://ical.booking.com/v1/export?t=1d2c6c28-a639-47b8-81a1-b6340ad9fac1';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function fetchIcal(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseIcal(ical) {
  const events = [];
  const blocks = ical.split('BEGIN:VEVENT');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const get = key => {
      const match = block.match(new RegExp(key + ':([^\\r\\n]+)'));
      return match ? match[1].trim() : '';
    };
    const formatDate = str => {
      if (!str) return '';
      const d = str.replace(/[^0-9]/g, '').substring(0, 8);
      return `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
    };
    const summary = get('SUMMARY');
    if (summary.toLowerCase().includes('closed') || summary.toLowerCase().includes('chiuso')) continue;
    const checkIn = formatDate(get('DTSTART'));
    const checkOut = formatDate(get('DTEND'));
    const uid = get('UID');
    if (checkIn && checkOut && uid) {
      events.push({ uid, checkIn, checkOut, summary });
    }
  }
  return events;
}

exports.handler = async () => {
  try {
    const ical = await fetchIcal(BOOKING_ICAL);
    const events = parseIcal(ical);

    for (const event of events) {
      const { data: existing } = await sb
        .from('bookings')
        .select('id')
        .eq('ical_uid', event.uid)
        .single();

      if (!existing) {
        await sb.from('bookings').insert([{
          guest_name: event.summary || 'Ospite Booking',
          channel: 'booking',
          check_in: event.checkIn,
          check_out: event.checkOut,
          adults: 1,
          children: 0,
          nationality: '',
          status: 'confirmed',
          paid: false,
          total: 0,
          soggiorno: 0,
          cedolare: 0,
          platform_fee: 0,
          partner_cost: 0,
          notes: 'Importato da Booking.com',
          ical_uid: event.uid
        }]);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, imported: events.length })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
