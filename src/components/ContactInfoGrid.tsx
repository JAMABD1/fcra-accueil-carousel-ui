import { MapPin, Phone, Mail } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

interface ContactInfoGridProps {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  title?: string;
  subtitle?: string;
}

const items = [
  { key: "address" as const, icon: MapPin, label: "Adresse" },
  { key: "phone" as const, icon: Phone, label: "Téléphone" },
  { key: "email" as const, icon: Mail, label: "Email" },
];

const ContactInfoGrid = ({
  address,
  phone,
  email,
  title = "Nous contacter",
  subtitle = "N'hésitez pas à nous contacter pour plus d'informations.",
}: ContactInfoGridProps) => {
  const values = { address, phone, email };
  const visible = items.filter((item) => values[item.key]);
  if (visible.length === 0) return null;

  return (
    <section className="py-12 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} align="center" className="mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {visible.map((item, index) => {
            const Icon = item.icon;
            const value = values[item.key];
            return (
              <ScrollReveal key={item.key} delay={index * 0.08}>
                <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm card-lift h-full">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{item.label}</h3>
                  {item.key === "email" ? (
                    <a
                      href={`mailto:${value}`}
                      className="text-gray-600 text-sm hover:text-green-700 transition-colors break-all"
                    >
                      {value}
                    </a>
                  ) : item.key === "phone" ? (
                    <a
                      href={`tel:${value}`}
                      className="text-gray-600 text-sm hover:text-green-700 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed">{value}</p>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoGrid;
