export interface SystemConfig {
  activeDirectory: {
    server: string;
    domain: string;
    port?: number;
  };
  rdpServer: {
    server: string;
    port?: number;
  };
  freerdpPath?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface RDPConnection {
  status: 'connecting' | 'connected' | 'failed' | 'disconnected';
  message?: string;
}