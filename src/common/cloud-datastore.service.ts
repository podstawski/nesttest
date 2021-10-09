import { Datastore } from '@google-cloud/datastore';
import { Inject, Optional } from '@nestjs/common';
import { entity, Entity as DataStoreEntity } from '@google-cloud/datastore/build/src/entity'
import { Query } from '@google-cloud/datastore/build/src/query'
import { DatastoreModuleOptions } from './cloud-datastore.module';


export const DATASTORE_CONFIG_TOKEN = 'DATASTORE_CONFIG_TOKEN';


type GCPDataStoreEntity = DataStoreEntity
type EntityKey = entity.Key
type Filter = { [key: string]: any }
type OrderQuery = {
    ascending?: boolean
    descending?: boolean
}


export class CloudDatastoreService {
    private readonly datastore: Datastore;

    constructor(@Optional() @Inject(DATASTORE_CONFIG_TOKEN) datastoreConfig: DatastoreModuleOptions) {
        console.log('datastoreConfig@constructor',datastoreConfig||'O KURWA, NIE MA CONFIG-a');
        this.datastore = new Datastore(datastoreConfig);
    }

    private extractIdFromFirstCommitResponse(
        response: [any],
    ): string | number {
        const firstCommitResult = response[0]
        return firstCommitResult?.mutationResults[0]?.key?.path[0]?.id;
    }

    private createEntityKey(kindName: string): EntityKey {
        return this.datastore.key(kindName)
    }


    private createEntityKeyWithId(kindName: string, id: string|number): EntityKey {
        return this.datastore.key([kindName, Number(id)])
    }

    private createEntity(entityProperties: object, key: EntityKey): GCPDataStoreEntity {
        const data = Object.assign(entityProperties, {
            createdAt: new Date().toJSON(),
            updatedAt: null,
            id: key.name,
        })
        return {
            key,
            data,
        }
    }

    private static hasFilter({ where, order, limit, fields, skip }: Filter): boolean {
        return !!(where || limit || fields || order || skip)
    }


    async create(
        model: string,
        data: object
    ): Promise<GCPDataStoreEntity> {
        const key = this.createEntityKey(model)
        const entity = this.createEntity(data, key);
        const result = await this.datastore.save(entity);
        const id = this.extractIdFromFirstCommitResponse(result);

        return this.findById(model,id);
    }

    private filter2query(kind, filter) {
        const query = this.datastore.createQuery(kind);
        if (filter.where) {
            for (let k in filter.where) {
                if (typeof filter.where[k] !== 'object') {
                    query.filter(k, '=', filter.where[k]);
                }
            }
        }

        return query;
    }

    addIdentifierToEachEntity(entities): Array<GCPDataStoreEntity> {
        return entities.map((entity) => {
            const id = entity[this.datastore.KEY].id
            return Object.assign(entity, { id })
        })
    }


    async findById(model: string, id: string|number): Promise<Array<GCPDataStoreEntity>> {
        const key = this.createEntityKeyWithId(model, id)

        const entities = await this.datastore.get(key);
        const foundEntity = entities[0];

        if (foundEntity) {
            const result = this.addIdentifierToEachEntity(entities)
            return Promise.resolve(result[0]);
        }

        return Promise.resolve([]);
    }


    private async getAllEntity(model) {
        try {
            const query = this.datastore.createQuery(model)
            const entities = await query.run()
            const result = this.addIdentifierToEachEntity(entities[0])
            return Promise.resolve(result)
        } catch (error) {
            console.error(error)
        }
    }


    private static notAnArray(valueToCheck: any): boolean {
        return !Array.isArray(valueToCheck)
    }

    private static generateOrderingObject(orderOption): OrderQuery {
        if (orderOption.toUpperCase() === 'DESC') return { descending: true }
        return { ascending: true }
    }

    private static addWhereFilterToQuery(query: Query, filter: Filter): Query {
        const key = Object.keys(filter)[0]
        const value = Object.values(filter)[0]

        const isObject = typeof value === 'object'

        if (isObject) {
            return CloudDatastoreService.addComparisonFiltersToQuery(query, key, value)
        }

        return query.filter(key, '=', value)
    }

    private async getResultsWithQuery(model, filter): Promise<Array<GCPDataStoreEntity>> {
        const query = this.buildQuery(model, filter)
        const entities = await query.run()
        return this.addIdentifierToEachEntity(entities[0])
    }

