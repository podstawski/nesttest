"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var user_module_1 = require("./user/user.module");
var sendmail_module_1 = require("./common/sendmail.module");
var serve_static_1 = require("@nestjs/serve-static");
var cloud_datastore_module_1 = require("./common/cloud-datastore.module");
var axios_1 = require("@nestjs/axios");
var path_1 = require("path");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                serve_static_1.ServeStaticModule.forRoot({
                    rootPath: (0, path_1.join)(__dirname, '..', 'public')
                }),
                cloud_datastore_module_1.CloudDatastoreModule.forRoot({
                    keyFile: (0, path_1.join)(__dirname, '..', 'config', 'asystentos-f3c8a2d93711.json'),
                    projectId: 'asystentos',
                    namespace: process.env.NODE_ENV || 'stage'
                }),
                axios_1.HttpModule.register({
                    timeout: 60000,
                    maxRedirects: 5
                }),
                user_module_1.UserModule,
                sendmail_module_1.SendmailModule
            ],
            controllers: [],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
