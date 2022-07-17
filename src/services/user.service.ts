import { HttpContext } from "@ipare/core";
import { Context, Query } from "@ipare/pipe";
import { IsString, IsNumberString } from "class-validator";

export class UserService {
  @Context
  private readonly ctx!: HttpContext;

  @IsString()
  @Query("userName")
  private readonly userName!: string;
  @IsNumberString()
  @Query("userId")
  private readonly uid!: string;

  public getUserInfo() {
    this.ctx.res.setHeader("test-header", "ipare");

    return {
      id: 1,
      email: "hi@hal.wang",
    };
  }
}
