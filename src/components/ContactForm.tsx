
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Message envoyé avec succès !');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notre Localisation */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Localisation
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Trouvez-nous sur la carte ci-dessous.
          </p>
          
          {/* Map placeholder - you can integrate with Google Maps or other map service */}
          <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-8">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Carte interactive à intégrer</p>
              <p className="text-sm text-gray-400">Center Rassoul Akram, Antananarivo</p>
            </div>
          </div>
        </div>

        {/* Nos Coordonnées */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Coordonnées
          </h2>
          <p className="text-lg text-gray-600">
            Nous sommes toujours disponibles pour répondre à vos questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
              <p className="text-gray-600 text-lg">0344679192</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600 text-lg">jao.lazabdallah83@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600 text-lg">Antananarivo</p>
            </CardContent>
          </Card>
        </div>

        {/* Envoyez-nous un Message */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Envoyez-nous un Message
            </h2>
            <p className="text-lg text-gray-600">
              Nous répondrons dès que possible.
            </p>
          </div>

          <Card className="p-8">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">
                      Nom Complet
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Votre Nom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Votre Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-base font-medium">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Sujet du Message"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-base font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="mt-2 resize-none"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                  >
                    Envoyer le Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
