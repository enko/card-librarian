/*!
 * @copyright Card Librarian Team 2020
 */

import { ExpressMiddlewareInterface, Middleware } from '@flyacts/routing-controllers';
import { Request, Response } from 'express';
import i18next from 'i18next';
import { Service } from 'typedi';

/**
 * Handle not found errors and show a error page
 */
@Middleware({ type: 'before' })
@Service()
export class ChangeLanguageMiddleware implements ExpressMiddlewareInterface {
    /**
     * Switch the language based on the request
     */
    public async use(
        request: Request,
        response: Response,
        next: () => unknown) {
        const acceptableLanguages = request.acceptsLanguages();

        if (acceptableLanguages.length === 0) {
            next();
            return;
        }

        const primaryLanguage = acceptableLanguages.shift();

        if (typeof primaryLanguage !== 'string') {
            next();
            return;
        }

        await i18next.changeLanguage(primaryLanguage);

        response.setHeader('Content-Language', i18next.language);

        next();
    }


}
