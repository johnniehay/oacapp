import type { DataFromCollectionSlug} from "payload";
import type { AUTHJS_STRATEGY_NAME } from "../AuthjsAuthStrategy";
import { auth } from "@/auth";
import { AuthCollectionSlug} from "@/lib/payload-authjs-custom/types";

interface Options<TSlug extends AuthCollectionSlug> {
  /**
   * The slug of the collection that contains the users
   *
   * @default "users"
   */
  userCollectionSlug?: TSlug;
}

export interface PayloadSession<TSlug extends AuthCollectionSlug> {
  user: DataFromCollectionSlug<TSlug>;
  expires: string;
  collection?: AuthCollectionSlug;
  strategy?: typeof AUTHJS_STRATEGY_NAME | "local-jwt" | "api-key" | ({} & string);
}

/**
 * Get the payload session from the server-side
 *
 * This function is cached to de-duplicate requests:
 * - using React 'cache' function to memorize within the same request (@see https://react.dev/reference/react/cache)
 * - and using Next.js 'data cache' to cache across multiple requests (@see https://nextjs.org/docs/app/building-your-application/caching#data-cache)
 *
 * You can manually invalidate the cache by calling `revalidateTag("payload-session")`
 */

export const getLocalPayloadSession =
  async <TSlug extends AuthCollectionSlug = "users">({
                                                   userCollectionSlug = "users" as TSlug,
                                                 }: Options<TSlug> = {}): Promise<PayloadSession<TSlug> | null> => {

    // Fetch the session from the server
    const authres = await auth()
    if (!(authres?.user)) {
      return null
    }
    const { user: {id,email,updatedAt,createdAt, ...userrest}, ...authresrest} = authres
    // Assert user properties are defined
    if (!id || !email || !updatedAt || !createdAt) {
      return null
    }

    const result: {
      user: DataFromCollectionSlug<TSlug> ;
      expires: string;
      collection?: AuthCollectionSlug;
      strategy?: string;
    }  = { user:{id, email,updatedAt,createdAt, ...userrest}, ...authresrest };

    // If the response is not ok or the user is not present, return null
    if (!result.user) {
      return null;
    }

    // Return the session
    return {
      user: result.user ,
      // expires: new Date(result.expires * 1000).toISOString(),
      expires: result.expires,
      collection: result.collection,
      strategy: result.strategy,
    };
  }
