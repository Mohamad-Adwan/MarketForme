
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/apiService';
import { toast } from 'sonner';

interface EmailVerificationFormProps {
  email: string;
  onVerificationSuccess: () => void;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({ 
  email,
  onVerificationSuccess
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await authApi.verifyEmail(email, verificationCode);
      toast.success('Email verified successfully!');
      onVerificationSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification code to {email}. 
          Please enter the code below to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              {/* For demo purposes, check the console for the verification code. */}
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
