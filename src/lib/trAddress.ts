// Serbest metin Türkiye adresinden il ve (tahmini) ilçe çıkarır. HepsiJET gönderisi açılırken admin penceresini
// ÖNDOLDURMAK için kullanılır; admin her zaman düzeltip onaylar, bu yüzden basit bir sezgisel yöntemdir.

export const TR_PROVINCES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın',
  'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş',
  'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon',
  'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

const fold = (s: string) =>
  s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').normalize('NFD').replace(/[̀-ͯ]/g, '')

// "Mah., sok., cad., no:12, daire" gibi adres parçaları ilçe adı değildir.
const NOT_DISTRICT = /(\d|^no$|^mah|^mh$|^sk$|^sok|^cd$|^cad|^bulv|^blv|^apt|^daire|^kat$|^d$|^bina|^site|^blok)/i

export function splitCityDistrict(address: string): { city: string; district: string } {
  const text = String(address || '')
  const words = text.split(/[\s/,.;()\-]+/).filter(Boolean)
  const foldedWords = words.map(fold)

  // Metinde en SON geçen il adı (adres genelde "...İlçe/İl" ile biter).
  let idx = -1
  let city = ''
  for (const p of TR_PROVINCES) {
    const f = fold(p)
    const i = foldedWords.lastIndexOf(f)
    if (i > idx) { idx = i; city = p }
  }
  if (idx < 0) return { city: '', district: '' }

  const before = words[idx - 1]
  const after = words[idx + 1]
  const ok = (w?: string) => !!w && w.length > 2 && !NOT_DISTRICT.test(w) && !TR_PROVINCES.some((p) => fold(p) === fold(w))
  const district = ok(before) ? before : ok(after) ? after : ''
  return { city, district: district ? district.charAt(0).toLocaleUpperCase('tr') + district.slice(1).toLocaleLowerCase('tr') : '' }
}
