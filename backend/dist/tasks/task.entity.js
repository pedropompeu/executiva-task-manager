"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = void 0;
const user_entity_1 = require("../auth/user.entity");
const typeorm_1 = require("typeorm");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDENTE";
    TaskStatus["IN_PROGRESS"] = "EM ANDAMENTO";
    TaskStatus["DONE"] = "CONCLU\u00CDDA";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let Task = class Task {
    id;
    titulo;
    descricao;
    status;
    dataCriacao;
    dataConclusao;
    user;
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Task.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'data_criacao' }),
    __metadata("design:type", Date)
], Task.prototype, "dataCriacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_conclusao', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "dataConclusao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.tasks, { eager: false }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "user", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks' })
], Task);
//# sourceMappingURL=task.entity.js.map