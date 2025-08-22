import { useState } from 'react';
import { User, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { rdpService } from '@/services/rdpService';
import { LoginCredentials } from '@/types/system';

export const LoginScreen = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'login' | 'connecting' | 'success'>('login');
  const { toast } = useToast();

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha usuário e senha",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoginStep('connecting');

    try {
      // Iniciar conexão RDP diretamente
      const rdpResult = await rdpService.connectRDP(credentials);
      
      if (rdpResult.status === 'connected') {
        setLoginStep('success');
        toast({
          title: "Conexão estabelecida",
          description: "Conectado ao servidor remoto com sucesso",
        });
      } else {
        throw new Error(rdpResult.message || 'Falha na conexão RDP');
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar aos servidores",
        variant: "destructive",
      });
      setLoginStep('login');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepMessage = () => {
    switch (loginStep) {
      case 'connecting':
        return 'Estabelecendo conexão remota...';
      case 'success':
        return 'Conexão estabelecida com sucesso!';
      default:
        return '';
    }
  };

  const getStepIcon = () => {
    switch (loginStep) {
      case 'connecting':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20" />
      
      <Card className="w-full max-w-md relative z-10 bg-login-card backdrop-blur-sm border-0 shadow-2xl animate-fade-in">
        <CardContent className="p-8">
          {/* User Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Bem-vindo
            </h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nome de usuário"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="pl-12"
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status Message */}
            {loginStep !== 'login' && (
              <div className="flex items-center justify-center space-x-2 py-3">
                {getStepIcon()}
                <span className="text-sm text-muted-foreground">
                  {getStepMessage()}
                </span>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="windows"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* System Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Servidor RDP: {rdpService.getRDPServerInfo().server}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};