import { UseFilters } from "@ipare/filter";
import { Inject } from "@ipare/inject";
import { Header } from "@ipare/pipe";
import { Action } from "@ipare/router";
import { AuthFilter } from "../filters/auth.filter";
import { UserService } from "../services/user.service";

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - user
 *     description: Get user info
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *     security:
 *       - password: []
 */
@UseFilters(AuthFilter)
export default class extends Action {
  @Inject
  private readonly userService!: UserService;

  @Header("host")
  private readonly host!: string;

  async invoke(): Promise<void> {
    const userInfo = this.userService.getUserInfo();
    this.ok(userInfo);
  }
}
