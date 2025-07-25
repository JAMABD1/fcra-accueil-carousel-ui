
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    // Use Supabase Auth for sign-in
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (!error) {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue!",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header with logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Espace Administrateur</h1>
            <p className="text-gray-600">Accédez au panneau de contrôle FCRA</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Connexion Sécurisée
              </CardTitle>
              <p className="text-gray-600 mt-2">Veuillez vous identifier pour continuer</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "L'email est requis",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email invalide"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Adresse email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="email" 
                              placeholder="admin@fcra.com" 
                              className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{ 
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 6,
                        message: "Le mot de passe doit contenir au moins 6 caractères"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connexion...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Se connecter
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
              
              {/* Footer */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  © 2025 FCRA. Plateforme sécurisée d'administration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
