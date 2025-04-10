import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, MessageSquare } from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ 
  isOpen, 
  onClose,
  onVerificationSuccess
}) => {
  const { user, logout } = useAuth();
  const [step, setStep] = useState<'enterPhone' | 'verifyCode'>('enterPhone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const countryCodes = [
    { code: '+1', name: 'United States/Canada' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+91', name: 'India' },
    { code: '+61', name: 'Australia' },
    { code: '+52', name: 'Mexico' },
    { code: '+33', name: 'France' },
    { code: '+49', name: 'Germany' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+86', name: 'China' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+55', name: 'Brazil' },
    { code: '+7', name: 'Russia' },
    { code: '+27', name: 'South Africa' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+20', name: 'Egypt' },
    { code: '+234', name: 'Nigeria' },
    { code: '+254', name: 'Kenya' },
    { code: '+970', name: 'Palestine' },
    { code: '+972', name: 'Israeli occupation' },
  ];
  
  const sendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      // Fix the API call - provide all required parameters
      const response = await authApi.registerWithPhone(
        user.email ,
        fullPhoneNumber
      );
      
      if (response) {
        toast.success('Verification code sent via WhatsApp!');
        console.log('For demo: Verification code is', response.message);
        setStep('verifyCode');
      }
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
      console.error('Error sending verification code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const verifyPhoneNumber = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const response = await authApi.verifyphone(fullPhoneNumber, verificationCode);
      
      if (response) {
        toast.success('Phone number verified successfully!');
        
        // Update user data to reflect the verified phone
        
        
        onVerificationSuccess();
      }
    } catch (error) {
      toast.error('Verification failed. Please check the code and try again.');
      console.error('Error verifying phone:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setStep('enterPhone');
    setPhoneNumber('');
    setVerificationCode('');
    setIsSubmitting(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'enterPhone' ? 'Phone Verification' : 'Enter Verification Code'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'enterPhone' ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <p className="text-sm text-muted-foreground mb-2">
                We need to verify your phone number via WhatsApp before creating your order
              </p>
              
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Country Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  type="tel"
                  className="flex-1"
                />
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                A verification code will be sent to this number via WhatsApp
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={sendVerificationCode} 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Code via WhatsApp'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to {countryCode}{phoneNumber} via WhatsApp
              </p>
              
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={verificationCode} 
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                For demo purposes, check the console for the verification code
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep('enterPhone')}>
                Back
              </Button>
              <Button 
                onClick={verifyPhoneNumber} 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                {isSubmitting ? 'Verifying...' : 'Verify Phone Number'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneVerificationModal;
