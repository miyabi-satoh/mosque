import i18next from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';

i18next.init({
	lng: 'ja',
	resources: {
		ja: { translation }
	}
});
z.setErrorMap(makeZodI18nMap({ t: i18next.t, ns: 'translation' }));

export { z };
