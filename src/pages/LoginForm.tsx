import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, LogIn, Eye, EyeOff, Leaf, Utensils } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
  onSignUp: () => void;
}

export function LoginForm({ onLogin, onBack, onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(email, password);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100" />
      
      {/* Background Images */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-10 hidden md:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=150&h=150&fit=crop&crop=focalpoint"
          alt="Fresh salad"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-20 left-10 w-24 h-24 opacity-10 hidden md:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=100&h=100&fit=crop&crop=focalpoint"
          alt="Fresh herbs"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-700">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account to continue tracking your macros</p>
          </div>

          {/* Login Form */}
          <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-green-100"
                >
                  <ArrowLeft className="w-4 h-4 text-green-600" />
                </Button>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <LogIn className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-green-700">
                    Sign In
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-green-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-green-700">Demo Credentials</h4>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> demo123</p>
                  <p className="text-xs mt-2 text-gray-600">
                    You can use these credentials to test the app, or enter any email/password to continue.
                  </p>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onSignUp}
                    className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}