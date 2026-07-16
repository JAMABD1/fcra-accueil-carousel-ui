
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const Coordonnees = () => {
  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: "jao.lazabdallah83@gmail.com",
      href: "mailto:jao.lazabdallah83@gmail.com",
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: "Antaniavo, Antohomadinika Antananarivo, Madagascar",
    },
    {
      icon: Phone,
      label: "Contact",
      value: "Prenez contact avec nous par email",
    },
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nous trouver"
          title="Notre localisation"
          subtitle="Visitez-nous ou contactez-nous — nous sommes à votre écoute."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {contactItems.map((item) => (
            <ScrollReveal key={item.label} delay={0.1}>
              <Card className="h-full card-lift hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="eyebrow-label mb-2">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-700 hover:text-green-600 transition-colors leading-relaxed"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{item.value}</p>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="w-full flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.771559011627!2d47.51122649678955!3d-18.897212899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07fb3654f9f8d%3A0xc51f3933f281a6a5!2sCenter%20Rassoul%20Akram!5e0!3m2!1sen!2smg!4v1751886185089!5m2!1sen!2smg"
              width="100%"
              height="450"
              style={{ border: 0, maxWidth: "900px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
              title="Localisation FCRA sur Google Maps"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Coordonnees;
