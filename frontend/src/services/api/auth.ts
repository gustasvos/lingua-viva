/** RF 1 — Gestão de contas e autenticação. */
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { firebaseAuth, GoogleAuthProvider, signInWithCredential } from '../firebase';
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

/** Formato real da resposta do backend (login, google e, futuramente, register). */
type BackendSession = {
  accessToken: string;
  refreshToken: string;
  usuario: { id: string; nome: string; email: string; avatarUrl: string | null };
};

function toAuthSession(response: BackendSession): AuthSession {
  return {
    token: response.accessToken,
    refreshToken: response.refreshToken,
    user: {
      id: response.usuario.id,
      name: response.usuario.nome,
      email: response.usuario.email,
      avatar: response.usuario.avatarUrl ?? '😊',
    },
  };
}

export const authApi = {
  /** RF 1.1 */
  async register(payload: RegisterPayload): Promise<AuthSession> {
    if (USE_MOCK_API) return mockResponse(mockSession(payload.name, payload.email));

    await request(endpoints.register, {
      method: 'POST',
      body: { nome: payload.name, email: payload.email, senha: payload.password },
    });

    return authApi.login({ email: payload.email, password: payload.password });
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    if (USE_MOCK_API) {
      const name = payload.email.split('@')[0] || 'Usuário';
      return mockResponse(mockSession(name, payload.email));
    }
    const response = await request<BackendSession>(endpoints.login, {
      method: 'POST',
      body: { email: payload.email, senha: payload.password },
    });
    return toAuthSession(response);
  },

  /**
   * RF 1.2 — Firebase Authentication com Google.
   * pega o token do Google no device, troca por sessão do Firebase, manda pro backend.
   */
  async loginWithGoogle(): Promise<AuthSession> {
    if (USE_MOCK_API) return mockResponse(mockSession('Usuário Google', 'google@exemplo.com'));

    await GoogleSignin.hasPlayServices();

    // força a escolher outra conta do google 
    await GoogleSignin.signOut();

    // debug do token
    const result = await GoogleSignin.signIn()
    console.log('GOOGLE SIGN IN RESULT:', result)
    const { idToken } = result.data ?? {};

    if (!idToken) throw new Error('Não foi possível obter o token do Google.');

    const credential = GoogleAuthProvider.credential(idToken);
    const { user } = await signInWithCredential(firebaseAuth, credential);
    const firebaseIdToken = await user.getIdToken();

    const response = await request<BackendSession>(endpoints.loginWithGoogle, {
      method: 'POST',
      body: { idToken: firebaseIdToken },
    });
    return toAuthSession(response);
  },

  async me(): Promise<User> {
    // TODO: backend ainda não tem GET /auth/me. Não é chamado em nenhum lugar
    // hoje — a sessão é restaurada do AsyncStorage, não do servidor.
    if (USE_MOCK_API) return mockResponse(mockUser('Usuário', 'usuario@email.com'));
    return request<User>(endpoints.me);
  },

  async logout(refreshToken?: string): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined);
    await request(endpoints.logout, { method: 'POST', body: { refreshToken } });
  },
};
