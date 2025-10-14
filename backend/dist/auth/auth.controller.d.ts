import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<import("./user.entity").User>;
    signIn(signInUserDto: SignInUserDto): Promise<{
        accessToken: string;
    }>;
}
