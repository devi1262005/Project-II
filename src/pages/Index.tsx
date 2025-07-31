import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Share2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Secure Notes App
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Create, organize, and share your notes with advanced security features. 
            Keep your thoughts private with encryption or share them publicly with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/auth">
                <Plus className="w-5 h-5 mr-2" />
                Get Started
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/auth">
                Sign In
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to manage your notes securely and efficiently
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">End-to-End Encryption</h3>
            <p className="text-muted-foreground">
              Protect your sensitive notes with AES encryption. Your data remains private and secure.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Public Sharing</h3>
            <p className="text-muted-foreground">
              Share your notes publicly with unique URLs while keeping others private.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">CRUD Operations</h3>
            <p className="text-muted-foreground">
              Create, read, update, and delete notes with a clean, intuitive interface.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users who trust our platform with their notes and ideas.
          </p>
          <Button size="lg" asChild>
            <a href="/auth">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Note
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
