import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const PageHero = ({
  eyebrow,
  title,
  subtitle,
  icon,
  children,
  className,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        "relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden",
        "bg-gradient-to-b from-white via-white to-gray-50",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {eyebrow && <p className="eyebrow-label mb-3">{eyebrow}</p>}
          <h1 className="text-section font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>
          )}
        </div>

        {children && (
          <div className="max-w-4xl mx-auto space-y-6">
            {children}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600/20 to-transparent" />
    </section>
  );
};

export default PageHero;
