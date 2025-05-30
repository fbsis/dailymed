import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { UserModel } from '@/infra/models/UserModel';
import { UserName } from '@/domain/value-objects/UserName';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { UserRole } from '@/domain/value-objects/UserRole';

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!userDoc) return null;

    return new User(
      new UserName(userDoc.name),
      new Email(userDoc.email),
      Password.fromHashed(userDoc.password),
      new UserRole(userDoc.role)
    );
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      name: user.getName().getValue(),
      email: user.getEmail().getValue(),
      password: user.getPassword().getValue(),
      role: user.getRole().getValue(),
    });
  }

  async update(user: User): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email: user.getEmail().getValue() },
      {
        name: user.getName().getValue(),
        password: user.getPassword().getValue(),
        role: user.getRole().getValue(),
      },
      { new: true }
    );
  }

  async delete(email: string): Promise<void> {
    await UserModel.deleteOne({ email: email.toLowerCase() });
  }
} 