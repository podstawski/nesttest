"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CloudDatastoreService = exports.DATASTORE_CONFIG_TOKEN = void 0;
var datastore_1 = require("@google-cloud/datastore");
var common_1 = require("@nestjs/common");
exports.DATASTORE_CONFIG_TOKEN = 'DATASTORE_CONFIG_TOKEN';
var CloudDatastoreService = /** @class */ (function () {
    function CloudDatastoreService(datastoreConfig) {
        this.datastore = new datastore_1.Datastore(datastoreConfig);
    }
    CloudDatastoreService.prototype.extractIdFromFirstCommitResponse = function (response) {
        var _a, _b, _c;
        var firstCommitResult = response[0];
        return (_c = (_b = (_a = firstCommitResult === null || firstCommitResult === void 0 ? void 0 : firstCommitResult.mutationResults[0]) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.path[0]) === null || _c === void 0 ? void 0 : _c.id;
    };
    CloudDatastoreService.prototype.createEntityKey = function (kindName) {
        return this.datastore.key(kindName);
    };
    CloudDatastoreService.prototype.createEntityKeyWithId = function (kindName, id) {
        return this.datastore.key([kindName, Number(id)]);
    };
    CloudDatastoreService.prototype.createEntity = function (entityProperties, key) {
        var data = Object.assign(entityProperties, {
            createdAt: new Date().toJSON(),
            updatedAt: null,
            id: key.name
        });
        return {
            key: key,
            data: data
        };
    };
    CloudDatastoreService.hasFilter = function (_a) {
        var where = _a.where, order = _a.order, limit = _a.limit, fields = _a.fields, skip = _a.skip;
        return !!(where || limit || fields || order || skip);
    };
    CloudDatastoreService.prototype.create = function (model, data) {
        return __awaiter(this, void 0, void 0, function () {
            var key, entity, result, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.createEntityKey(model);
                        entity = this.createEntity(data, key);
                        return [4 /*yield*/, this.datastore.save(entity)];
                    case 1:
                        result = _a.sent();
                        id = this.extractIdFromFirstCommitResponse(result);
                        return [2 /*return*/, this.findById(model, id)];
                }
            });
        });
    };
    CloudDatastoreService.prototype.filter2query = function (kind, filter) {
        var query = this.datastore.createQuery(kind);
        if (filter.where) {
            for (var k in filter.where) {
                if (typeof filter.where[k] !== 'object') {
                    query.filter(k, '=', filter.where[k]);
                }
            }
        }
        return query;
    };
    CloudDatastoreService.prototype.addIdentifierToEachEntity = function (entities) {
        var _this = this;
        return entities.map(function (entity) {
            var id = entity[_this.datastore.KEY].id;
            return Object.assign(entity, { id: id });
        });
    };
    CloudDatastoreService.prototype.findById = function (model, id) {
        return __awaiter(this, void 0, void 0, function () {
            var key, entities, foundEntity, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.createEntityKeyWithId(model, id);
                        return [4 /*yield*/, this.datastore.get(key)];
                    case 1:
                        entities = _a.sent();
                        foundEntity = entities[0];
                        if (foundEntity) {
                            result = this.addIdentifierToEachEntity(entities);
                            return [2 /*return*/, Promise.resolve(result[0])];
                        }
                        return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    CloudDatastoreService.prototype.getAllEntity = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var query, entities, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = this.datastore.createQuery(model);
                        return [4 /*yield*/, query.run()];
                    case 1:
                        entities = _a.sent();
                        result = this.addIdentifierToEachEntity(entities[0]);
                        return [2 /*return*/, Promise.resolve(result)];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CloudDatastoreService.notAnArray = function (valueToCheck) {
        return !Array.isArray(valueToCheck);
    };
    CloudDatastoreService.generateOrderingObject = function (orderOption) {
        if (orderOption.toUpperCase() === 'DESC')
            return { descending: true };
        return { ascending: true };
    };
    CloudDatastoreService.addWhereFilterToQuery = function (query, filter) {
        var key = Object.keys(filter)[0];
        var value = Object.values(filter)[0];
        var isObject = typeof value === 'object';
        if (isObject) {
            return CloudDatastoreService.addComparisonFiltersToQuery(query, key, value);
        }
        return query.filter(key, '=', value);
    };
    CloudDatastoreService.prototype.getResultsWithQuery = function (model, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.buildQuery(model, filter);
                        return [4 /*yield*/, query.run()];
                    case 1:
                        entities = _a.sent();
                        return [2 /*return*/, this.addIdentifierToEachEntity(entities[0])];
                }
            });
        });
    };
    CloudDatastoreService.addComparisonFiltersToQuery = function (query, key, value) {
        var resultingQuery = query;
        for (var operation in value) {
            if (value.hasOwnProperty(operation)) {
                var comparison = value[operation];
                var operator = undefined;
                switch (operation) {
                    case 'lt':
                        operator = '<';
                        break;
                    case 'lte':
                        operator = '<=';
                        break;
                    case 'gt':
                        operator = '>';
                        break;
                    case 'gte':
                        operator = '>=';
                        break;
                    case 'ne':
                        operator = '!=';
                        break;
                    case 'in':
                        operator = 'in';
                        break;
                    default:
                        break;
                }
                resultingQuery = resultingQuery.filter(key, operator, comparison);
            }
        }
        return resultingQuery;
    };
    CloudDatastoreService.prototype.buildQuery = function (model, filters) {
        var _a;
        var where = filters.where, limit = filters.limit, skip = filters.skip, fields = filters.fields;
        var order = filters.order;
        var query = this.datastore.createQuery(model);
        // if 'where' filter is present, extract all the different conditions
        if (where) {
            for (var key in where) {
                if (where.hasOwnProperty(key)) {
                    var individualFilter = (_a = {}, _a[key] = where[key], _a);
                    query = CloudDatastoreService.addWhereFilterToQuery(query, individualFilter);
                }
            }
        }
        // determine if it's ASC or DESC and return the JS object matching that order
        if (order) {
            if (CloudDatastoreService.notAnArray(order)) {
                order = [order];
            }
            // fast exit if no order
            if (order.length < 1) {
                return;
            }
            for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
                var option = order_1[_i];
                // example:
                // order: 'price DESC',
                var _b = option.split(' '), property = _b[0], orderOption = _b[1];
                if (orderOption) {
                    query = query.order(property, CloudDatastoreService.generateOrderingObject(orderOption));
                }
                else {
                    console.error('No order provided for property. Please provide DESC or ASC sort order.');
                }
            }
        }
        // how many entities should be returned
        if (limit) {
            query = query.limit(limit);
        }
        // how many entities to skip for pagination
        if (skip) {
            query = query.offset(skip);
        }
        // which fields on an entity should be returned
        if (fields) {
            var selects = fields.filter(function (field) { return field === true; });
            query = query.select(selects);
        }
        return query;
    };
    CloudDatastoreService.prototype.update = function (model, filter, data) {
        return __awaiter(this, void 0, void 0, function () {
            var where, entities, newEntities, updateResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = filter.where;
                        if (!(filter && filter.id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateEntity(model, filter.id, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(where && where.id)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateEntity(model, where.id, data)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this.getResultsWithQuery(model, filter)];
                    case 5:
                        entities = _a.sent();
                        newEntities = entities.map(function (entity) {
                            return Object.assign(entity, data);
                        });
                        return [4 /*yield*/, this.datastore.update(newEntities)];
                    case 6:
                        updateResponse = (_a.sent());
                        return [2 /*return*/, entities];
                }
            });
        });
    };
    CloudDatastoreService.prototype.replaceById = function (model, id, data, _options, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.updateEntity(model, id, data)];
                    case 1:
                        result = _a.sent();
                        callback(null, result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2);
                        callback(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CloudDatastoreService.prototype.updateEntity = function (model, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var key, updateResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.createEntityKeyWithId(model, id);
                        delete data.id;
                        data.updatedAt = new Date().toJSON();
                        return [4 /*yield*/, this.datastore.update({
                                key: key,
                                data: data
                            })];
                    case 1:
                        updateResponse = (_a.sent());
                        return [2 /*return*/, this.findById(model, id)];
                }
            });
        });
    };
    CloudDatastoreService.prototype.find = function (model, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var where, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = filter && filter.where;
                        if (!(where && where.id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.findById(model, where.id)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(filter && CloudDatastoreService.hasFilter(filter))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getResultsWithQuery(model, filter)];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.getAllEntity(model)];
                    case 5:
                        result = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    CloudDatastoreService.prototype.findOne = function (model, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.find(model, filter)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result && result[0]];
                }
            });
        });
    };
    CloudDatastoreService.prototype.destroyAll = function (model, where) {
        return __awaiter(this, void 0, void 0, function () {
            var key, result, commitResult, deletedRows, result, keys, deleteResult, commitResult, deletedRows;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(where && where.id)) return [3 /*break*/, 2];
                        key = this.createEntityKeyWithId(model, where.id);
                        return [4 /*yield*/, this.datastore["delete"](key)];
                    case 1:
                        result = (_a.sent());
                        commitResult = result[0];
                        deletedRows = commitResult.mutationResults.length;
                        return [2 /*return*/, { count: deletedRows }];
                    case 2: return [4 /*yield*/, this.getAllEntity(model)];
                    case 3:
                        result = _a.sent();
                        keys = result.map(function (entity) {
                            return _this.createEntityKeyWithId(model, entity.id);
                        });
                        return [4 /*yield*/, this.datastore["delete"](keys)];
                    case 4:
                        deleteResult = _a.sent();
                        commitResult = deleteResult[0];
                        deletedRows = commitResult.mutationResults.length;
                        return [2 /*return*/, { count: deletedRows }];
                }
            });
        });
    };
    CloudDatastoreService.prototype.save = function (kind, nameOrId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var tuple, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datastore.save({
                            data: data,
                            key: this.datastore.key([kind, nameOrId])
                        })];
                    case 1:
                        tuple = _a.sent();
                        id = this.extractIdFromFirstCommitResponse(tuple);
                        console.log(kind, id);
                        return [2 /*return*/];
                }
            });
        });
    };
    CloudDatastoreService = __decorate([
        __param(0, (0, common_1.Optional)()),
        __param(0, (0, common_1.Inject)(exports.DATASTORE_CONFIG_TOKEN))
    ], CloudDatastoreService);
    return CloudDatastoreService;
}());
exports.CloudDatastoreService = CloudDatastoreService;
