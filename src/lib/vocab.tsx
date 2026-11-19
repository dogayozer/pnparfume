'use client'

// Ürün verisindeki Türkçe etiket ve nota metinlerinin İngilizce/Arapça karşılıkları.
// Sözlük "tr=en=ar" satırlarından kurulur; kelime düzeyinde çalışır (birleşik ifadeler parça parça
// çevrilir, Arapçada sözcük sırası ters çevrilir). Bilinmeyen sözcükler Türkçe kalır.
// Filtre değerleri (URL parametreleri) Türkçe kalır — yalnızca görünen metin çevrilir.
import { useLang, type Lang } from '@/lib/i18n'

const RAW = `
erkek=Men=رجالي|kadın=Women=نسائي|unisex=Unisex=للجنسين
odunsu=Woody=خشبي|çiçeksi=Floral=زهري|baharatlı=Spicy=توابل|ferah=Fresh=منعش|oryantal=Oriental=شرقي|oriental=Oriental=شرقي|tatlı=Sweet=حلو|meyveli=Fruity=فاكهي|aromatik=Aromatic=عطري|aromatal=Aromatic=عطري
sucul=Aquatic=مائي|aquatik=Aquatic=مائي|gurme=Gourmand=غورماند|şipre=Chypre=شيبر|fougère=Fougère=فوجير|pudralı=Powdery=بودري|deri=Leather=جلد|klasik=Classic=كلاسيكي
yoğun=Intense=مكثّف|canlı=Vibrant=نابض بالحياة|elegant=Elegant=أنيق|miskli=Musky=مسكي|maskülen=Masculine=رجولي|temiz=Clean=نظيف|taze=Fresh=طازج|elit=Elite=راقٍ|sıcak=Warm=دافئ|lüks=Luxury=فاخر|ağır=Heavy=ثقيل|zengin=Rich=غني
kışkırtıcı=Provocative=مثير|güçlü=Strong=قوي|flörtöz=Flirty=مغري|derin=Deep=عميق|kült=Cult=أسطوري|kremamsı=Creamy=كريمي|kremsi=Creamy=كريمي|keskin=Sharp=حاد|mineral=Mineral=معدني|işıltılı=Sparkling=متلألئ|gösterişli=Showy=لافت|minimalist=Minimalist=بسيط|egzotik=Exotic=غريب|kulüp=Club=نادٍ|topraksı=Earthy=ترابي|ikonik=Iconic=أيقوني|güneşli=Sunny=مشمس|aydınlık=Bright=مضيء|tropikal=Tropical=استوائي|canlandırıcı=Invigorating=منعش|şehirli=Urban=حضري|afrodizyak=Aphrodisiac=منشّط|fütüristik=Futuristic=مستقبلي|eğlenceli=Fun=ممتع|neşeli=Cheerful=مرح|metalik=Metallic=معدني|oyunbaz=Playful=مرح|bohem=Bohemian=بوهيمي|akdeniz=Mediterranean=متوسطي|hollywood=Hollywood=هوليوود|baştan çıkarıcı=Seductive=مغوٍ|nadir=Rare=نادر|tazeleyici=Refreshing=منعش|meditatif=Meditative=تأملي|yazlık=Summery=صيفي|tozlu=Dusty=مغبر|yumuşak=Soft=ناعم|hipnotik=Hypnotic=ساحر|şeffaf=Transparent=شفاف|lavantalı=Lavender=بالخزامى|patlayıcı=Explosive=متفجر|şiirsel=Poetic=شاعري|net=Crisp=واضح|kahveli=Coffee=بالقهوة|okyanusal=Oceanic=محيطي|provokatif=Provocative=استفزازي|imparator=Emperor=إمبراطوري|aldehit=Aldehyde=ألدهيد|aldehitler=Aldehydes=ألدهيدات|nostaljik=Nostalgic=حنيني|doğal=Natural=طبيعي|chic=Chic=شيك|ipeksi=Silky=حريري|tütsülü=Incensed=ببخور|asi=Rebellious=متمرد|parlak=Bright=لامع|anıtsal=Monumental=مهيب|dumanlı=Smoky=دخاني|krem=Cream=كريمة|karakterli=Characterful=ذو شخصية|hafif=Light=خفيف|masalsı=Fairytale=خيالي|zamansız=Timeless=خالد|ozonik=Ozonic=أوزوني|duyusal=Sensual=حسي|ten kokusu=Skin Scent=رائحة البشرة|aşırı=Extra=مفرط|tuzlu=Salty=مالح|vanilyalı=Vanilla=بالفانيليا|beyaz çiçek=White Flower=زهر أبيض
sitrus=Citrus=حمضيات|narenciye=Citrus=حمضيات|narenciyeli=Citrus=حمضي|turunçgil=Citrus=حمضيات|turunçgiller=Citrus=حمضيات|turunçgilli=Citrus=حمضي|narenciyeler=Citrus=حمضيات
karizmatik=Charismatic=جذّاب|çekici=Attractive=ساحر|enerjik=Energetic=نشيط|sportif=Sporty=رياضي|dinamik=Dynamic=ديناميكي|günlük=Everyday=يومي|genç=Young=شبابي|modern=Modern=عصري|gizemli=Mysterious=غامض|iddialı=Bold=جريء|romantik=Romantic=رومانسي|zarif=Elegant=أنيق|sofistike=Sophisticated=راقٍ|özel=Special=خاص|musk=Musk=مسك|misk=Musk=مسك|ud=Oud=عود|amber=Amber=عنبر|vanilya=Vanilla=فانيليا|çikolata=Chocolate=شوكولاتة|gül=Rose=ورد
yaz=Summer=صيف|kış=Winter=شتاء|sonbahar=Autumn=خريف|ilkbahar=Spring=ربيع|dört mevsim=All Seasons=كل الفصول|gündüz=Daytime=نهارًا|gece=Night=ليلًا|akşam=Evening=مساءً|gece etkinliği=Night Event=فعالية ليلية|günlük kullanım=Everyday Use=استخدام يومي|toplantı=Meeting=اجتماع|ofis=Office=مكتب|davet=Evening Event=مناسبة|özel davet=Special Event=مناسبة خاصة|spor=Sport=رياضة|hediye=Gift=هدية
modern ve dinamik=Modern & Dynamic=عصري وديناميكي|samimi=Friendly=ودود|dostane=Warm=ودّي|lider=Leader=قيادي|otoriter=Authoritative=مهيب
çekicilik=Attraction=الجاذبية|özgüven=Confidence=الثقة بالنفس|cinsel arzu=Desire=الرغبة|ferahlık=Freshness=الانتعاش|enerji=Energy=الطاقة|sıcaklık=Warmth=الدفء|huzur=Serenity=السكينة|yakınlık=Intimacy=القرب|zarafet=Elegance=الأناقة|feminenlik=Femininity=الأنوثة|otorite=Authority=الهيبة|güven=Trust=الثقة|profesyonellik=Professionalism=الاحتراف|karizma=Charisma=الكاريزما
gizli formül=Secret Formula=تركيبة سرّية|özel harman=Signature Blend=مزيج خاص|özel seri=Special Series=سلسلة خاصة|bilinmiyor=—=—
bergamot=Bergamot=برغموت|limon=Lemon=ليمون|portakal=Orange=برتقال|mandalina=Mandarin=يوسفي|mandarin=Mandarin=يوسفي|mandalin=Mandarin=يوسفي|greyfurt=Grapefruit=جريب فروت|lavanta=Lavender=لافندر|nane=Mint=نعناع|biberiye=Rosemary=إكليل الجبل|adaçayı=Sage=مريمية|zencefil=Ginger=زنجبيل|karabiber=Black Pepper=فلفل أسود|biber=Pepper=فلفل|pepper=Pepper=فلفل|kardamom=Cardamom=هيل|kakule=Cardamom=هيل|tarçın=Cinnamon=قرفة|safran=Saffron=زعفران|karanfil=Clove=قرنفل|hindistan cevizi=Coconut=جوز الهند|muskat=Nutmeg=جوزة الطيب|nutmeg=Nutmeg=جوزة الطيب
elma=Apple=تفاح|armut=Pear=إجاص|şeftali=Peach=خوخ|kayısı=Apricot=مشمش|ananas=Pineapple=أناناس|nar=Pomegranate=رمان|çilek=Strawberry=فراولة|ahududu=Raspberry=توت العليق|frambuaz=Raspberry=توت العليق|incir=Fig=تين|erik=Plum=برقوق|kavun=Melon=شمام|karpuz=Watermelon=بطيخ|kiraz=Cherry=كرز|vişne=Sour Cherry=كرز حامض|mango=Mango=مانجو|muz=Banana=موز|böğürtlen=Blackberry=توت أسود|nektarin=Nectarine=نكتارين|kumkuat=Kumquat=كمكوات|yuzu=Yuzu=يوزو|litchi=Lychee=ليتشي|lychee=Lychee=ليتشي|guava=Guava=جوافة|çarkıfelek=Passion Fruit=باشن فروت|hurma=Persimmon=كاكي|trabzon hurması=Persimmon=كاكي|kuşüzümü=Currant=كشمش|kuşüzümü=Currant=كشمش|frenk üzümü=Currant=كشمش|cassis=Blackcurrant=كشمش أسود|goji=Goji=غوجي|dut=Berry=توت|dutları=Berries=توت|ceviz=Walnut=جوز|kestane=Chestnut=كستناء|fındık=Hazelnut=بندق|badem=Almond=لوز|kakao=Cocoa=كاكاو|kahve=Coffee=قهوة|karamel=Caramel=كراميل|bal=Honey=عسل|çay=Tea=شاي|tütün=Tobacco=تبغ|süt=Milk=حليب|şeker=Sugar=سكر|pralin=Praline=برالين|marşmelov=Marshmallow=مارشميلو|hatmi=Marshmallow=خطمي|toffee=Toffee=توفي|konyak=Cognac=كونياك|rom=Rum=روم|votka=Vodka=فودكا|cin=Gin=جن|gin=Gin=جن|likör=Liqueur=ليكيور|viski=Whisky=ويسكي|şarap=Wine=نبيذ|şerbet=Sorbet=شربات|zeytin=Olive=زيتون|salatalık=Cucumber=خيار|domates=Tomato=طماطم|havuç=Carrot=جزر|pirinç=Rice=أرز|buğday=Wheat=قمح|kenevir=Hemp=قنب|saman=Straw=قش|kepek=Bran=نخالة|mısır=Corn=ذرة|patlamış mısır=Popcorn=فشار|cappuccino=Cappuccino=كابتشينو|havyar=Caviar=كافيار|macaron=Macaron=ماكارون|dondurma=Ice Cream=آيس كريم|şanti=Chantilly=شانتيه
sardunya=Geranium=غرنوقي|ylang=Ylang=يلانغ|ylang-ylang=Ylang Ylang=يلانغ يلانغ|neroli=Neroli=نيرولي|şakayık=Peony=فاوانيا|gardenya=Gardenia=غاردينيا|menekşe=Violet=بنفسج|sümbülteber=Tuberose=مسك الروم|tuberose=Tuberose=مسك الروم|fesleğen=Basil=ريحان|kedi otu=Valerian=حشيشة الهر|kediotu=Valerian=حشيشة الهر|yasemin=Jasmine=ياسمين|sambac=Sambac=سامباك|hanımeli=Honeysuckle=زهر العسل|nergis=Narcissus=نرجس|osmanthus=Osmanthus=أوسمانثوس|mimoza=Mimosa=ميموزا|heliotrope=Heliotrope=هليوتروب|helyotrop=Heliotrope=هليوتروب|günebakan=Sunflower=دوار الشمس|zambak=Lily=زنبق|lilyum=Lily=زنبق|vadideki zambak=Lily of the Valley=زنبق الوادي|vadi zambağı=Lily of the Valley=زنبق الوادي|muguet=Lily of the Valley=زنبق الوادي|müge=Lily of the Valley=زنبق الوادي|orkide=Orchid=أوركيد|lotus=Lotus=لوتس|nilüfer=Water Lily=زنبق الماء|frezya=Freesia=فريزيا|manolya=Magnolia=ماغنوليا|iris=Iris=سوسن|süsen=Iris=سوسن|siklamen=Cyclamen=قوسية|hibiskus=Hibiscus=خبازى|yonca=Clover=برسيم|papatya=Chamomile=بابونج|leylak=Lilac=ليلك|lilak=Lilac=ليلك|çan çiçeği=Bellflower=زهرة الجرس|sümbül=Hyacinth=زنبق|hyacinth=Hyacinth=زنبق|amaryllis=Amaryllis=أماريليس|kamelya=Camellia=كاميليا|ortanca=Hydrangea=ورد الكرنب|datura=Datura=داتورا|rhododendron=Rhododendron=رودودندرون|frangipani=Frangipani=فرانجيباني|stephanotis=Stephanotis=ستيفانوتيس|tiare=Tiare=تياري|sedef çiçeği=Mother-of-Pearl Flower=زهرة عرق اللؤلؤ|unutma beni=Forget-me-not=لا تنساني|reseda=Reseda=ريسيدا|kaktüs=Cactus=صبار|pamuk=Cotton=قطن|çiçek=Flower=زهرة|çiçekler=Flowers=أزهار|çiçeği=Blossom=زهر|çiçek sapları=Flower Stems=سيقان الزهور|akasya=Acacia=أكاسيا|sarmaşık=Ivy=لبلاب|ravent=Rhubarb=راوند|çimen=Grass=عشب|eğrelti otu=Fern=سرخس|yonca=Clover=برسيم|melisa=Lemon Balm=ترنجان|dereotu=Dill=شبت|davana=Davana=دافانا|pelin otu=Wormwood=شيح|pelin=Wormwood=شيح|artemisia=Artemisia=شيح|limon otu=Lemongrass=عشب الليمون|kekik=Thyme=زعتر|anason=Anise=يانسون|yıldız anason=Star Anise=يانسون نجمي|rezene=Fennel=شمر|kimyon=Cumin=كمون|yenibahar=Allspice=بهار حلو|kişniş=Coriander=كزبرة|havuç tohumu=Carrot Seed=بذور الجزر|sichuan biberi=Sichuan Pepper=فلفل سيتشوان|pimiento=Pimento=بيمنتو|sert=Strong=قوي
sedir=Cedar=أرز|ardıç=Juniper=عرعر|huş=Birch=بتولا|meşe=Oak=بلوط|selvi=Cypress=سرو|fir=Fir=تنوب|ladin=Spruce=تنوب|çam=Pine=صنوبر|maun=Mahogany=ماهوغني|abanoz=Ebony=أبنوس|palisander=Rosewood=خشب الورد|tik=Teak=ساج|teak=Teak=ساج|sekoya=Sequoia=سيكويا|bambu=Bamboo=خيزران|palmiye=Palm=نخيل|zeytin ağacı=Olive Wood=خشب الزيتون|paçuli=Patchouli=باتشولي|paçulisi=Patchouli=باتشولي|vetiver=Vetiver=فيتيفر|vetiveri=Vetiver=فيتيفر|sandal=Sandalwood=صندل|sandalwood=Sandalwood=صندل|kaşmir=Cashmere=كشمير|kaşmeran=Cashmeran=كاشميران|cashmeran=Cashmeran=كاشميران|guaiac=Guaiac=غاياك|amberwood=Amberwood=خشب العنبر|ambroxan=Ambroxan=أمبروكسان|ambrosan=Ambroxan=أمبروكسان|ambroks=Ambrox=أمبروكس|ambrette=Ambrette=أمبريت|ambergris=Ambergris=عنبر رمادي|kehribar=Amber=عنبر|kehribargris=Ambergris=عنبر رمادي|aloksan=Aloxan=ألوكسان|papirüs=Papyrus=بردي|süet=Suede=سويدي|suede=Suede=سويدي|deri akoru=Leather Accord=أكورد جلدي|deri akorları=Leather Accords=أكوردات جلدية|akor=Accord=أكورد|akoru=Accord=أكورد|akorlar=Accords=أكوردات|akorları=Accords=أكوردات|notası=Note=نوتة|notaları=Notes=نوتات|notalar=Notes=نوتات|notlar=Notes=نوتات|reçine=Resin=راتنج|reçineler=Resins=راتنجات|reçinesi=Resin=راتنج|balsam=Balsam=بلسم|balsamı=Balsam=بلسم|benzoin=Benzoin=لبان جاوي|styrax=Styrax=ستيراكس|mür=Myrrh=مر|tütsü=Incense=بخور|opoponax=Opoponax=أوبوبوناكس|elemi=Elemi=إليمي|galbanum=Galbanum=غلبانوم|labdanum=Labdanum=لادن|oakmoss=Oakmoss=طحلب البلوط|meşe yosunu=Oakmoss=طحلب البلوط|yosun=Moss=طحلب|yosunu=Moss=طحلب|tonka=Tonka=تونكا|tolu=Tolu=تولو|peru=Peru=بيرو|copahu=Copaiba=كوباهو|kumarin=Coumarin=كومارين|calone=Calone=كالون|civet=Civet=زباد|talk=Talc=تلك|balmumu=Beeswax=شمع العسل|kum=Sand=رمل|duman=Smoke=دخان|toprak=Earth=تراب|çakmak taşı=Flint=حجر الصوان|su=Water=ماء|deniz=Sea=بحر|suyu=Water=ماء|tuzu=Salt=ملح|buz=Ice=جليد|buzlu=Icy=مثلج|yağmurlu hava=Rainy Air=هواء ماطر|hava=Air=هواء|havası=Air=هواء|ham=Raw=خام|dpg=DPG=DPG|bazı=Base=قاعدة|çözücü=Solvent=مذيب|fiksatörler=Fixatives=مثبتات|ekstresi=Extract=مستخلص|özü=Extract=مستخلص|esansı=Essence=جوهر|mutlak=Absolute=مطلق|yağı=Oil=زيت
beyaz=White=أبيض|siyah=Black=أسود|kara=Black=أسود|kırmızı=Red=أحمر|yeşil=Green=أخضر|pembe=Pink=وردي|mavi=Blue=أزرق|mor=Purple=بنفسجي|sarı=Yellow=أصفر|altın=Golden=ذهبي|kristal=Crystal=كريستال|saf=Pure=نقي|ballı=Honeyed=بالعسل|sulu=Juicy=عصيري|acı=Bitter=مُرّ|ekşi=Sour=حامض|mayhoş=Tart=لاذع|şekerli=Sugared=محلّى|kavrulmuş=Roasted=محمّص|koyu=Dark=داكن|sıcak=Warm=دافئ|doğal=Natural=طبيعي|değerli=Precious=ثمين|kıymetli=Precious=ثمين|esmer=Brown=بني|mineral=Mineral=معدني|bitter=Bitter=مرّ|sütlü=Milky=بالحليب|yoğun=Intense=مكثّف|soyut=Abstract=مجرّد|gece açan=Night-blooming=متفتح ليلًا|taze=Fresh=طازج|yaprağı=Leaf=ورقة|yaprakları=Leaves=أوراق|yapraklar=Leaves=أوراق|kökü=Root=جذر|kök=Root=جذر|meyvesi=Fruit=ثمرة|meyveler=Fruits=فواكه|meyveleri=Berries=ثمار|meyve=Fruit=فاكهة|meyvemsi=Fruity=فاكهي|meyan=Licorice=عرق السوس|meyankökü=Licorice Root=جذر عرق السوس|tohumu=Seed=بذرة|kabuğu=Peel=قشر|kabuk=Peel=قشر|çekirdekleri=Beans=حبوب|çekirdeği=Bean=حبة|çiçeksi=Floral=زهري|ağacı=Wood=خشب|ağaç=Wood=خشب|odunu=Wood=خشب|odunlar=Woods=أخشاب|ahşap=Wood=خشب|ağacı=Wood=خشب|gülü=Rose=ورد|gül=Rose=ورد|yasemini=Jasmine=ياسمين|zambağı=Lily=زنبق|orkidesi=Orchid=أوركيد|vanilyası=Vanilla=فانيليا|limonu=Lemon=ليمون|bergamotu=Bergamot=برغموت|berguatı=Bergamot=برغموت|portakalı=Orange=برتقال|mandalinası=Mandarin=يوسفي|greyfurtu=Grapefruit=جريب فروت|armudu=Pear=إجاص|kayısısı=Apricot=مشمش|şeftalisi=Peach=خوخ|lavantası=Lavender=لافندر|sediri=Cedar=أرز|kakulesi=Cardamom=هيل|biberi=Pepper=فلفل|çayı=Tea=شاي|çayı=Tea=شاي|likörü=Liqueur=ليكيور|balı=Honey=عسل|pralini=Praline=برالين|kalbi=Heart=قلب|akoru=Accord=أكورد|notası=Note=نوتة
fransız=French=فرنسي|italyan=Italian=إيطالي|türk=Turkish=تركي|fas=Moroccan=مغربي|bulgar=Bulgarian=بلغاري|madagaskar=Madagascar=مدغشقر|endonezya=Indonesian=إندونيسي|hindistan=Indian=هندي|hint=Indian=هندي|haiti=Haitian=هايتي|tahiti=Tahitian=تاهيتي|afrika=African=أفريقي|afrikalı=African=أفريقي|virginia=Virginia=فرجينيا|virjinya=Virginia=فرجينيا|şam=Damask=دمشقي|grasse=Grasse=غراس|taif=Taif=طائف|calabria=Calabrian=كالابري|kalabriyen=Calabrian=كالابري|sicilya=Sicilian=صقلي|amalfi=Amalfi=أمالفي|atlas=Atlas=أطلس|himalaya=Himalayan=هيمالايا|lübnan=Lebanese=لبناني|mysore=Mysore=ميسور|akdeniz=Mediterranean=متوسطي|mayıs=May=مايو|seylan=Ceylon=سيلان|japon=Japanese=ياباني|çin=Chinese=صيني|karoo=Karoo=كارو|yeni dünya=New World=العالم الجديد|güneydoğu asya=Southeast Asia=جنوب شرق آسيا|karayip=Caribbean=كاريبي|bourbon=Bourbon=بوربون|tangerine=Tangerine=يوسفي|klementin=Clementine=كليمنتين|kan=Blood=دموي|kan portakalı=Blood Orange=برتقال دموي|nashi=Nashi=ناشي|granny smith=Granny Smith=غراني سميث|beyaz akasya=White Acacia=أكاسيا بيضاء|ve=and=و|ile=with=مع
`

