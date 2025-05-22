import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({
    description: "The id of the order",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The name of the order",
    example: "AlphaGummy",
  })
  name: string;

  @ApiProperty({
    description: "The user id of the order",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  userId: string;

  @ApiProperty({
    description: "The products of the order",
    example: ["AlphaGummy", "LipoGummies"],
  })
  products: string[];

  @ApiProperty({
    description: "The tracking number of the order",
    example: "1234567890",
  })
  trackingNumber: string | null;
}
