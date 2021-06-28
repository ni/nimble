import { DesignToken } from "@microsoft/fast-foundation";
import { White } from "@ni/nimble-tokens/dist/styledictionary/js/tokens"
const { create } = DesignToken;

//Color Tokens
export const fillColor = create<string>("fill-color").withDefault(White);