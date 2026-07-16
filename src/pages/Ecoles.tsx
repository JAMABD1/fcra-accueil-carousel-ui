
import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import EntityListingCard from "@/components/EntityListingCard";
import { useQuery } from "@tanstack/react-query";
import { getSchools } from "@/lib/db/queries";
import { GraduationCap } from "lucide-react";

interface School {
  id: string;
  name: string;
  description: string | null;
  type: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tagId: string | null;
  videoId: string | null;
  active: boolean | null;
  sortOrder: number | null;
  subtitle: string | null;
  coordonneId: string | null;
}

const Ecoles = () => {

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools-public'],
    queryFn: async () => {
      return await getSchools({ status: 'published' });
    }
  });



  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        eyebrow="Éducation"
        title="Nos Écoles"
        subtitle="Découvrez nos établissements scolaires dédiés à l'excellence éducative et au développement de chaque élève."
        icon={<GraduationCap className="h-8 w-8 text-green-600 shrink-0" />}
      />

      <section className="py-16 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, index) => (
              <ScrollReveal key={school.id} delay={index * 0.06}>
                <EntityListingCard
                  id={school.id}
                  name={school.name}
                  description={school.description}
                  subtitle={school.subtitle}
                  badge={school.type}
                  imageUrl={school.image_url}
                  href={`/ecoles/${school.slug}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ecoles;
