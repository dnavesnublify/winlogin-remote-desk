import { LoginCredentials, RDPConnection } from '@/types/system';
import { SystemConfig } from '@/types/system';
import systemConfig from '@/config/system.json';

class RDPService {
  private config: SystemConfig = systemConfig;

  async connectRDP(credentials: LoginCredentials): Promise<RDPConnection> {
    try {
      console.log('Iniciando conexão RDP...');
      console.log(`Servidor RDP: ${this.config.rdpServer.server}`);
      console.log(`Porta: ${this.config.rdpServer.port || 3389}`);
      console.log(`Usuário: ${credentials.username}`);

      // Constrói o comando freerdp2
      const freerdpCommand = this.buildFreerdpCommand(credentials);
      console.log('Comando freerdp:', freerdpCommand);

      // Simula a execução do comando
      // Em um ambiente real, isso executaria o comando via child_process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Para demonstração, simula sucesso
      return {
        status: 'connected',
        message: 'Conexão RDP estabelecida com sucesso'
      };

    } catch (error) {
      console.error('Erro na conexão RDP:', error);
      return {
        status: 'failed',
        message: 'Falha ao estabelecer conexão RDP'
      };
    }
  }

  private buildFreerdpCommand(credentials: LoginCredentials): string {
    const { server, port } = this.config.rdpServer;
    const freerdpPath = this.config.freerdpPath || '/usr/bin/xfreerdp';
    
    const baseCommand = `${freerdpPath}`;
    const serverParam = `/v:${server}:${port || 3389}`;
    const userParam = `/u:${credentials.username}`;
    const domainParam = `/d:${this.config.activeDirectory.domain}`;
    
    // Parâmetros obrigatórios conforme especificado
    const requiredParams = [
      '/cert-ignore',
      '/a:drive,media,/media',
      '/sound',
      '/microphone', 
      '/printer'
    ];

    const allParams = [
      baseCommand,
      serverParam,
      userParam,
      domainParam,
      ...requiredParams
    ];

    return allParams.join(' ');
  }

  getRDPServerInfo() {
    return {
      server: this.config.rdpServer.server,
      port: this.config.rdpServer.port || 3389
    };
  }
}

export const rdpService = new RDPService();