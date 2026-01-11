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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const user_entity_1 = require("../users/entities/user.entity");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
let TasksController = class TasksController {
    constructor(tasksRepository, usersRepository, jwtService, tasksService) {
        this.tasksRepository = tasksRepository;
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.tasksService = tasksService;
    }
    async authenticateRequest(req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing token');
        }
        const token = authHeader.substring(7);
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid user');
            return user;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async create(createTaskDto, req) {
        const user = await this.authenticateRequest(req);
        const task = await this.tasksService.create(createTaskDto, user);
        const { id, title, status, createdAt } = task;
        return { id, title, status, created_at: createdAt };
    }
    async findAll(req, page = 1, limit = 10) {
        const user = await this.authenticateRequest(req);
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const take = Math.min(limitNumber, 100);
        const skip = (pageNumber - 1) * take;
        const [tasks, total] = await this.tasksRepository.findAndCount({
            where: { user: { id: user.id } },
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
        return {
            data: tasks.map(({ id, title, status, createdAt }) => ({
                id,
                title,
                status,
                created_at: createdAt,
            })),
            meta: {
                total,
                page: pageNumber,
                per_page: take,
                last_page: Math.ceil(total / take),
            },
        };
    }
    async updateStatus(id, updateDto, req) {
        const user = await this.authenticateRequest(req);
        const task = await this.tasksService.updateStatus(id, updateDto.status, user);
        return { id: task.id, status: task.status };
    }
    async delete(id, req) {
        const user = await this.authenticateRequest(req);
        await this.tasksService.delete(id, user);
        return { message: 'Task deleted' };
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.UpdateTaskStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "delete", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map