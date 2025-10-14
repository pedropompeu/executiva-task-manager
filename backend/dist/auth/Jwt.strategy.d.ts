import { Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: {
        email: string;
        sub: string;
    }): Promise<User>;
}
export {};
