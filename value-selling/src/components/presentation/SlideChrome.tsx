// Used for slide borders/footers

export const SlideHeader = ({ title, subtitle, hideSubtitle }: { title: string, subtitle?: string, hideSubtitle?: boolean }) => (
    <div className="px-[6cqi] mb-[1cqi] pt-[1.5cqi]">
        <h1 className="font-heading text-[3cqi] font-black text-f-charcoal mb-[0.5cqi] tracking-tight">{title}</h1>
        {!hideSubtitle && subtitle && (
            <p className="font-body text-[1.4cqi] text-f-charcoal/60 pb-[1.5cqi] border-b-[0.15cqi] border-f-charcoal/10">
                {subtitle}
            </p>
        )}
    </div>
);

export const SlideFooter = ({ bankName, align = "between" }: { bankName: string, align?: "between" | "center" }) => (
    <div className={`flex ${align === 'center' ? 'justify-center border-none bg-transparent gap-[2cqi]' : 'justify-between border-t border-f-charcoal/10 bg-f-bg'} items-center px-[4cqi] pb-[1cqi] pt-[1cqi] text-[0.9cqi] font-heading text-f-charcoal/50 font-bold mt-auto z-20 shrink-0`}>
        <div className={`uppercase tracking-[0.2em] font-black text-transparent bg-clip-text bg-gradient-to-r from-f-violet to-f-fuchsia hidden md:block`}>Finastra Corporate Briefing</div>
        {align === 'between' && <div className="uppercase tracking-[0.1em] hidden lg:block text-f-charcoal/30">STRICTLY CONFIDENTIAL — DO NOT DISTRIBUTE OR COPY</div>}
        <div className="uppercase tracking-[0.2em] text-f-charcoal">{bankName}</div>
    </div>
);
