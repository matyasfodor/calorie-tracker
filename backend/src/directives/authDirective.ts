import { GraphQLSchema } from "graphql/type/schema"
import {getDirective, mapSchema, MapperKind} from '@graphql-tools/utils';
import { defaultFieldResolver } from "graphql/execution/execute";
import { AuthenticationError } from "apollo-server-errors";

// Inspired from https://www.graphql-tools.com/docs/schema-directives#enforcing-access-permissions

function getAuthDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: Role = ADMIN,
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
      ADMIN
      REVIEWER
      USER
      UNKNOWN
    }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: type => {
          // console.log('### MApper kind. type', type, getDirective(schema, type, directiveName));
          const authDirective = getDirective(schema, type, directiveName)?.[0]
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective
          }
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]

          if (authDirective) {
            const { requires } = authDirective
            if (requires) {

              const { resolve = defaultFieldResolver } = fieldConfig

              fieldConfig.resolve = function (source, args, context, info) {
                if (requires !== 'UNKNOWN' && context.user === null) {
                  throw new AuthenticationError(`User should be authenticated to access field ${fieldConfig.astNode?.name.value}`)
                } else if (requires === 'ADMIN' && !context?.isAdmin) {
                  throw new AuthenticationError(`User is not authorized to access field ${fieldConfig.astNode?.name.value}`)
                }

                return resolve(source, args, context, info)
              }
              return fieldConfig
            }
          }
        }
      })
  }
}

export const authDirective = getAuthDirective('auth');
