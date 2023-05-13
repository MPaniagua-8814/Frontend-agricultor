import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
	BASE_API_SAT = environment.BASE_API_SAT;
	URL_API_SEGURIDAD = this.BASE_API_SAT + '/sat-seguridad/tokens';

	constructor(private router: Router, private http: HttpClient) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {

		/**
		 * si la seguiridad esta inactiva no valida el token
		 */
		if (environment.seguridad === false) {
			console.warn('seguridad inactiva');
			return true;
		}

		/**
		 * si no existe token o si el guard no es de authorization
		 */
		if (
			sessionStorage.getItem('accessToken') == null ||
			sessionStorage.getItem('guard') !== 'Authorization'
		) {
			let tempState = state.url.split('?')[0];
			let params = JSON.stringify(state.root.queryParams)
			sessionStorage.setItem('pageRedirect', tempState);
			sessionStorage.setItem('pageRedirectParams', params);

			let tempUrl = window.location.href.split('?')[0];
			tempUrl = tempUrl.replace(tempState, '');
			console.log('temurl' + tempUrl);
			tempUrl = tempUrl + '/callback';
			tempUrl = tempUrl.replace('//callback', '/callback');
			console.log('temurl' + tempUrl);

			window.location.href =
				this.URL_API_SEGURIDAD + '?uri=' + tempUrl;

			return false;
		} else {
			return true;
		}
	}
}
