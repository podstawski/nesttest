import { CloudDatastoreService } from "./cloud-datastore.service";
import { Optional } from '@nestjs/common';

export type Model<T extends BaseModel> = { new(...args: any[]): T } & { _name: string, cloudDatastoreService: CloudDatastoreService };

export class BaseModel {
    static cloudDatastoreService: CloudDatastoreService
    static _name: string;

    public async find(filter: object|undefined) {
        return this.getDataStore().find(this.getModelName(), filter);
    }

    public async findOne(filter: object|undefined) {
        return this.getDataStore().findOne(this.getModelName(), filter);
    }

    public async create(data: object) {
        return this.getDataStore().create(this.getModelName(),data);
    }

    public async update(filter:object, data: object) {
        return this.getDataStore().update(this.getModelName(),filter,data);
    }

    public getModelName() {
        return (<Model<BaseModel>>this.constructor)._name;
    }

    private getDataStore(){
        return (<Model<BaseModel>>this.constructor).cloudDatastoreService;
    }

}