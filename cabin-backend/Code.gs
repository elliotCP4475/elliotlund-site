/**
 * The Lund Cabin guest site: backend.
 * One Google Sheet holds every list. Photos go to a Drive folder.
 * Run setup() once, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone).
 */

const TABS = {
  Groceries:   ['id', 'text', 'note', 'checked', 'added', 'cleared_at'],
  Maintenance: ['id', 'what', 'where', 'urg', 'note', 'photo', 'added', 'cleared_at'],
  Inventory:   ['id', 'item', 'where', 'cat', 'common', 's', 'cleared_at'],
  Checkout:    ['id', 'text', 'checked', 'order'],
  Pantry:      ['key', 'place', 'label', 'src', 'at'],
  Amenities:   ['id', 'item', 'place', 'note', 'order'],
  Bring:       ['id', 'item', 'note', 'order'],
};
const LIST_TAB = { groceries: 'Groceries', maintenance: 'Maintenance', inventory: 'Inventory', checkout: 'Checkout', amenities: 'Amenities', bring: 'Bring' };
// Only the owners can change these. Their passcode lives in Project Settings > Script properties as EDIT_KEY.
const OWNER_LISTS = ['amenities', 'bring'];
// Starting rows, written once when a tab is first created. Edit them on the site or right in the Sheet.
const SEED = {
  Amenities: [
    ['WiFi', 'both', 'Same network in both'],
    ['Full kitchen', 'both', ''],
    ['Pots, pans, utensils and serving stuff', 'cabin', 'Plus mugs, a coffee grinder and a knife set'],
    ['Dishwasher', 'cabin', ''],
    ['Sheets and pillowcases', 'both', ''],
    ['Towels', 'both', ''],
    ['Wood stove and gas fireplace', 'cabin', ''],
    ['Firewood and kindling', 'cabin', 'Big stack on the east side of the cabin'],
    ['Board games, cards and cribbage', 'cabin', ''],
    ['Yard games and Jarts', 'cabin', 'Cabin garage'],
    ['Fish cleaning station and chest freezer', 'both', 'Back room of the detached garage'],
    ['First aid kit', 'both', ''],
    ['Fire extinguisher', 'cabin', 'Floor by the kitchen cabinets, wood stove side'],
  ],
  Bring: [
    ['Groceries', 'Check the pantry photos first'],
    ['Boots', 'For the peninsula until the boardwalk is done'],
    ['Blaze orange', 'During deer season'],
    ['Lac du Flambeau fishing license', "If you're fishing. Sold at Lac du Flambeau Campground & Marina"],
  ],
};
const BOOL = ['checked', 'common'];
const KEEP_DAYS = 30;
const SITE = 'https://elliotlund.com/cabin/';

/* ---------- One-time setup ---------- */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss;
  const id = props.getProperty('SHEET_ID');
  if (id) ss = SpreadsheetApp.openById(id);
  else { ss = SpreadsheetApp.create('Lund Cabin Guest Site'); props.setProperty('SHEET_ID', ss.getId()); }

  const oldPantry = ss.getSheetByName('Pantry');
  if (oldPantry && oldPantry.getLastRow() > 0 && oldPantry.getRange(1, 2).getValue() !== 'place') oldPantry.clear();

  Object.keys(TABS).forEach(name => sheet_(name, ss));
  const blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1) ss.deleteSheet(blank);

  const co = ss.getSheetByName('Checkout');
  if (co.getLastRow() === 1) {
    ['Strip the beds, sheets in the washer', 'Run the dishwasher', 'Open food out of the fridge',
     'Trash to the garage bin', 'Thermostat to ___°F', 'Windows shut, doors locked, garage closed']
      .forEach((t, i) => co.appendRow([uid_(), t, false, i + 1]));
  }
  const pa = ss.getSheetByName('Pantry');
  if (pa.getLastRow() === 1) {
    [['cabin_fridge', 'Cabin', 'Fridge'], ['cabin_freezer', 'Cabin', 'Freezer'], ['cabin_spice', 'Cabin', 'Spices'],
     ['bunk_fridge', 'Bunkhouse', 'Fridge'], ['bunk_freezer', 'Bunkhouse', 'Freezer'], ['bunk_spice', 'Bunkhouse', 'Spices']]
      .forEach(([k, pl, l]) => pa.appendRow([k, pl, l, '', '']));
  }
  if (!props.getProperty('FOLDER_ID')) {
    props.setProperty('FOLDER_ID', DriveApp.createFolder('Lund Cabin Photos').getId());
  }
  Logger.log('Sheet: ' + ss.getUrl());
}

