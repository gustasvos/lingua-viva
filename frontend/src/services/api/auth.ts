/** RF 1 — Gestão de contas e autenticação. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { AuthSession, LoginPayload, RegisterPayload, User } from '../types';

const mockUser = (name: string, email: string): User => ({
  id: 'mock-user',
  name,
  email,
  avatar: '😊',
  createdAt: new Date().toISOString(),
});

const mockSession = (name: string, email: string): AuthSession => ({
  token: 'mock-token',
  user: mockUser(name, email),
});

export const authApi = {
  /** RF 1.1 */
  async register(payload: RegisterPayload): Promise<AuthSession> {
    if (USE_MOCK_API) return mockResponse(mockSession(payload.name, payload.email));
    return request<AuthSession>(endpoints.register, { method: 'POST', body: payload });
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    if (USE_MOCK_API) {
      const name = payload.email.split('@')[0] || 'Usuário';
      return mockResponse(mockSession(name, payload.email));
    }
    return request<AuthSession>(endpoints.login, { method: 'POST', body: payload });
  },

  /**
   * RF 1.2 — Firebase Authentication com Google.
   * TODO: instalar @react-native-google-signin/google-signin (ou expo-auth-session),
   * obter o idToken e enviá-lo para o backend trocar por uma sessão.
   */
  async loginWithGoogle(idToken?: string): Promise<AuthSession> {
    if (USE_MOCK_API) return mockResponse(mockSession('Usuário Google', 'google@exemplo.com'));
    return request<AuthSession>(endpoints.loginWithGoogle, {
      method: 'POST',
      body: { idToken },
    });
  },

  async me(): Promise<User> {
    if (USE_MOCK_API) return mockResponse(mockUser('Usuário', 'usuario@email.com'));
    return request<User>(endpoints.me);
  },

  async logout(): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined);
    await request(endpoints.logout, { method: 'POST' });
  },
};