type Pair = [string, string]
const V: Record<string, Pair> = {}
for (const line of RAW.split('\n')) {
  for (const item of line.split('|')) {
    const p = item.split('=')
    if (p.length === 3 && p[0].trim()) V[p[0].trim().toLocaleLowerCase('tr-TR')] = [p[1].trim(), p[2].trim()]
  }
}

const key = (s: string) => s.trim().toLocaleLowerCase('tr-TR')

function stem(word: string): Pair | undefined {
  const w = key(word)
  if (V[w]) return V[w]
  // Tamlama/iyelik ekleri: ... -ı/-i/-u/-ü, -sı/-si/-su/-sü, -ları/-leri
  for (const suf of ['ları', 'leri', 'sı', 'si', 'su', 'sü', 'ı', 'i', 'u', 'ü', 'ın', 'in', 'un', 'ün']) {
    if (w.length > suf.length + 2 && w.endsWith(suf)) {
      const base = w.slice(0, -suf.length)
      if (V[base]) return V[base]
    }
  }
  return undefined
}

function translatePhrase(phrase: string, lang: 'en' | 'ar'): string {
  const idx = lang === 'en' ? 0 : 1
  let text = phrase.trim()
  if (!text) return phrase
  // "Kehribar (Amber)" gibi: İngilizcede parantez içindeki Latin sözcüğü, Arapçada ana terimi çevir.
  const par = text.match(/^(.*?)\s*\(([^)]+)\)\s*(.*)$/)
  if (par) {
    const inner = par[2].trim()
    if (lang === 'en' && /^[A-Za-z' .-]+$/.test(inner)) return inner
    text = [par[1], par[3]].filter(Boolean).join(' ').trim() || inner
  }
  const whole = V[key(text)]
  if (whole) return whole[idx]
  const words = text.split(/\s+/)
  let hits = 0
  const out = words.map((w) => {
    const m = stem(w)
    if (m) {
      hits++
      return m[idx]
    }
    return w
  })
  if (!hits) return phrase
  return (lang === 'ar' ? out.reverse() : out).join(' ')
}

/** "Karizmatik & Çekici", "Çiçeksi, Odunsu", "Vanilya • Amber" gibi birleşik metinleri parça parça çevirir. */
export function translateVocab(value: string | null | undefined, lang: Lang): string {
  if (!value) return ''
  if (lang === 'tr') return value
  return value
    .split(/(\s*(?:,|&|\/|•|\sve\s)\s*)/)
    .map((part, i) => {
      if (i % 2 === 1) return part.includes('ve') ? (lang === 'ar' ? ' و ' : ' & ') : part
      return translatePhrase(part, lang)
    })
    .join('')
}

/** Satır içi etiket/nota çevirisi. */
export function V_({ value }: { value: string | null | undefined }) {
  const lang = useLang()
  return <>{translateVocab(value, lang)}</>
}

export const Vocab = V_
