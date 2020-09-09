import {Injectable} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {environment} from "environment";
import {SubscriptionProvider} from "../common/subscription.provider";
import {ISubscription, PlanModel, ProductModel} from "../../models/subscription";
import {HttpProvider} from "./http.provider";

@Injectable()

export abstract class HttpSubscriptionsProvider extends HttpProvider<ISubscription> implements SubscriptionProvider{
    _baseUrl = environment.zoho_host;

    getProduct(id: number) {
        const url = `${this._baseUrl}/products/${id}`;
        return this._http.get<ProductModel>(url);
    }

    getPlan(id: number) {
        const url = `${this._baseUrl}/plans/${id}`;
        return this._http.get<PlanModel>(url);
    }

    getAllPlans(obj?: any){
        let url = `${this._baseUrl}/plans`;
        let params = {};
        if (obj) {
            params = new HttpParams({fromObject: obj});
        }
        return this._http.get<PlanModel[]>(url, {params});
    }
}



