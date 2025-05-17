import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @ApiProperty({
    description: "User Name",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "User Email",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "User Role",
    example: "ADMIN",
    enum: Role,
  })
  role: Role;
}
