
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const Coordonnees = () => {
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
          
          {/* Google Maps Embed */}
          <div className="w-full flex justify-center mb-8">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.771559011627!2d47.51122649678955!3d-18.897212899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07fb3654f9f8d%3A0xc51f3933f281a6a5!2sCenter%20Rassoul%20Akram!5e0!3m2!1sen!2smg!4v1751886185089!5m2!1sen!2smg" 
              width="100%" 
              height="450" 
              style={{border: 0, maxWidth: '800px'}} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

 
      </div>
    </section>
  );
};

export default Coordonnees;
