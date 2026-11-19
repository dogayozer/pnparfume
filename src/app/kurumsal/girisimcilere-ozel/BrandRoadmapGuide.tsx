'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  GitBranch,
  Layers,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react'
import {
  ALGORITHM_STEPS,
  BOTTLE_NECK_ROWS,
  CONCENTRATION_ROWS,
  FEES_2026,
  MIND_MAP_BRANCHES,
  PIEN_SUPPORT_PILLARS,
} from './brand-roadmap-data'

type ReferenceTab = 'technical' | 'compliance' | 'budget'

export default function BrandRoadmapGuide() {
  const [activeBranchId, setActiveBranchId] = useState<string>(MIND_MAP_BRANCHES[0].id)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<ReferenceTab>('technical')

  const activeBranch =
    MIND_MAP_BRANCHES.find((branch) => branch.id === activeBranchId) ?? MIND_MAP_BRANCHES[0]
  const activeStep = ALGORITHM_STEPS[activeStepIndex] ?? ALGORITHM_STEPS[0]

  return (
    <div className="space-y-14">
      {/* 1. PN Parfüm Süreç Desteği */}
      <section aria-labelledby="pien-support-heading" className="space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3.5 py-1 text-xs font-medium tracking-wide text-accent-gold">
            <Sparkles size={14} aria-hidden="true" />
            Uçtan Uca Fason Üretim ve Marka Danışmanlığı
          </div>
          <h3 id="pien-support-heading" className="text-2xl font-light text-foreground">
            PN Parfüm Olarak Sürecin Hangi Aşamalarında Yanınızdayız?
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70">
            Türkiye&apos;de kozmetik ürünleri önceden ruhsatlandırılmaz; bunun yerine piyasaya arz
            öncesi <strong>ÜBD</strong>, <strong>CPSR</strong>, <strong>Sorumlu Teknik Eleman</strong>{' '}
            ve <strong>ÜTS</strong> bildirimini şart koşan sıkı bir sorumluluk rejimi uygulanır. PN
            Parfüm olarak yalnızca dolum değil, fikirden ilk satışa kadar tüm teknik ve operasyonel
            adımlarda yanınızdayız.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PIEN_SUPPORT_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-foreground/10 bg-background p-5 transition-colors hover:border-accent-gold/40"
            >
              <div className="mb-2 text-xs font-semibold tracking-widest text-accent-gold">
                0{idx + 1}
              </div>
              <h4 className="mb-2 text-base font-medium text-foreground">{pillar.title}</h4>
              <p className="text-xs leading-relaxed text-foreground/65">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. İnteraktif Zihin Haritası */}
      <section aria-labelledby="mindmap-heading" className="space-y-6 border-t border-foreground/10 pt-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent-gold">
            <Layers size={14} aria-hidden="true" />
            Proje Zihin Haritası
          </div>
          <h3 id="mindmap-heading" className="text-2xl font-light text-foreground">
            Fason Parfüm Üretim ve Markalaşma Zihin Haritası
          </h3>
          <p className="text-sm text-foreground/65">
            Başarılı bir marka kurma süreci 6 ana eksenden oluşur. Detayları, kritik bağımlılık
            kuralını ve PN Parfüm desteğini görmek için dallardan birini seçin.
          </p>
        </div>

        {/* Görsel Zihin Haritası Şeması */}
        <div className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-7">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center">
            {/* Kök Düğüm */}
            <div className="flex-shrink-0 rounded-2xl border border-accent-gold/40 bg-accent-gold/10 px-5 py-4 text-center lg:w-64 lg:text-left">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-accent-gold">
                Ana Yol Haritası
              </div>
              <div className="text-base font-medium leading-snug text-foreground">
                Fason Parfüm Üretim ve Markalaşma Rehberi
              </div>
              <div className="mt-2 text-xs text-foreground/60">
                6 Ana Sütun • PN Parfüm Güvencesi
              </div>
            </div>

            {/* SVG Bağlantı Eğrileri (Masaüstü) */}
            <div className="hidden w-16 flex-shrink-0 lg:block" aria-hidden="true">
              <svg viewBox="0 0 64 260" className="h-64 w-full overflow-visible">
                {[22, 66, 110, 154, 198, 242].map((y, idx) => {
                  const branch = MIND_MAP_BRANCHES[idx]
                  const isActive = branch?.id === activeBranch.id
                  return (
                    <path
                      key={y}
                      d={`M 0 130 C 32 130, 32 ${y}, 64 ${y}`}
                      fill="none"
                      stroke={isActive ? 'currentColor' : 'currentColor'}
                      className={isActive ? 'text-accent-gold' : 'text-foreground/20'}
                      strokeWidth={isActive ? 2.2 : 1.2}
                    />
                  )
                })}
              </svg>
            </div>

            {/* 6 Dal Butonu */}
            <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {MIND_MAP_BRANCHES.map((branch) => {
                const isActive = branch.id === activeBranch.id
                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setActiveBranchId(branch.id)}
                    aria-pressed={isActive}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold ${
                      isActive
                        ? 'border-accent-gold bg-accent-gold/10 text-foreground shadow-sm'
                        : 'border-foreground/10 bg-foreground/[0.02] text-foreground/75 hover:border-foreground/25 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive
                            ? 'bg-accent-gold text-background'
                            : 'bg-foreground/10 text-foreground/70'
                        }`}
                      >
                        {branch.number}
                      </span>
                      <div>
                        <div className="text-sm font-medium">{branch.title}</div>
                        <div className="text-xs text-foreground/55">{branch.shortSummary}</div>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      aria-hidden="true"
                      className={isActive ? 'text-accent-gold' : 'text-foreground/35'}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Seçili Dal Detay Kartı */}
          <div className="mt-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg font-medium text-accent-gold">
                {activeBranch.number}. {activeBranch.title}
              </h4>
              <span className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs text-foreground/65">
                {activeBranch.shortSummary}
              </span>
            </div>

            <ul className="mb-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {activeBranch.subtopics.map((topic) => (
                <li key={topic} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75">
                  <CheckCircle2
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 flex-shrink-0 text-accent-gold"
                  />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={14} aria-hidden="true" />
                  Kritik Bağımlılık / Öncelik Kuralı
                </div>
                <p className="text-xs leading-relaxed text-foreground/75">
                  {activeBranch.criticalRule}
                </p>
              </div>
              <div className="rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent-gold">
                  <Sparkles size={14} aria-hidden="true" />
                  PN Parfüm Desteği
                </div>
                <p className="text-xs leading-relaxed text-foreground/75">
                  {activeBranch.pienSupport}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Algoritmik Karar Akış Şeması (Adım 0 - Adım 10) */}
      <section aria-labelledby="algorithm-heading" className="space-y-6 border-t border-foreground/10 pt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent-gold">
              <GitBranch size={14} aria-hidden="true" />
              Algoritmik Karar Akışı
            </div>
            <h3 id="algorithm-heading" className="text-2xl font-light text-foreground">
              Fikirden İlk Satışa 11 Adımlı Karar Kapısı Şeması
            </h3>
            <p className="text-sm text-foreground/65">
              Her adım bir kontrol sorusuyla başlar. &quot;Evet&quot; onayı alınmadan bir sonraki
              aşamaya geçilmemelidir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllSteps((prev) => !prev)}
            className="self-start rounded-full border border-foreground/15 bg-background px-4 py-2 text-xs font-medium text-foreground/80 transition-colors hover:border-accent-gold hover:text-accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
          >
            {showAllSteps ? 'Adım Adım Görünüme Geç' : 'Tüm 11 Adımı Listele'}
          </button>
        </div>

        {!showAllSteps ? (
          <div className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-7">
            {/* Adım Seçici Zincir */}
            <div className="mb-6 flex flex-wrap gap-2">
              {ALGORITHM_STEPS.map((item, idx) => {
                const isCurrent = idx === activeStepIndex
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    aria-pressed={isCurrent}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold ${
                      isCurrent
                        ? 'border-accent-gold bg-accent-gold text-background'
                        : 'border-foreground/10 bg-foreground/[0.02] text-foreground/70 hover:border-foreground/30'
                    }`}
                  >
                    {item.step}
                  </button>
                )
              })}
            </div>

            {/* Aktif Karar Düğümü Kartı */}
            <div className="space-y-4">
              <div className="rounded-xl border border-accent-gold/35 bg-accent-gold/5 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent-gold">
                  {activeStep.step} • {activeStep.title}
                </div>
                <div className="text-base font-medium text-foreground">
                  Kontrol Sorusu: {activeStep.question}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                    <XCircle size={15} aria-hidden="true" />
                    Koşul Sağlanmıyorsa (HAYIR)
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/75">{activeStep.noAction}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={15} aria-hidden="true" />
                    Koşul Sağlanıyorsa (EVET → İşlem ve Çıktı)
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/75">{activeStep.yesAction}</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-xs text-foreground/75">
                  <ClipboardCheck size={15} aria-hidden="true" className="text-accent-gold" />
                  <span>
                    <strong className="text-foreground">PN Parfüm Rolü:</strong>{' '}
                    {activeStep.pienRole}
                  </span>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-lg border border-foreground/15 px-3 py-1 text-xs text-foreground/75 disabled:opacity-35"
                  >
                    Önceki
                  </button>
                  <button
                    type="button"
                    disabled={activeStepIndex === ALGORITHM_STEPS.length - 1}
                    onClick={() =>
                      setActiveStepIndex((prev) => Math.min(ALGORITHM_STEPS.length - 1, prev + 1))
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-background disabled:opacity-35"
                  >
                    Sonraki Adım <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {ALGORITHM_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-foreground/10 bg-background p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-accent-gold">
                    {item.step}: {item.title}
                  </span>
                  <span className="text-xs text-foreground/60">{item.pienRole}</span>
                </div>
                <p className="mb-3 text-xs font-medium text-foreground/85">{item.question}</p>
                <div className="grid grid-cols-1 gap-2.5 text-xs md:grid-cols-2">
                  <div className="rounded-lg bg-red-500/5 p-2.5 text-foreground/75">
                    <strong className="text-red-600 dark:text-red-400">Hayır: </strong>
                    {item.noAction}
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 p-2.5 text-foreground/75">
                    <strong className="text-emerald-700 dark:text-emerald-400">Evet: </strong>
                    {item.yesAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Teknik ve Mevzuat Referansları (Sekmeli) */}
      <section aria-labelledby="reference-heading" className="space-y-6 border-t border-foreground/10 pt-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent-gold">
            <FileCheck2 size={14} aria-hidden="true" />
            Teknik &amp; Mevzuat Özeti
          </div>
          <h3 id="reference-heading" className="text-2xl font-light text-foreground">
            Karar Vericiler İçin Kritik Veriler (2026 Güncel)
          </h3>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Teknik referans sekmeleri">
          {[
            { id: 'technical' as const, label: 'Konsantrasyon & Şişe Seçimi' },
            { id: 'compliance' as const, label: '2026 Takvimi & Yasaklı İddialar' },
            { id: 'budget' as const, label: '2026 Resmî Harçlar & Bütçe' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold text-background'
                    : 'border-foreground/15 bg-background text-foreground/70 hover:border-foreground/30'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'technical' && (
          <div className="space-y-6 rounded-2xl border border-foreground/10 bg-background p-5">
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Parfüm Konsantrasyon Sınıfları
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-foreground/10 text-foreground/55">
                      <th className="py-2 pr-3 font-medium">Tür</th>
                      <th className="py-2 pr-3 font-medium">Esans Oranı</th>
                      <th className="py-2 pr-3 font-medium">100 ml</th>
                      <th className="py-2 pr-3 font-medium">Kalıcılık</th>
                      <th className="py-2 font-medium">Karakter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5 text-foreground/80">
                    {CONCENTRATION_ROWS.map((row) => (
                      <tr key={row.type}>
                        <td className="py-2.5 pr-3 font-medium text-foreground">{row.type}</td>
                        <td className="py-2.5 pr-3">{row.ratio}</td>
                        <td className="py-2.5 pr-3">{row.ml}</td>
                        <td className="py-2.5 pr-3">{row.longevity}</td>
                        <td className="py-2.5 text-foreground/65">{row.character}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Şişe Boynu ve Valf Mekanizması Karşılaştırması
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-foreground/10 text-foreground/55">
                      <th className="py-2 pr-3 font-medium">Özellik</th>
                      <th className="py-2 pr-3 font-medium">FEA 15 (Krimp / Kolay Kapama)</th>
                      <th className="py-2 font-medium">Vidalı Ağız (ör. 15-415)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5 text-foreground/80">
                    {BOTTLE_NECK_ROWS.map((row) => (
                      <tr key={row.feature}>
                        <td className="py-2.5 pr-3 font-medium text-foreground">{row.feature}</td>
                        <td className="py-2.5 pr-3 text-foreground/70">{row.fea15}</td>
                        <td className="py-2.5 text-foreground/70">{row.screw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-foreground/10 bg-background p-5 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-foreground/10 p-4">
              <div className="text-xs font-semibold text-accent-gold">31 Temmuz 2026 • 82 Alerjen</div>
              <p className="text-xs leading-relaxed text-foreground/75">
                KÜD-KLVZ-57 uyarınca bitmiş üründe <strong>%0,001 (10 ppm)</strong> eşiğini aşan 82
                parfüm alerjeni kutu etiketinde <code>Parfum</code> yanında yazılmalıdır. Eski
                stoklar en geç <strong>31 Temmuz 2028</strong>&apos;e kadar satılabilir.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-foreground/10 p-4">
              <div className="text-xs font-semibold text-accent-gold">
                1 Ekim 2026 • Sorumlu Teknik Eleman
              </div>
              <p className="text-xs leading-relaxed text-foreground/75">
                Bir Sorumlu Teknik Eleman en fazla <strong>30 firmayla</strong> çalışabilir. Yalnızca
                7 lisans unvanı (eczacı, kimyager, kimya müh., biyokimyager, biyolog, mikrobiyolog,
                biyomedikal müh.) geçerlidir.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-foreground/10 p-4">
              <div className="text-xs font-semibold text-accent-gold">ISO 29621 Test Avantajı</div>
              <p className="text-xs leading-relaxed text-foreground/75">
                Alkol oranı <strong>%20 ve üzeri</strong> parfümler düşük mikrobiyolojik riskli
                sayılır; bilimsel risk değerlendirmesi ÜBD/CPSR&apos;ye eklenerek mikrobiyoloji ve
                challenge testlerinden muafiyet alınabilir (stabilite testi yine zorunludur).
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-red-500/25 bg-red-500/5 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <ShieldAlert size={14} aria-hidden="true" />
                Yasaklı İddialar (KÜD-KLVZ-11)
              </div>
              <p className="text-xs leading-relaxed text-foreground/75">
                &quot;Sağlık Bakanlığı Onaylı&quot;, &quot;TİTCK Onaylı&quot;, &quot;ÜTS
                Bildirimlidir&quot;, &quot;Paraben içermez&quot; ve &quot;Koruyucu içermez&quot;
                ifadeleri yasaktır ve ürünün piyasadan çekilmesine yol açabilir.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-4 rounded-2xl border border-foreground/10 bg-background p-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead>
                  <tr className="border-b border-foreground/10 text-foreground/55">
                    <th className="py-2 pr-3 font-medium">2026 Resmî İşlem Kalemi</th>
                    <th className="py-2 pr-3 font-medium">Tutar</th>
                    <th className="py-2 font-medium">Not</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5 text-foreground/80">
                  {FEES_2026.map((row) => (
                    <tr key={row.item}>
                      <td className="py-2.5 pr-3 font-medium text-foreground">{row.item}</td>
                      <td className="py-2.5 pr-3 font-semibold text-accent-gold">{row.fee}</td>
                      <td className="py-2.5 text-foreground/65">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs leading-relaxed text-foreground/60">
              Bunlara ek olarak şirket kuruluşu/e-imza, GS1 barkod üyeliği, numune ve MOQ kapsamlı
              üretim (esans, alkol, şişe, valf, kutu), stabilite/uyumluluk testleri, CPSR/ÜBD
              danışmanlığı, Sorumlu Teknik Eleman ve e-ticaret altyapısı bütçeye dahil edilmelidir.
            </p>
            <p className="text-xs leading-relaxed text-foreground/50">
              Yukarıdaki tutarlar tahminidir ve bilgi amaçlıdır; güncel rakamlar ilgili kurumlardan
              teyit edilmelidir.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
