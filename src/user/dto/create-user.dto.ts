import { ApiProperty } from "@nestjs/swagger";

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
    description: "User Products",
    example: ["Product 1", "Product 2"],
    type: [String],
  })
  products: string[];
}
