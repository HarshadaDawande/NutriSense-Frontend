import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, UserPlus, Eye, EyeOff, Leaf, Apple, Target, Zap } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import axios from 'axios';
interface SignupScreenProps {
  onBackToLogin: () => void;
  onBackToWelcome: () => void;
}

export function SignupScreen({ onBackToLogin, onBackToWelcome }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    userName: '',
    emailAddress: '',
    isFirstTimeUser: 'true',
    hasSetTargets: 'false',
    password: '',
    confirmPassword: ''
  });
  const [errMessage, setErrMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const doSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8080/v1/user', formData);
      return response; // Return successful response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setErrMessage("User already exists! Email address is already registered.");
        } else {
          setErrMessage(`Error: ${error.response.data?.message || 'Something went wrong'}`);
        }
      } else {
        setErrMessage("An unexpected error occurred");
      }
      console.error('Error during signup:', error);
      throw error; // Re-throw the error so it can be caught in handleSubmit
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userName && formData.emailAddress) {
      setIsLoading(true);
      setErrMessage(""); // Clear any previous error messages
      try {
        // Simulate signup process
        await new Promise(resolve => setTimeout(resolve, 1000));
        await doSignup();
        // Show success dialog instead of redirecting immediately
        setRegistrationSuccess(true);
        // Wait 3 seconds then redirect to login
        setTimeout(() => {
          onBackToLogin(); // Redirect to welcome screen instead of onboarding
        }, 3000);
      } catch (error) {
        // Error is already handled in doSignup
        console.error("Error in handleSubmit:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Success dialog component
  const SuccessDialog = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Show success dialog when registration is successful */}
      {registrationSuccess && <SuccessDialog />}
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100" />

      {/* Background Images */}
      <div className="absolute top-10 right-10 w-40 h-40 opacity-8 hidden lg:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=200&h=200&fit=crop&crop=focalpoint"
          alt="Fresh herbs and spices"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-8 hidden lg:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=150&h=150&fit=crop&crop=focalpoint"
          alt="Colorful vegetables"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Apple className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-700">
              Join NutriSense
            </h1>
            <p className="text-gray-600 mt-2">Start your balanced nutrition journey today</p>
          </div>

          {/* App Description */}
          <Card className="bg-green-50 border border-green-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Why NutriSense?
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Set personalized macro targets based on your goals</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI-powered meal analysis calculates macros automatically</span>
                </div>
                <div className="flex items-start gap-2">
                  <Apple className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Track your daily intake with beautiful, intuitive charts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signup Form */}
          <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onBackToWelcome}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-green-100"
                >
                  <ArrowLeft className="w-4 h-4 text-green-600" />
                </Button>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <UserPlus className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-green-700">
                    Create Account
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2" style={{color : "red"}}>{errMessage}</div>
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-gray-700">Username</Label>
                  <Input
                    id="userName"
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    placeholder="Enter your username"
                    className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress" className="text-gray-700">Email</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                    placeholder="Enter your email address"
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                      disabled={true}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                      disabled={true}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-green-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account & Start Tracking
                    </>
                  )}
                </Button>
              </form>

              {/* Next Steps Preview */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-green-700">What's Next?</h4>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>1. Set your personalized macro targets</p>
                  <p>2. Log your first meal with AI analysis</p>
                  <p>3. Start tracking your balanced nutrition journey</p>
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={onBackToLogin}
                    className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500"
                  >
                    Sign in here
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
