import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: "User Email",
    example: "john.doe@example.com",
  })
  email: string;
}
