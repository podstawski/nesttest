import {CloudDatastoreService} from "./cloud-datastore.service";

export const Model = (model: string) => {
    return (destinationClass) => {
        destinationClass._name = model;
    }

}

