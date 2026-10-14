import { SetMetadata } from "@nestjs/common"


export const RESPONSE_META_KEY="api_response_meta"

export interface ResponseMetaOptions{
  message: string,
  system_code: string
}

export const ResponseMeta = (options: ResponseMetaOptions) => SetMetadata(RESPONSE_META_KEY, options);