import { Controller } from "@nestjs/common";
import { Role } from "src/decorators/roles.decorator";

@Role("ADMIN")
@Controller("file")
export class FileController {
  constructor() {}
}
