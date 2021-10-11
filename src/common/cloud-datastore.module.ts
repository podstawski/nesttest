import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';
import { CloudDatastoreService, DATASTORE_CONFIG_TOKEN } from './cloud-datastore.service';

export type DatastoreModuleOptions = {
    keyFile?: string;
    projectId?: string;
    namespace?: string;
};


@Module({
            providers: [CloudDatastoreService],
            exports: [CloudDatastoreService],
})
export class CloudDatastoreModule {


    /**
     * Pass a custom configuration to `Datastore` constructor
     *
     * @param options Configuration for the `Datastore` class from `@google-cloud/datastore`.
     *
     * @return a `DynamicModule` based on `CloudDatastoreModule`.
     */
    static forRoot(options: DatastoreModuleOptions): DynamicModule {
        return {
            module: CloudDatastoreModule,
            global:true,
            providers: [
                {
                    provide: DATASTORE_CONFIG_TOKEN,
                    useValue: options,
                },
            ],
            exports:[
                {
                    provide: DATASTORE_CONFIG_TOKEN,
                    useValue: options,
                },
            ]
        };
    }


}