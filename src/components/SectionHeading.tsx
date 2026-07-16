interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) => {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-12 max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && <p className="eyebrow-label mb-3">{eyebrow}</p>}
      <h2 className="text-section font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
