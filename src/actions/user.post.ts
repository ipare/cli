import { Action } from "@ipare/router";
import { Body } from "@ipare/pipe";
import { IsString, IsNumberString } from "class-validator";

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - user
 *     description: Get user info
 *     requestBody:
 *       description: User info
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               account:
 *                 type: string
 *                 description: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       404:
 *         description: The account not existing or error password
 */
export default class extends Action {
  @Body
  private readonly userInfo!: any;

  @IsString()
  @Body("userName")
  private readonly userName!: string;
  @IsNumberString()
  @Body("userId")
  private readonly uid!: string;

  async invoke(): Promise<void> {
    this.ok(this.userInfo);
  }
}
