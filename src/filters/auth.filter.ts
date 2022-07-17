import { HttpContext } from "@ipare/core";
import { AuthorizationFilter } from "@ipare/filter";

export class AuthFilter implements AuthorizationFilter {
  onAuthorization(ctx: HttpContext): boolean | Promise<boolean> {
    ctx.bag("user", {
      id: 1,
      email: "hi@hal.wang",
    });

    return true;
    // return false to intercept
  }
}
