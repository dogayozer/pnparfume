// Dijital bayilik tanıtım filmi + kısa açıklama (yalnız Türkçe).
// Video yalnızca oynatılınca iner (preload="none"); kapak ~100 KB, video ~3 MB.
export default function DigitalDealerFilm() {
  return (
    <section
      aria-labelledby="dijital-bayilik-film"
      className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6 md:grid-cols-[300px_1fr] md:p-8"
    >
      <figure className="mx-auto w-full max-w-[300px]">
        <video
          aria-label="Pien Parfüm dijital bayilik tanıtım filmi"
          className="aspect-[9/16] w-full rounded-2xl border border-foreground/10 bg-black object-cover"
          controls
          playsInline
          preload="none"
          poster="/kurumsal/pien-dijital-bayilik-poster.jpg"
        >
          <source src="/kurumsal/pien-dijital-bayilik-tr.mp4" type="video/mp4" />
        </video>
        <figcaption className="mt-3 text-center text-xs text-foreground/50">Dijital bayilik filmi (43 sn)</figcaption>
      </figure>
      <div className="space-y-4">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Dijital Bayilik</span>
        <h3 id="dijital-bayilik-film" className="text-2xl font-light">
          Sen sat, biz gönderelim
        </h3>
        <p className="leading-relaxed text-foreground/70">
          Online satış yapıyorsanız ürünlerimizi kendi mağazanızda ya da satış platformlarında satışa koyun. Sipariş
          geldiğinde bize iletin; ürünü fabrikamızdaki depoda sizin adınıza hazırlayıp kargolayalım. Depo ve büyük stok
          derdi olmadan, kendi ürünlerinizin yanında yeni bir gelir kapısı açın.
        </p>
        <p className="text-xs leading-relaxed text-foreground/45">
          Kapsam ve koşullar başvuru sonrasında birlikte netleştirilir.
        </p>
      </div>
    </section>
  )
}
