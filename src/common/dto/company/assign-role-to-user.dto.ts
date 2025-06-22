import { IsInt } from 'class-validator';

export class AssignRoleToUserDto {
  @IsInt()
  userId: number;

  @IsInt()
  companyId: number;

  @IsInt()
  roleId: number;
}