/* Run this once from the editor to approve email and get a test message. */
function testNotify() {
  notify_('Test from the cabin site', 'Notifications are working. You will get an email when a guest reports something broken, marks a garage supply low or missing, or finishes the checkout list.');
}

/* ---------- Web app ---------- */
function doGet() {
  return json_(state_());
}

function doPost(e) {
  const req = JSON.parse(e.postData.contents || '{}');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const out = handle_(req);
    return json_(Object.assign({ ok: true }, out || {}));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function handle_(r) {
  const now = Date.now();
  if (r.op === 'signin' || OWNER_LISTS.indexOf(r.list) >= 0) owner_(r.key);
  switch (r.op) {
    case 'signin':
      return {};
    case 'remove': {
      if (OWNER_LISTS.indexOf(r.list) < 0) throw new Error('Not allowed');
      const sh = tab_(r.list), ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
      for (let i = ids.length - 1; i >= 1; i--) if (String(ids[i][0]) === String(r.id)) sh.deleteRow(i + 1);
      return {};
    }
    case 'add': {
      const sh = tab_(r.list), cols = TABS[sh.getName()];
      const item = Object.assign({}, r.item, { added: now, cleared_at: '' });
      sh.appendRow(cols.map(c => item[c] === undefined ? '' : item[c]));
      if (r.list === 'maintenance') {
        notify_('Something broke: ' + (item.what || 'new report'),
          [item.what, item.where ? 'Where: ' + item.where : '', item.urg ? 'Urgency: ' + item.urg : '',
           item.note ? 'Note: ' + item.note : '', item.photo ? 'Photo: ' + item.photo : ''].filter(String).join('\n'));
      }
      return {};
    }
    case 'update':
      if (r.list === 'inventory' && r.fields && (r.fields.s === 'low' || r.fields.s === 'missing')) {
        const row = findRow_('inventory', r.id);
        if (row) notify_(row.item + ' is ' + (r.fields.s === 'low' ? 'running low' : 'missing'),
          row.item + (row.where ? ' (' + row.where + ')' : '') + ' was marked ' + r.fields.s + ' in the garage list.');
      }
      setFields_(r.list, r.id, r.fields);
      return {};
    case 'clear':
      (r.ids || []).forEach(id => setFields_(r.list, id, { cleared_at: now }));
      return {};
    case 'restore':
      (r.ids || []).forEach(id => setFields_(r.list, id, r.list === 'groceries' ? { cleared_at: '', checked: false } : { cleared_at: '' }));
      return {};
    case 'checkoutSet': {
      const before = rows_('Checkout');
      const wasDone = before.length > 0 && before.every(x => x.checked);
      (r.items || []).forEach(x => setFields_('checkout', x.id, { checked: !!x.checked }));
      const after = rows_('Checkout');
      if (!wasDone && after.length > 0 && after.every(x => x.checked)) {
        notify_('Guests finished the checkout list', after.map(x => '✓ ' + x.text).join('\n'));
      }
      return {};
    }
    case 'photo': {
      const src = savePhoto_(r.dataUrl, (r.key || 'photo') + '-' + Utilities.formatDate(new Date(), 'America/Chicago', 'yyyy-MM-dd-HHmm'));
      if (r.key) {
        const sh = ss_().getSheetByName('Pantry'), vals = sh.getDataRange().getValues();
        for (let i = 1; i < vals.length; i++) if (vals[i][0] === r.key) sh.getRange(i + 1, 4, 1, 2).setValues([[src, now]]);
      }
      return { src: src, at: now };
    }
    default:
      throw new Error('Unknown op: ' + r.op);
  }
}

/* ---------- Owner passcode ---------- */
function owner_(key) {
  const want = PropertiesService.getScriptProperties().getProperty('EDIT_KEY');
  if (!want) throw new Error('Editing is not set up yet');
  if (String(key || '') !== want) { Utilities.sleep(1500); throw new Error('Wrong passcode'); }
}

/* ---------- Email to the owner (best effort) ---------- */
function notify_(subject, body) {
  try {
    const to = Session.getEffectiveUser().getEmail();
    if (!to) return;
    MailApp.sendEmail(to, '[Lund Cabin] ' + subject, body + '\n\n' + SITE);
  } catch (err) {
    console.log('notify failed: ' + err);
  }
}

/* ---------- Reading ---------- */
function state_() {
  const cutoff = Date.now() - KEEP_DAYS * 864e5;
  const out = { groceries: [], maintenance: [], inventory: [], checkout: [], pantry: {}, cleared: [], amenities: [], bring: [] };
  ['groceries', 'maintenance', 'inventory'].forEach(list => {
    rows_(LIST_TAB[list]).forEach(o => {
      const c = o.cleared_at;
      delete o.cleared_at;
      if (!c) out[list].push(o);
      else if (c >= cutoff) out.cleared.push({ list: list, at: c, data: o });
    });
  });
  out.cleared.sort((a, b) => b.at - a.at);
  out.checkout = rows_('Checkout').sort((a, b) => (a.order || 0) - (b.order || 0));
  rows_('Pantry').forEach(p => out.pantry[p.key] = { place: p.place, label: p.label, src: p.src || null, at: p.at || null });
  out.amenities = rows_('Amenities').sort((a, b) => (a.order || 0) - (b.order || 0));
  out.bring = rows_('Bring').sort((a, b) => (a.order || 0) - (b.order || 0));
  return out;
}

function rows_(name) {
  const vals = sheet_(name).getDataRange().getValues();
  const head = vals.shift();
  return vals.filter(r => r[0] !== '').map(r => {
    const o = {};
    head.forEach((h, i) => {
      let v = r[i];
      if (v instanceof Date) v = v.getTime();
      if (BOOL.indexOf(h) >= 0) v = v === true || String(v).toUpperCase() === 'TRUE';
      o[h] = v;
    });
    o.id = String(o.id || o.key || '');
    return o;
  });
}

function findRow_(list, id) {
  return rows_(LIST_TAB[list]).filter(o => o.id === String(id))[0] || null;
}

/* ---------- Writing helpers ---------- */
function setFields_(list, id, fields) {
  const sh = tab_(list), cols = TABS[sh.getName()];
  const vals = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][0]) === String(id)) {
      Object.entries(fields || {}).forEach(([k, v]) => {
        const c = cols.indexOf(k);
        if (c >= 0) sh.getRange(i + 1, c + 1).setValue(v);
      });
      return;
    }
  }
}

function savePhoto_(dataUrl, name) {
  const m = String(dataUrl).match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!m) throw new Error('Bad image');
  const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name + '.jpg');
  const folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('FOLDER_ID'));
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200';
}

function tab_(list) {
  const name = LIST_TAB[list];
  if (!name) throw new Error('Unknown list: ' + list);
  return sheet_(name);
}
// Gets a tab, creating it with its header row if it doesn't exist yet.
function sheet_(name, ss) {
  ss = ss || ss_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0 && TABS[name]) {
    sh.appendRow(TABS[name]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, TABS[name].length).setFontWeight('bold');
    (SEED[name] || []).forEach((row, i) => sh.appendRow([uid_()].concat(row, [i + 1])));
  }
  return sh;
}
function ss_() { return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function uid_() { return Math.random().toString(36).slice(2, 9); }
