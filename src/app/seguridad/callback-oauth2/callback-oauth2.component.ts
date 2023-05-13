import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SatSeguridadService } from 'src/app/services/sat_seguridad.service';
import { TokenOauth2 } from '../models/tokenoauth2.model';

@Component({
	selector: "app-callback-oauth2",
	templateUrl: "./callback-oauth2.component.html"
})
export class CallbackOauth2Component implements OnInit {
	token: TokenOauth2;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private sat_seguridad: SatSeguridadService
	) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.sat_seguridad
				.getToken(
					params["code"],
					window.location.href.split("?")[0],
					params["scope"]
				)
				.subscribe(data => {
					this.token = data;
					sessionStorage.setItem("accessToken", this.token.access_token);
					sessionStorage.setItem("refreshToken", this.token.refresh_token);
					sessionStorage.setItem("guard", "Authorization");

					this.redirectToPageRedirect();
				});
		});
	}

	redirectToPageRedirect() {
		var pageRedirect =
			sessionStorage.getItem("pageRedirect") || "/login";
		var pageRedirectParams = sessionStorage.getItem("pageRedirectParams");
		if (pageRedirectParams === null || pageRedirectParams === undefined) {
			this.router.navigate([pageRedirect]);
		} else {
			this.router.navigate([pageRedirect], {
				queryParams: JSON.parse(pageRedirectParams)
			});
		}

		sessionStorage.removeItem('pageRedirect');
		sessionStorage.removeItem('pageRedirectParams');

	}
}