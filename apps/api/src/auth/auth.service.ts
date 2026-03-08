import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, username: string, pass: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser)
      throw new ConflictException('El correo ya está registrado');

    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername)
      throw new ConflictException('El nombre de usuario ya está en uso');

    const passwordHash = await bcrypt.hash(pass, 10);

    const user = await this.usersService.create({
      email,
      username,
      passwordHash,
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    if (!user.passwordHash) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales inválidas');

    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(id: string, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id, email, role },
    };
  }
}
