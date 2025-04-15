
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { authApi } from '@/services/apiService';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import EmailVerificationForm from './EmailVerificationForm';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'default' | 'forgotPassword' | 'resetPassword' | 'emailVerification';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // View state
  const [currentView, setCurrentView] = useState<ModalView>('default');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  
  // Verification state
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setshowRegisterPassword] = useState(false);
  const [showRegisterPasswordConfermid, setshowRegisterPasswordConfermid] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  /////// here edit
useEffect(() => {
  // Reset form fields when modal is closed
  if (!isOpen) {
    setTimeout(() => {
      setCurrentView('default');
    },300);
  }
}, [isOpen]);
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (!/[a-z]/.test(registerPassword)) {
      toast.error('Password must include at least one lowercase letter.');
      return;
    }
    if (!/[A-Z]/.test(registerPassword)) {
      toast.error('Password must include at least one uppercase letter.');
      return;
    }
    if (!/\d/.test(registerPassword)) {
      toast.error('Password must include at least one number.');
      return;
    }
    if (!/[@$!%*?&]/.test(registerPassword)) {
      toast.error('Password must include at least one special character (e.g., @$!%*?&).');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authApi.register(registerName, registerEmail, registerPassword);
      toast.success('Registration successful. Please verify your email.');
      
      // Set email for verification form
      setVerificationEmail(registerEmail);
      
      // Switch to email verification view
      setCurrentView('emailVerification');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      //toast.error(errorMessage);
      console.error('Registration error:', error);
      if(errorMessage.includes('email not Verified')){
        setVerificationEmail(registerEmail);
        setCurrentView('emailVerification')
        toast.error("Email need Verification");

        // toast.error(errorMessage);
      }
      if (errorMessage.includes('already exists')) {
        toast.info("You Can Login Email Registered And Verifieded")
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPasswordClick = () => {
    setCurrentView('forgotPassword');
  };
  
  const handleResetCodeSent = (email: string) => {
    setResetEmail(email);
    setCurrentView('resetPassword');
  };
  
  const handleResetSuccess = () => {
    toast.success('Password reset successful. You can now log in with your new password.');
    setCurrentView('default');
  };
  
  const handleVerificationSuccess = async () => {
    try {
     // setCurrentView('default');
/////////// here edit
      //const response = await authApi.login(verificationEmail, registerPassword);
      await authApi.login(verificationEmail, registerPassword);
      //console.log('Login response:', response.token);
      //localStorage.setItem('authtoken', response.token);
      toast.success('Account verified and logged in successfully');
      onClose();
    } catch (error) {
      toast.error('Account verified. Please log in with your credentials.');
      setCurrentView('default');
    }
  };
  
  const handleCancel = () => {
    setCurrentView('default');
  };
  
  // Conditional rendering based on currentView
  if (currentView === 'forgotPassword') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <ForgotPasswordForm 
            onCodeSent={handleResetCodeSent} 
            onCancel={handleCancel} 
          />
        </DialogContent>
      </Dialog>
    );
  }
  
  if (currentView === 'resetPassword') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <ResetPasswordForm 
            email={resetEmail} 
            onResetSuccess={handleResetSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }
  
  if (currentView === 'emailVerification') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <EmailVerificationForm 
            email={verificationEmail}
            onVerificationSuccess={handleVerificationSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <DialogHeader>
              <DialogTitle>Login to your account</DialogTitle>
              <DialogDescription>
                Enter your credentials below to access your account.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input 
          id="password" 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
          className="pr-10" // make space for the icon
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>
    </div>
              
              <div className="text-right">
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto font-normal"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Don't have an account? 
                
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto font-normal"
                  onClick={() => setCurrentView('default')}
                >
                  <TabsList className="bg-transparent" >
            <TabsTrigger value="register"  className="bg-transparent text-blue-500 hover:bg-transparent focus:bg-transparent border-none shadow-none">Register</TabsTrigger>
          </TabsList>
                 
                </Button>
                
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <DialogHeader>
              <DialogTitle>Create an account</DialogTitle>
              <DialogDescription>
                Sign up to start shopping and manage your orders.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Name</Label>
                <Input 
                  id="register-name" 
                  type="text" 
                  placeholder="Enter your name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                <Input 
                  id="register-password" 
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)} 
                  required
                  className="pr-10" // make space for the icon
                />
                <button
                type="button"
                onClick={() => setshowRegisterPassword(!showRegisterPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                tabIndex={-1}
                >
                {showRegisterPassword ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
                </button>
                </div>
                
              </div>
               
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                <Input 
                  id="confirm-password" 
                  type={showRegisterPasswordConfermid ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                  className="pr-10" // make space for the icon

                />
                <button
                type="button"
                onClick={() => setshowRegisterPasswordConfermid(!showRegisterPasswordConfermid)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                tabIndex={-1}
 
                >
               {showRegisterPasswordConfermid ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
                </button>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Register'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
