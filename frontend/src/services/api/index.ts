/**
 * Ponto único de acesso a dados.
 * As telas importam sempre daqui: `import { api } from '@/services/api';`
 */
export { authApi } from './auth';
export { cultureApi } from './culture';
export { dailyApi } from './daily';
export { dictionaryApi } from './dictionary';
export { exercisesApi } from './exercises';
export { languagesApi } from './languages';
export { lessonsApi } from './lessons';
export { notificationsApi } from './notifications';
export { packsApi } from './packs';
export { progressApi } from './progress';
export { reviewApi } from './review';
export { socialApi } from './social';
export { vocabularyApi } from './vocabulary';

import { authApi } from './auth';
import { cultureApi } from './culture';
import { dailyApi } from './daily';
import { dictionaryApi } from './dictionary';
import { exercisesApi } from './exercises';
import { languagesApi } from './languages';
import { lessonsApi } from './lessons';
import { notificationsApi } from './notifications';
import { packsApi } from './packs';
import { progressApi } from './progress';
import { reviewApi } from './review';
import { socialApi } from './social';
import { vocabularyApi } from './vocabulary';

export const api = {
  auth: authApi,          // RF 1
  languages: languagesApi, // RF 2
  lessons: lessonsApi,     // RF 2 / 5
  vocabulary: vocabularyApi, // RF 3
  dictionary: dictionaryApi, // RF 4
  exercises: exercisesApi,   // RF 5
  review: reviewApi,         // RF 8
  progress: progressApi,     // RF 9
  social: socialApi,         // RF 10
  daily: dailyApi,           // RF 11
  culture: cultureApi,       // RF 12
  packs: packsApi,           // RF 13
  notifications: notificationsApi, // RF 14
};