    private static addComparisonFiltersToQuery(query: Query, key: string, value: any): Query {
        let resultingQuery = query

        for (const operation in value) {
            if (value.hasOwnProperty(operation)) {
                const comparison = value[operation]
                let operator = undefined
                switch (operation) {
                    case 'lt':
                        operator = '<'
                        break
                    case 'lte':
                        operator = '<='
                        break
                    case 'gt':
                        operator = '>'
                        break
                    case 'gte':
                        operator = '>='
                        break
                    case 'ne':
                        operator = '!='
                        break
                    case 'in':
                        operator = 'in'
                        break
                    default:
                        break
                }
                resultingQuery = resultingQuery.filter(key, operator, comparison)
            }
        }

        return resultingQuery
    }

    private buildQuery(model: string, filters): Query {
        const { where, limit, skip, fields } = filters
        let { order } = filters

        let query = this.datastore.createQuery(model)

        // if 'where' filter is present, extract all the different conditions
        if (where) {
            for (const key in where) {
                if (where.hasOwnProperty(key)) {
                    const individualFilter: Filter = { [key]: where[key] }
                    query = CloudDatastoreService.addWhereFilterToQuery(query, individualFilter)
                }
            }
        }

        // determine if it's ASC or DESC and return the JS object matching that order
        if (order) {
            if (CloudDatastoreService.notAnArray(order)) {
                order = [order]
            }

            // fast exit if no order
            if (order.length < 1) {
                return
            }

            for (const option of order) {
                // example:
                // order: 'price DESC',
                const [property, orderOption] = option.split(' ')
                if (orderOption) {
                    query = query.order(property, CloudDatastoreService.generateOrderingObject(orderOption))
                } else {
                    console.error('No order provided for property. Please provide DESC or ASC sort order.')
                }
            }
        }

        // how many entities should be returned
        if (limit) {
            query = query.limit(limit)
        }

        // how many entities to skip for pagination
        if (skip) {
            query = query.offset(skip)
        }

        // which fields on an entity should be returned
        if (fields) {
            const selects = fields.filter((field) => field === true)
            query = query.select(selects)
        }

        return query
    }


    async update(
        model: string,
        filter: Filter,
        data,
    ) {

        const { where } = filter

        if (filter && filter.id) {
            return await this.updateEntity(model, filter.id, data);
        }

        else if (where && where.id) {
            return await this.updateEntity(model, where.id, data);
        }

        const entities = await this.getResultsWithQuery(model, filter);

        const newEntities = entities.map((entity: GCPDataStoreEntity) => {
            return Object.assign(entity, data)
        })
        // Update those entities
        const updateResponse = (await this.datastore.update(newEntities))
        return entities;
    }




    async replaceById(model, id, data, _options, callback) {
        try {
            const result = await this.updateEntity(model, id, data)
            callback(null, result)
        } catch (error) {
            console.error(error)
            callback(error)
        }
    }

    private async updateEntity(model: string, id: string|number, data: GCPDataStoreEntity): Promise<GCPDataStoreEntity|null> {
        const key = this.createEntityKeyWithId(model, id)
        delete data.id;
        data.updatedAt = new Date().toJSON();
        const updateResponse = (await this.datastore.update({
            key,
            data,
        }));

        return this.findById(model,id);
    }

    async find(model: string, filter: Filter): Promise<[GCPDataStoreEntity]> {

        const where = filter && filter.where;

        let result;

        if (where && where.id) {
            result = await this.findById(model, where.id)
        } else if (filter && CloudDatastoreService.hasFilter(filter)) {
            result = await this.getResultsWithQuery(model, filter)
        } else {
            result = await this.getAllEntity(model)
        }

        return result;
    }

    async findOne(model: string, filter: Filter): Promise<GCPDataStoreEntity> {

        let result = await this.find(model,filter);

        return result && result[0];
    }

    async destroyAll(model: string, where: Filter) {

        if (where && where.id) {
            const key = this.createEntityKeyWithId(model, where.id)
            const result = (await this.datastore.delete(key))
            const commitResult = result[0]
            const deletedRows = commitResult.mutationResults.length

            return { count: deletedRows };
        } else {
            const result = await this.getAllEntity(model)
            const keys = result.map((entity: GCPDataStoreEntity) => {
                return this.createEntityKeyWithId(model, entity.id)
            })
            const deleteResult = await this.datastore.delete(keys)
            const commitResult = deleteResult[0]
            const deletedRows = commitResult.mutationResults.length

            return { count: deletedRows };
        }

    }



    async save<T extends any>(kind: string, nameOrId: string | number | undefined, data: T) {
        const tuple = await this.datastore.save({
            data,
            key: this.datastore.key([kind, nameOrId]),
        });
        const id=this.extractIdFromFirstCommitResponse(tuple);

        console.log(kind,id);
    }

}