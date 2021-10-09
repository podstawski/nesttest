import { CloudDatastoreService } from "./cloud-datastore.service";

export type Model<T extends BaseModel> = { new(...args: any[]): T } & { _name: string, cloudDatastoreService: CloudDatastoreService };

export class BaseModel {
    static cloudDatastoreService: CloudDatastoreService
    static _name: string;

    public find() {
        return this.getDataStore().find(this.getModelName(), null);
    }

    public getModelName() {
        return (<Model<BaseModel>>this.constructor)._name;
    }

    private getDataStore(){
        return (<Model<BaseModel>>this.constructor).cloudDatastoreService;
    }

}