import { LoginCredentials, AuthResult } from '@/types/system';
import { SystemConfig } from '@/types/system';
import systemConfig from '@/config/system.json';

class AuthService {
  private config: SystemConfig = systemConfig;

  async validateCredentials(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Simulação da validação no Active Directory
      // Em um ambiente real, isso seria uma chamada para o AD via LDAP
      console.log(`Validating credentials for user: ${credentials.username}`);
      console.log(`Against AD server: ${this.config.activeDirectory.server}`);
      console.log(`Domain: ${this.config.activeDirectory.domain}`);

      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Para demonstração, aceita qualquer usuário com senha "123456"
      // Em produção, isso seria substituído por validação real do AD
      if (credentials.password === '123456') {
        return {
          success: true,
          message: 'Credenciais válidas'
        };
      } else {
        return {
          success: false,
          message: 'Usuário ou senha incorretos'
        };
      }
    } catch (error) {
      console.error('Erro na validação de credenciais:', error);
      return {
        success: false,
        message: 'Erro ao conectar com o servidor de autenticação'
      };
    }
  }

  getADServerInfo() {
    return {
      server: this.config.activeDirectory.server,
      domain: this.config.activeDirectory.domain,
      port: this.config.activeDirectory.port || 389
    };
  }
}

export const authService = new AuthService();