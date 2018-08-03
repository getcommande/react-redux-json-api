// flow-typed signature: 98cd441387f8a4cc44d716323e04454f
// flow-typed version: <<STUB>>/json-api_v1.0.0/flow_v0.72.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'json-api'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'json-api' {
  declare type JSON =
    | null
    | void
    | string
    | number
    | boolean
    | { [string]: JSON }
    | Array<JSON>;

  declare type JSONAPIMeta = { [string]: JSON };

  declare type JSONAPILink =
    | string
    | {|
        href: string,
        meta?: JSONAPIMeta,
      |};

  declare type JSONAPILinks = {
    self?: JSONAPILink,
    related?: JSONAPILink,
    [string]: JSONAPILink,
  };

  declare type JSONAPIPaginationLinks = {
    first?: ?JSONAPILink,
    last?: ?JSONAPILink,
    prev?: ?JSONAPILink,
    next?: ?JSONAPILink,
  };

  declare type JSONAPIError = {|
    id?: string,
    links?: {|
      about: JSONAPILink,
    |},
    status?: string,
    code?: string,
    title?: string,
    detail?: string,
    source?: {
      pointer?: string,
      parameter?: string,
    },
    meta?: JSONAPIMeta,
  |};

  declare type JSONAPIObject = {|
    version?: string,
    meta?: JSONAPIMeta,
  |};

  declare type JSONAPIAttributes = {
    [string]: JSON,
  };

  declare type JSONAPIResourceIdentifier = {|
    id: string,
    type: string,
    meta?: JSONAPIMeta,
  |};

  declare type JSONAPIResourceLinkage =
    | Array<JSONAPIResourceIdentifier>
    | JSONAPIResourceIdentifier
    | null;

  declare type JSONAPIRelationship = {|
    links?: {
      self?: JSONAPILink,
      related?: JSONAPILink,
    } & JSONAPILinks,
    data?: JSONAPIResourceLinkage,
    meta?: JSONAPIMeta,
  |};

  declare type JSONAPIRelationships = {
    [string]: JSONAPIRelationship,
  };

  declare type JSONAPIResource = {|
    id?: string,
    type: string,
    attributes?: JSONAPIAttributes,
    relationships?: JSONAPIRelationships,
    links?: JSONAPILinks,
    meta?: JSONAPIMeta,
  |};

  declare type JSONAPIDataDocument = {|
    data:
      | Array<JSONAPIResource | JSONAPIResourceIdentifier>
      | JSONAPIResource
      | JSONAPIResourceIdentifier
      | null,
    meta?: JSONAPIMeta,
    jsonapi?: JSONAPIObject,
    links?: JSONAPIPaginationLinks & JSONAPILinks,
    included?: Array<JSONAPIResource>,
  |};

  declare type JSONAPIMetaDocument = {|
    meta: JSONAPIMeta,
    jsonapi?: JSONAPIObject,
    links?: JSONAPILinks,
  |};

  declare type JSONAPIErrorDocument = {|
    errors: Array<JSONAPIError>,
    meta?: JSONAPIMeta,
    jsonapi?: JSONAPIObject,
    links?: JSONAPILinks,
  |};

  declare type JSONAPIDocument =
    | JSONAPIDataDocument
    | JSONAPIMetaDocument
    | JSONAPIErrorDocument;
}