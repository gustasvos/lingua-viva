/** RF 14 — Notificações e relatório semanal. */
import { USE_MOCK_API } from '../config';
import { endpoints } from '../endpoints';
import { mockResponse, request } from '../http';
import { NOTIFICATION_PREVIEWS } from '../mock/data';
import { NotificationPreview, NotificationSettings } from '../types';

const defaults: NotificationSettings = {
  enabled: true,
  reminderTime: '18:00',
  frequency: 'daily',
  weeklyReportEmail: true,
};

export const notificationsApi = {
  async settings(): Promise<NotificationSettings> {
    if (USE_MOCK_API) return mockResponse(defaults, 120);
    return request<NotificationSettings>(endpoints.notificationSettings);
  },

  /**
   * RF 14.1 — salva as preferências de lembrete.
   * TODO: agendar as notificações locais com expo-notifications e registrar o
   * push token no backend.
   */
  async updateSettings(settings: NotificationSettings): Promise<void> {
    if (USE_MOCK_API) return mockResponse(undefined, 120);
    await request(endpoints.notificationSettings, { method: 'PUT', body: settings });
  },

  async previews(): Promise<NotificationPreview[]> {
    if (USE_MOCK_API) return mockResponse(NOTIFICATION_PREVIEWS, 120);
    return request<NotificationPreview[]>(endpoints.notificationPreviews);
  },
};
