import { Button } from '../components/ui/button';
import { Leaf } from 'lucide-react';
// Using a placeholder background instead of Figma asset
const backgroundImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onLogin, onSignUp }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 text-center">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl mb-4">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          NutriSense
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl drop-shadow-md">
          Track your nutrition with AI-powered macro analysis
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            onClick={onLogin}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white shadow-xl border-0 flex-1 h-12 sm:h-11"
          >
            SIGN IN
          </Button>
          <Button
            onClick={onSignUp}
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm shadow-xl flex-1 h-12 sm:h-11"
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
}
